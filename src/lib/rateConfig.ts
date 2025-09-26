export type TobaccoKey = "Yes" | "No" | "ALL";

export type RateTables = {
  rate_tables: Record<
    string, // product
    Record<
      string, // state or "ALL"
      Record<
        string, // age band or "ALL"
        Record<TobaccoKey, number>
      >
    >
  >;
};

export async function loadRateTables(): Promise<RateTables> {
  const data = await import("./rateTablesConfig.json");
  // light shape checks
  if (!data || typeof data !== "object" || !("rate_tables" in data)) {
    throw new Error("Invalid rate tables config.");
  }
  return data as RateTables;
}
