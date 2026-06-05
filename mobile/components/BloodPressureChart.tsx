import React from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { BloodPressureRecord } from "../types/bloodPressure";
import { formatDate } from "../utils/date";

type Props = {
  records: BloodPressureRecord[];
};

const screenWidth = Dimensions.get("window").width;

export default function BloodPressureChart({ records }: Props) {
  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>記録がありません</Text>
      </View>
    );
  }

  const sorted = [...records].sort(
    (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  );

  const labels = sorted.map((r) => formatDate(r.measuredAt));
  const systolicData = sorted.map((r) => r.systolic);
  const diastolicData = sorted.map((r) => r.diastolic);

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: () => "#888",
    strokeWidth: 2,
    propsForDots: { r: "4" },
  };

  const chartData = {
    labels,
    datasets: [
      {
        data: systolicData,
        color: () => "#2196F3",
        strokeWidth: 2,
      },
      {
        data: diastolicData,
        color: () => "#4CAF50",
        strokeWidth: 2,
      },
    ],
    legend: ["上の血圧", "下の血圧"],
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <LineChart
          data={chartData}
          width={Math.max(screenWidth - 32, sorted.length * 50)}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chart: {
    borderRadius: 12,
  },
  empty: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#aaa",
  },
});
