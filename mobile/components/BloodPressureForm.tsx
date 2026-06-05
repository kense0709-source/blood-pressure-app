import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { TimeZone } from "../types/bloodPressure";
import { validateBloodPressure } from "../utils/validation";

type Props = {
  initialSystolic?: string;
  initialDiastolic?: string;
  initialPulse?: string;
  initialTimeZone?: TimeZone | null;
  initialMemo?: string;
  onSave: (data: {
    systolic: number;
    diastolic: number;
    pulse?: number | null;
    timeZone?: TimeZone | null;
    memo?: string | null;
  }) => void;
  onCancel: () => void;
};

const TIME_ZONES: TimeZone[] = ["朝", "昼", "夜"];

export default function BloodPressureForm({
  initialSystolic = "",
  initialDiastolic = "",
  initialPulse = "",
  initialTimeZone = null,
  initialMemo = "",
  onSave,
  onCancel,
}: Props) {
  const [systolic, setSystolic] = useState(initialSystolic);
  const [diastolic, setDiastolic] = useState(initialDiastolic);
  const [pulse, setPulse] = useState(initialPulse);
  const [timeZone, setTimeZone] = useState<TimeZone | null>(initialTimeZone);
  const [memo, setMemo] = useState(initialMemo);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSave() {
    const result = validateBloodPressure(systolic, diastolic, pulse, memo);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    onSave({
      systolic: parseInt(systolic, 10),
      diastolic: parseInt(diastolic, 10),
      pulse: pulse.trim() ? parseInt(pulse, 10) : null,
      timeZone,
      memo: memo.trim() || null,
    });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.field}>
        <Text style={styles.label}>上の血圧 (mmHg) *</Text>
        <TextInput
          style={[styles.input, errors.systolic ? styles.inputError : null]}
          value={systolic}
          onChangeText={setSystolic}
          keyboardType="numeric"
          placeholder="例: 120"
          placeholderTextColor="#bbb"
        />
        {errors.systolic ? <Text style={styles.error}>{errors.systolic}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>下の血圧 (mmHg) *</Text>
        <TextInput
          style={[styles.input, errors.diastolic ? styles.inputError : null]}
          value={diastolic}
          onChangeText={setDiastolic}
          keyboardType="numeric"
          placeholder="例: 80"
          placeholderTextColor="#bbb"
        />
        {errors.diastolic ? <Text style={styles.error}>{errors.diastolic}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>脈拍 (bpm)</Text>
        <TextInput
          style={[styles.input, errors.pulse ? styles.inputError : null]}
          value={pulse}
          onChangeText={setPulse}
          keyboardType="numeric"
          placeholder="例: 72"
          placeholderTextColor="#bbb"
        />
        {errors.pulse ? <Text style={styles.error}>{errors.pulse}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>時間帯</Text>
        <View style={styles.timeZoneRow}>
          {TIME_ZONES.map((tz) => (
            <TouchableOpacity
              key={tz}
              style={[styles.timeZoneBtn, timeZone === tz && styles.timeZoneBtnActive]}
              onPress={() => setTimeZone(timeZone === tz ? null : tz)}
            >
              <Text style={[styles.timeZoneBtnText, timeZone === tz && styles.timeZoneBtnTextActive]}>
                {tz}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>メモ</Text>
        <TextInput
          style={[styles.input, styles.memoInput, errors.memo ? styles.inputError : null]}
          value={memo}
          onChangeText={setMemo}
          placeholder="体調や状況など"
          placeholderTextColor="#bbb"
          multiline
          maxLength={200}
        />
        <Text style={styles.charCount}>{memo.length}/200</Text>
        {errors.memo ? <Text style={styles.error}>{errors.memo}</Text> : null}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>キャンセル</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>保存</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  field: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a2e",
  },
  inputError: {
    borderColor: "#e74c3c",
  },
  memoInput: {
    height: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "right",
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: "#e74c3c",
    marginTop: 4,
  },
  timeZoneRow: {
    flexDirection: "row",
    gap: 10,
  },
  timeZoneBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  timeZoneBtnActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  timeZoneBtnText: {
    fontSize: 15,
    color: "#666",
  },
  timeZoneBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  buttons: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 28,
    marginBottom: 40,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    color: "#666",
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
