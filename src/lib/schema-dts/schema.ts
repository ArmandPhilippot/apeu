import type { Graph } from "schema-dts";

/**
 * Retrieve a JSON-LD schema from the given graphs.
 *
 * @param {Graph['@graph']} graphs - The graphs.
 * @returns {Graph} The JSON-LD schema.
 */
export const getJsonLdSchema = (graphs: Graph["@graph"]): Graph => {
  return {
    "@context": "https://schema.org",
    "@graph": graphs,
  };
};
