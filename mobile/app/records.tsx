import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import RecordCard from "../components/RecordCard";
import { getAllRecords, deleteRecord } from "../database/bloodPressureRepository";
import { BloodPressureRecord } from "../types/bloodPressure";

export default function RecordsScreen() {
  const router = useRouter();
  const [records, setRecords] = useState<BloodPressureRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      getAllRecords().then(setRecords);
    }, [])
  );

  async function handleDelete(id: number) {
    Alert.alert("削除確認", "この記録を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await deleteRecord(id);
          setRecords((prev) => prev.filter((r) => r.id !== id));
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>記録がありません</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <RecordCard
              record={item}
              onPress={() => router.push(`/record-detail?id=${item.id}`)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

RecordsScreen.options = { title: "記録一覧" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  list: {
    paddingVertical: 10,
    paddingBottom: 30,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#aaa",
  },
});
