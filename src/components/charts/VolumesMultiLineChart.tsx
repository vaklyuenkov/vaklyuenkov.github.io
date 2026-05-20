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
import { ChartFrame } from "@/components/charts/ChartFrame";
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
    <div className="min-w-0 rounded-xl border border-border/80 bg-card/30 p-3 sm:p-5">
      <div className="mb-3 flex flex-col gap-0.5 sm:mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-foreground">{title}</h2>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <ChartFrame empty={chartData.length === 0} emptyLabel="No volume measurements">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="4 8" vertical={false} />
              <XAxis
                type="number"
                dataKey="t"
                domain={["dataMin", "dataMax"]}
                scale="time"
                tick={{ fill: "hsl(270 10% 62%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(ts) => formatShortDate(new Date(ts).toISOString().slice(0, 10))}
                minTickGap={20}
              />
              <YAxis
                domain={HEALTH_CHART_Y_DOMAIN}
                tick={{ fill: "hsl(270 10% 62%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
                width={32}
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
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} iconType="line" />
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
      </ChartFrame>
    </div>
  );
}
