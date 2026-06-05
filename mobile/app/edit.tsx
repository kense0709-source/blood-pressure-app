import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BloodPressureForm from "../components/BloodPressureForm";
import { getRecordById, updateRecord } from "../database/bloodPressureRepository";
import { BloodPressureRecord } from "../types/bloodPressure";

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<BloodPressureRecord | null>(null);

  useEffect(() => {
    if (id) getRecordById(Number(id)).then(setRecord);
  }, [id]);

  async function handleSave(data: {
    systolic: number;
    diastolic: number;
    pulse?: number | null;
    timeZone?: "朝" | "昼" | "夜" | null;
    memo?: string | null;
  }) {
    await updateRecord(Number(id), data);
    router.back();
  }

  if (!record) {
    return (
      <View style={styles.loading}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <BloodPressureForm
      initialSystolic={String(record.systolic)}
      initialDiastolic={String(record.diastolic)}
      initialPulse={record.pulse ? String(record.pulse) : ""}
      initialTimeZone={record.timeZone}
      initialMemo={record.memo ?? ""}
      onSave={handleSave}
      onCancel={() => router.back()}
    />
  );
}

EditScreen.options = { title: "記録を編集" };

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});
