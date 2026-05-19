import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HEALTH_CHART_Y_DOMAIN } from "@/lib/chart-y-domain";
import type { VolumeDatum } from "@/types/charts";

const GRID = "hsla(270, 25%, 22%, 0.45)";

/** Green → teal → purple (site palette). */
const SERIES = [
  { key: "waist" as const, name: "Waist", stroke: "#00ff88" },
  { key: "sides" as const, name: "Sides", stroke: "#3dd6c6" },
  { key: "hips" as const, name: "Hips", stroke: "#b56cff" },
];

const LINE_WIDTH = 1;

function formatShortDate(raw: string) {
  const d = new Date(raw + "T12:00:00");
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type Props = {
  title?: string;
  subtitle?: string;
  data: VolumeDatum[];
};

export function VolumesMultiLineChart({
  title = "Volumes",
  subtitle = "Waist, sides, hips (cm)",
  data,
}: Props) {
  const chartData = data.map((d) => ({
    ...d,
    t: new Date(d.date + "T12:00:00").getTime(),
    label: formatShortDate(d.date),
  }));

  return (
    <div className="rounded-xl border border-border/80 bg-card/30 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-0.5">
        <h2 className="text-sm font-semibold tracking-wide text-foreground">{title}</h2>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="h-[280px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground">
            No volume measurements
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="4 8" vertical={false} />
              <XAxis
                type="number"
                dataKey="t"
                domain={["dataMin", "dataMax"]}
                scale="time"
                tick={{ fill: "hsl(270 10% 62%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(ts) => formatShortDate(new Date(ts).toISOString().slice(0, 10))}
                minTickGap={28}
              />
              <YAxis
                domain={HEALTH_CHART_Y_DOMAIN}
                tick={{ fill: "hsl(270 10% 62%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ stroke: "hsla(150, 100%, 50%, 0.25)", strokeWidth: 1 }}
                contentStyle={{
                  background: "hsl(270 35% 8%)",
                  border: "1px solid hsl(270 25% 22%)",
                  borderRadius: 10,
                  fontSize: 12,
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                }}
                labelFormatter={(_, items) => {
                  const p = items?.[0]?.payload as { date?: string } | undefined;
                  return p?.date ?? "";
                }}
                formatter={(value: unknown, name: string) => {
                  const v = typeof value === "number" ? value : Number(value);
                  return [Number.isFinite(v) ? `${v} cm` : "—", name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="line" />
              {SERIES.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.stroke}
                  strokeWidth={LINE_WIDTH}
                  dot={false}
                  connectNulls
                  activeDot={{ r: 3, fill: s.stroke, stroke: "hsl(270 35% 8%)", strokeWidth: 1 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
