import type { Graph } from "schema-dts";

/**
 * Retrieve a JSON-LD schema from the given graphs.
 *
 * @param {Graph['@graph']} graphs - The graphs to build the schema.
 * @returns {Graph} The schema in JSON-LD format.
 */
export const getJsonLdSchema = (graphs: Graph["@graph"]): Graph => {
  return {
    "@context": "https://schema.org",
    "@graph": graphs,
  };
};
