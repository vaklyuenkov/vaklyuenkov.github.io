import type { DatedPoint, HealthJsonPayload, VolumeDatum } from "@/types/charts";

function normHeader(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function parseNum(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined;
  const n = Number(String(v).trim().replace(",", ".").replace(/\s/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function pickValue(row: Record<string, unknown>, test: (norm: string) => boolean): unknown {
  for (const [key, val] of Object.entries(row)) {
    if (test(normHeader(key))) return val;
  }
  return undefined;
}

/** Google Sheets serial: days since 1899-12-30 (same as Excel for modern dates). */
function fromSheetSerial(serial: number): string {
  const epoch = Date.UTC(1899, 11, 30);
  return new Date(epoch + serial * 86400000).toISOString().slice(0, 10);
}

function parseDate(raw: unknown): string {
  if (raw == null || raw === "") return "";

  if (typeof raw === "number" && Number.isFinite(raw)) {
    if (raw > 20_000 && raw < 60_000) return fromSheetSerial(raw);
    return "";
  }

  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  if (/^\d{5}(\.\d+)?$/.test(s)) {
    const serial = Number(s);
    if (serial > 20_000 && serial < 60_000) return fromSheetSerial(serial);
  }

  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t).toISOString().slice(0, 10);
  return "";
}

/** OpenSheet rows → weight + volume series (sheet “health public”). */
export function parseHealthRows(rows: Record<string, unknown>[]): HealthJsonPayload {
  const weightMap = new Map<string, number>();
  const volumeMap = new Map<string, { waist?: number; sides?: number; hips?: number }>();

  for (const row of rows) {
    const date = parseDate(pickValue(row, (n) => n === "date"));
    if (!date) continue;

    const w = parseNum(
      pickValue(row, (n) => (n.includes("weight") || n.includes("weigth")) && n.includes("kg")),
    );
    if (w !== undefined) weightMap.set(date, w);

    const waist = parseNum(pickValue(row, (n) => n.includes("waist")));
    const sides = parseNum(pickValue(row, (n) => n.includes("sides")));
    const hips = parseNum(pickValue(row, (n) => n.includes("hips")));
    if (waist === undefined && sides === undefined && hips === undefined) continue;

    const cur = volumeMap.get(date) ?? {};
    if (waist !== undefined) cur.waist = waist;
    if (sides !== undefined) cur.sides = sides;
    if (hips !== undefined) cur.hips = hips;
    volumeMap.set(date, cur);
  }

  const weight: DatedPoint[] = [...weightMap.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const volumes: VolumeDatum[] = [...volumeMap.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return { weight, volumes };
}
