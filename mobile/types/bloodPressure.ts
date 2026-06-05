export type TimeZone = "朝" | "昼" | "夜";

export type BloodPressureRecord = {
  id: number;
  systolic: number;
  diastolic: number;
  pulse?: number | null;
  timeZone?: TimeZone | null;
  memo?: string | null;
  measuredAt: string;
  createdAt: string;
  updatedAt?: string | null;
};

export type NewBloodPressureRecord = {
  systolic: number;
  diastolic: number;
  pulse?: number | null;
  timeZone?: TimeZone | null;
  memo?: string | null;
  measuredAt: string;
};
