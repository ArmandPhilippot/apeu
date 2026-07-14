import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
} from "astro";
import * as pagefind from "pagefind";
import sirv from "sirv";

// `sirv` will most likely only be used in this file so:
// cSpell:ignore -- sirv

const oneSecondInMs = 1000;
const twoDecimals = 2;

type PagefindResponse = {
  errors: string[];
};

// Assertion function cannot use arrow function syntax because of a TypeScript limitation.
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

const formatElapsedTime = (elapsed: number): string =>
  elapsed < oneSecondInMs
    ? `${Math.round(elapsed)}ms`
    : `${(elapsed / oneSecondInMs).toFixed(twoDecimals)}s`;

// Runs in its own process: calling `build()` in-process here would tear down
// the Vite module runner the running `astro dev` command still needs.
const buildScript = `
import { build } from "astro";
await build({ root: process.argv[1] }, { devOutput: true });
`;

const runAstroBuild = async (root: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--input-type=module", "--eval", buildScript, "--", root],
      { cwd: root, stdio: "inherit" }
    );

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`\`astro build\` exited with code ${String(code)}.`));
      }
    });
  });
};

const ensureSearchIndex = async (
  config: AstroConfig,
  logger: AstroIntegrationLogger
): Promise<string> => {
  const outDir = fileURLToPath(
    config.adapter?.name === "@astrojs/node" && config.output === "static"
      ? config.build.client
      : config.outDir
  );
  const pagefindDir = join(outDir, "/pagefind");

  try {
    await access(pagefindDir);
    logger.info("Search index found!");
    return outDir;
  } catch {
    logger.warn(
      "No search index found. Building the site once to enable search in dev mode…"
    );
  }

  try {
    await runAstroBuild(fileURLToPath(config.root));
    logger.info("Search index built!");
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logger.warn(
      `Failed to build the search index automatically: ${reason}. Run \`pnpm build\` manually to enable search in dev mode.`
    );
  }

  return outDir;
};

const buildSearchIndex = async (dir: URL, logger: AstroIntegrationLogger) => {
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
};

/**
 * Pagefind search integration for Astro.
 *
 * @returns {AstroIntegration} An Astro integration that adds Pagefind search functionality.
 */
export const pagefindSearch = (() => {
  let outDir: string | null = null;
  // `astro:server:setup` doesn't expose `command`, so we remember whether
  // we're actually in `astro dev` here instead.
  let isDevCommand = false;

  return {
    name: "pagefind",
    hooks: {
      "astro:config:setup": async ({ command, config, logger }) => {
        isDevCommand = command === "dev";

        if (!isDevCommand) return;

        logger.info("Checking if search index is available...");

        outDir = await ensureSearchIndex(config, logger);
      },
      "astro:server:setup": ({ server }) => {
        // A `--devOutput` build (used by `runAstroBuild` above) makes Astro's
        // internal Vite server report `isProduction: false`, so we need to
        // check `isDevCommand` in addition to `outDir`.
        if (!isDevCommand || outDir === null) return;

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
