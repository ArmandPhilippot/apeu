import type { AstroIntegration } from "astro";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";

// `sirv` will most likely only be used in this file so:
// cSpell:ignore -- sirv

export const pagefind = (() => {
  let outDir: string | null = null;

  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": async ({ command, config, logger }) => {
        if (command !== "dev") return;

        logger.info("Checking if search index is available...");

        outDir = fileURLToPath(
          config.adapter?.name === "@astrojs/node" && config.output === "static"
            ? config.build.client
            : config.outDir,
        );

        const pagefindDir = join(outDir, "/pagefind");

        try {
          await access(pagefindDir);
          logger.info("Search index found!");
        } catch {
          logger.warn(
            "You need to run `pnpm build` once to be able to use search features in dev mode.",
          );
        }
      },
      "astro:server:setup": ({ logger, server }) => {
        if (!outDir) {
          logger.warn(
            "Couldn't determine Pagefind output directory. Search will not be available.",
          );

          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });

        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ dir, logger }) => {
        const targetDir = fileURLToPath(dir);
        const cwd = dirname(fileURLToPath(import.meta.url));
        const relativeDir = relative(cwd, targetDir);

        logger.info("Building the search index...");

        return new Promise<void>((resolve) => {
          spawn("npx", ["-y", "pagefind", "--site", relativeDir], {
            stdio: "inherit",
            shell: true,
            cwd,
          }).on("close", () => resolve());
        });
      },
    },
  };
}) satisfies () => AstroIntegration;
