import { MinimalLineChart } from "@/components/charts/MinimalLineChart";
import { VolumesMultiLineChart } from "@/components/charts/VolumesMultiLineChart";
import type { HealthJsonPayload } from "@/types/charts";

type Props = {
  data: HealthJsonPayload;
};

export function HealthDashboard({ data }: Props) {
  const { weight, volumes } = data;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Health</h1>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <MinimalLineChart title="Weight" subtitle="kg" points={weight} valueLabel="kg" />
        <VolumesMultiLineChart data={volumes} />
      </div>
    </div>
  );
}
