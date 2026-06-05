import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import BloodPressureChart from "../components/BloodPressureChart";
import { getRecentRecords } from "../database/bloodPressureRepository";
import { BloodPressureRecord } from "../types/bloodPressure";

const LIMITS = [7, 30] as const;

export default function ChartScreen() {
  const [records, setRecords] = useState<BloodPressureRecord[]>([]);
  const [limit, setLimit] = useState<7 | 30>(30);

  useFocusEffect(
    useCallback(() => {
      getRecentRecords(limit).then(setRecords);
    }, [limit])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.limitRow}>
          {LIMITS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.limitBtn, limit === l && styles.limitBtnActive]}
              onPress={() => setLimit(l)}
            >
              <Text style={[styles.limitBtnText, limit === l && styles.limitBtnTextActive]}>
                直近{l}件
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#2196F3" }]} />
              <Text style={styles.legendText}>上の血圧</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>下の血圧</Text>
            </View>
          </View>
          <BloodPressureChart records={records} />
        </View>

        {records.length > 0 && (
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>統計（直近{limit}件）</Text>
            <View style={styles.statsRow}>
              <StatItem
                label="上の血圧 平均"
                value={Math.round(records.reduce((s, r) => s + r.systolic, 0) / records.length)}
                unit="mmHg"
              />
              <StatItem
                label="下の血圧 平均"
                value={Math.round(records.reduce((s, r) => s + r.diastolic, 0) / records.length)}
                unit="mmHg"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

ChartScreen.options = { title: "グラフ" };

function StatItem({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  content: { padding: 16 },
  limitRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  limitBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  limitBtnActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  limitBtnText: { fontSize: 14, color: "#666" },
  limitBtnTextActive: { color: "#fff", fontWeight: "600" },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendColor: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, color: "#666" },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  statsRow: { flexDirection: "row" },
  statItem: { flex: 1, alignItems: "center" },
  statLabel: { fontSize: 12, color: "#888", marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: "bold", color: "#1a1a2e" },
  statUnit: { fontSize: 12, color: "#888", marginTop: 2 },
});
