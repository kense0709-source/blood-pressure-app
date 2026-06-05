import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { getTodayLatestRecord } from "../database/bloodPressureRepository";
import { BloodPressureRecord } from "../types/bloodPressure";
import { formatDateTime } from "../utils/date";

export default function HomeScreen() {
  const router = useRouter();
  const [latest, setLatest] = useState<BloodPressureRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      getTodayLatestRecord().then(setLatest);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>血圧記録</Text>
      </View>

      <View style={styles.todayCard}>
        <Text style={styles.todayLabel}>今日の最新記録</Text>
        {latest ? (
          <>
            <View style={styles.bpRow}>
              <Text style={styles.bpValue}>{latest.systolic}</Text>
              <Text style={styles.bpSep}>/</Text>
              <Text style={styles.bpValue}>{latest.diastolic}</Text>
              <Text style={styles.bpUnit}>mmHg</Text>
            </View>
            {latest.pulse && (
              <Text style={styles.pulseText}>脈拍: {latest.pulse} bpm</Text>
            )}
            <Text style={styles.measuredAt}>{formatDateTime(latest.measuredAt)}</Text>
          </>
        ) : (
          <Text style={styles.noRecord}>まだ記録がありません</Text>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/add")}
        >
          <Text style={styles.primaryBtnText}>+ 記録を追加</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/records")}
        >
          <Text style={styles.secondaryBtnText}>記録一覧</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/chart")}
        >
          <Text style={styles.secondaryBtnText}>グラフ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

HomeScreen.options = { title: "ホーム" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  todayCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  todayLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  bpRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bpValue: {
    fontSize: 44,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  bpSep: {
    fontSize: 32,
    color: "#888",
    marginHorizontal: 6,
  },
  bpUnit: {
    fontSize: 16,
    color: "#888",
    marginLeft: 4,
  },
  pulseText: {
    fontSize: 15,
    color: "#e74c3c",
    marginTop: 6,
  },
  measuredAt: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 8,
  },
  noRecord: {
    fontSize: 15,
    color: "#aaa",
    paddingVertical: 16,
    textAlign: "center",
  },
  buttons: {
    paddingHorizontal: 16,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  secondaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  secondaryBtnText: {
    fontSize: 16,
    color: "#2196F3",
    fontWeight: "600",
  },
});
