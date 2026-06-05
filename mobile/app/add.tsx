import React from "react";
import { useRouter } from "expo-router";
import BloodPressureForm from "../components/BloodPressureForm";
import { insertRecord } from "../database/bloodPressureRepository";
import { nowISOString } from "../utils/date";

export default function AddScreen() {
  const router = useRouter();

  async function handleSave(data: {
    systolic: number;
    diastolic: number;
    pulse?: number | null;
    timeZone?: "朝" | "昼" | "夜" | null;
    memo?: string | null;
  }) {
    await insertRecord({
      ...data,
      measuredAt: nowISOString(),
    });
    router.back();
  }

  return (
    <BloodPressureForm
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}

AddScreen.options = { title: "記録を追加" };
