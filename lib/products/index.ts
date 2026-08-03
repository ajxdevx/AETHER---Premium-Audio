/**
 * Product data layers:
 * constants contain raw catalog data and source-specific records.
 * lib/products exposes the domain and display API used by the app.
 * services own network access and apply this domain API to responses.
 */
export * from "./catalog";
export * from "./colors";
export * from "./display";
export * from "./ratings";
export * from "./applyCatalog";
export * from "./max";
