export interface BpsMacroData {
  gdpGrowth?: string;
  // additional fields as needed
}

export interface FredInterestData {
  value?: number;
  indexName?: string;
}

export interface PolygonMarketData {
  symbol: string;
  price: string;
}

export interface CivicRegistryData {
  civicProjects?: number;
}

// TODO: Add remaining interfaces for other feed structures.
