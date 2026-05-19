export type StatsSection = {
  id: string;
  label: string;
  source: "opensheet_health";
};

export const STATS_SECTIONS: StatsSection[] = [
  {
    id: "health",
    label: "Health",
    source: "opensheet_health",
  },
];
