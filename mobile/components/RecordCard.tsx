import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BloodPressureRecord } from "../types/bloodPressure";
import { formatDateTime } from "../utils/date";

type Props = {
  record: BloodPressureRecord;
  onPress: () => void;
  onDelete: () => void;
};

export default function RecordCard({ record, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDateTime(record.measuredAt)}</Text>
        {record.timeZone && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{record.timeZone}</Text>
          </View>
        )}
      </View>
      <View style={styles.values}>
        <View style={styles.bp}>
          <Text style={styles.bpValue}>{record.systolic}</Text>
          <Text style={styles.bpSeparator}>/</Text>
          <Text style={styles.bpValue}>{record.diastolic}</Text>
          <Text style={styles.bpUnit}>mmHg</Text>
        </View>
        {record.pulse && (
          <View style={styles.pulse}>
            <Text style={styles.pulseValue}>{record.pulse}</Text>
            <Text style={styles.pulseUnit}>bpm</Text>
          </View>
        )}
      </View>
      {record.memo ? (
        <Text style={styles.memo} numberOfLines={1}>{record.memo}</Text>
      ) : null}
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.deleteBtnText}>削除</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#888",
  },
  badge: {
    backgroundColor: "#E8F4FD",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    color: "#2196F3",
  },
  values: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  bp: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  bpValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  bpSeparator: {
    fontSize: 22,
    color: "#888",
    marginHorizontal: 4,
  },
  bpUnit: {
    fontSize: 13,
    color: "#888",
    marginLeft: 4,
  },
  pulse: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pulseValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#e74c3c",
  },
  pulseUnit: {
    fontSize: 12,
    color: "#888",
    marginLeft: 2,
  },
  memo: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
  deleteBtn: {
    position: "absolute",
    bottom: 12,
    right: 16,
  },
  deleteBtnText: {
    fontSize: 13,
    color: "#e74c3c",
  },
});
