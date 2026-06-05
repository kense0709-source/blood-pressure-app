import { getDb } from "./db";
import { BloodPressureRecord, NewBloodPressureRecord } from "../types/bloodPressure";
import { nowISOString } from "../utils/date";

type DbRow = {
  id: number;
  systolic: number;
  diastolic: number;
  pulse: number | null;
  time_zone: string | null;
  memo: string | null;
  measured_at: string;
  created_at: string;
  updated_at: string | null;
};

function rowToRecord(row: DbRow): BloodPressureRecord {
  return {
    id: row.id,
    systolic: row.systolic,
    diastolic: row.diastolic,
    pulse: row.pulse,
    timeZone: row.time_zone as BloodPressureRecord["timeZone"],
    memo: row.memo,
    measuredAt: row.measured_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllRecords(): Promise<BloodPressureRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DbRow>(
    "SELECT * FROM blood_pressure_records ORDER BY measured_at DESC"
  );
  return rows.map(rowToRecord);
}

export async function getRecentRecords(limit: number): Promise<BloodPressureRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DbRow>(
    "SELECT * FROM blood_pressure_records ORDER BY measured_at DESC LIMIT ?",
    [limit]
  );
  return rows.map(rowToRecord);
}

export async function getRecordById(id: number): Promise<BloodPressureRecord | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<DbRow>(
    "SELECT * FROM blood_pressure_records WHERE id = ?",
    [id]
  );
  return row ? rowToRecord(row) : null;
}

export async function getTodayLatestRecord(): Promise<BloodPressureRecord | null> {
  const db = await getDb();
  const today = new Date().toISOString().slice(0, 10);
  const row = await db.getFirstAsync<DbRow>(
    "SELECT * FROM blood_pressure_records WHERE measured_at LIKE ? ORDER BY measured_at DESC LIMIT 1",
    [`${today}%`]
  );
  return row ? rowToRecord(row) : null;
}

export async function insertRecord(record: NewBloodPressureRecord): Promise<number> {
  const db = await getDb();
  const now = nowISOString();
  const result = await db.runAsync(
    `INSERT INTO blood_pressure_records
      (systolic, diastolic, pulse, time_zone, memo, measured_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      record.systolic,
      record.diastolic,
      record.pulse ?? null,
      record.timeZone ?? null,
      record.memo ?? null,
      record.measuredAt,
      now,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateRecord(
  id: number,
  record: Omit<NewBloodPressureRecord, "measuredAt">
): Promise<void> {
  const db = await getDb();
  const now = nowISOString();
  await db.runAsync(
    `UPDATE blood_pressure_records
     SET systolic = ?, diastolic = ?, pulse = ?, time_zone = ?, memo = ?, updated_at = ?
     WHERE id = ?`,
    [
      record.systolic,
      record.diastolic,
      record.pulse ?? null,
      record.timeZone ?? null,
      record.memo ?? null,
      now,
      id,
    ]
  );
}

export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM blood_pressure_records WHERE id = ?", [id]);
}
