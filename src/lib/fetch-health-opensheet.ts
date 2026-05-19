import { healthOpenSheetUrl } from "@/config/google-sheet";
import { parseHealthRows } from "@/lib/parse-health-rows";
import type { HealthJsonPayload } from "@/types/charts";

/**
 * Loads tab “health public” from public spreadsheet via OpenSheet.
 * OpenSheet only allows `?raw=true` as a query param; other params return 400.
 * @see https://opensheet.elk.sh/
 */
export async function fetchHealthOpenSheet(signal: AbortSignal): Promise<HealthJsonPayload> {
  const res = await fetch(healthOpenSheetUrl(), {
    signal,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`OpenSheet: ${res.status} ${res.statusText}`);
  }
  const rows = (await res.json()) as Record<string, unknown>[];
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("OpenSheet: empty response");
  }
  return parseHealthRows(rows);
}
