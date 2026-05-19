export type DatedPoint = {
  date: string;
  value: number;
};

export type VolumeDatum = {
  date: string;
  waist?: number;
  sides?: number;
  hips?: number;
};

export type HealthJsonPayload = {
  weight: DatedPoint[];
  volumes: VolumeDatum[];
};
