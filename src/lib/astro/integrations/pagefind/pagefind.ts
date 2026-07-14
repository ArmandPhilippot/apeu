import { access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import * as pagefind from "pagefind";
import sirv from "sirv";

// `sirv` will most likely only be used in this file so:
// cSpell:ignore -- sirv

const oneSecondInMs = 1000;
const twoDecimals = 2;

type PagefindResponse = {
  errors: string[];
};

function assertPagefindResponse<T extends PagefindResponse>(
  response: T,
  logger: AstroIntegrationLogger
): asserts response is Required<T> {
  if (response.errors.length === 0) return;
  for (const error of response.errors) {
    logger.error(error);
  }
  throw new Error(
    `Pagefind response contains errors: ${response.errors.join(", ")}`
  );
}

function formatElapsedTime(elapsed: number): string {
  return elapsed < oneSecondInMs
    ? `${Math.round(elapsed)}ms`
    : `${(elapsed / oneSecondInMs).toFixed(twoDecimals)}s`;
}

async function buildSearchIndex(dir: URL, logger: AstroIntegrationLogger) {
  const targetDir = fileURLToPath(dir);
  const outputPath = fileURLToPath(new URL("./pagefind/", dir));

  try {
    const start = performance.now();
    logger.info("Building the search index...");

    const indexResponse = await pagefind.createIndex();
    assertPagefindResponse(indexResponse, logger);

    const indexingResponse = await indexResponse.index.addDirectory({
      path: targetDir,
    });
    assertPagefindResponse(indexingResponse, logger);

    const writingResponse = await indexResponse.index.writeFiles({
      outputPath,
    });
    assertPagefindResponse(writingResponse, logger);

    const elapsed = performance.now() - start;
    logger.info(`Search index built in ${formatElapsedTime(elapsed)}.`);
  } catch (error) {
    throw new Error("Failed to build the search index.", { cause: error });
  } finally {
    await pagefind.close();
  }
}

export const pagefindSearch = (() => {
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
            : config.outDir
        );

        const pagefindDir = join(outDir, "/pagefind");

        try {
          await access(pagefindDir);
          logger.info("Search index found!");
        } catch {
          logger.warn(
            "You need to run `pnpm build` once to be able to use search features in dev mode."
          );
        }
      },
      "astro:server:setup": ({ logger, server }) => {
        if (outDir === null) {
          logger.warn(
            "Couldn't determine Pagefind output directory. Search will not be available."
          );

          return;
        }

        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });

        server.middlewares.use((req, res, next) => {
          if (typeof req.url === "string" && req.url.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": async ({ dir, logger }) =>
        buildSearchIndex(dir, logger),
    },
  };
}) satisfies () => AstroIntegration;
