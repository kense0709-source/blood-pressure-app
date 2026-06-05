import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { getRecordById, deleteRecord } from "../database/bloodPressureRepository";
import { BloodPressureRecord } from "../types/bloodPressure";
import { formatDateTime } from "../utils/date";

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<BloodPressureRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (id) getRecordById(Number(id)).then(setRecord);
    }, [id])
  );

  async function handleDelete() {
    Alert.alert("削除確認", "この記録を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await deleteRecord(Number(id));
          router.back();
        },
      },
    ]);
  }

  if (!record) {
    return (
      <View style={styles.loading}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.bpRow}>
            <View style={styles.bpItem}>
              <Text style={styles.bpLabel}>上の血圧</Text>
              <Text style={styles.bpValue}>{record.systolic}</Text>
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
            <Text style={styles.bpSep}>/</Text>
            <View style={styles.bpItem}>
              <Text style={styles.bpLabel}>下の血圧</Text>
              <Text style={styles.bpValue}>{record.diastolic}</Text>
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
          </View>

          {record.pulse && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>脈拍</Text>
              <Text style={styles.rowValue}>{record.pulse} bpm</Text>
            </View>
          )}
          {record.timeZone && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>時間帯</Text>
              <Text style={styles.rowValue}>{record.timeZone}</Text>
            </View>
          )}
          {record.memo && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>メモ</Text>
              <Text style={styles.rowValueMemo}>{record.memo}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>記録日時</Text>
            <Text style={styles.rowValue}>{formatDateTime(record.measuredAt)}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/edit?id=${record.id}`)}
          >
            <Text style={styles.editBtnText}>編集</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>削除</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

RecordDetailScreen.options = { title: "記録詳細" };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bpRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  bpItem: { alignItems: "center" },
  bpLabel: { fontSize: 13, color: "#888", marginBottom: 4 },
  bpValue: { fontSize: 48, fontWeight: "bold", color: "#1a1a2e" },
  bpUnit: { fontSize: 13, color: "#888", marginTop: 4 },
  bpSep: { fontSize: 36, color: "#ccc", marginHorizontal: 12, marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  rowLabel: { fontSize: 14, color: "#888" },
  rowValue: { fontSize: 15, color: "#1a1a2e", fontWeight: "500" },
  rowValueMemo: { fontSize: 14, color: "#444", flex: 1, textAlign: "right" },
  buttons: { flexDirection: "row", gap: 12, marginTop: 24 },
  editBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  editBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e74c3c",
    alignItems: "center",
  },
  deleteBtnText: { fontSize: 16, color: "#e74c3c", fontWeight: "600" },
});
