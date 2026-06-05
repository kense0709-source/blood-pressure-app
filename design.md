# 血圧記録アプリ 設計書

## 1. システム概要

本アプリは、ExpoとReact Nativeを用いて作成するスマートフォン向け血圧記録アプリである。

ユーザーは、上の血圧、下の血圧、脈拍、時間帯、メモを入力し、端末内SQLiteに保存する。
保存したデータは一覧画面とグラフ画面で確認できる。

APIサーバーは使用せず、すべてのデータ処理はスマートフォン内で完結する。

---

## 2. 全体構成

```text
Expoアプリ
├─ 画面
│  ├─ 入力画面
│  ├─ 一覧画面
│  ├─ 詳細画面
│  └─ グラフ画面
│
├─ コンポーネント
│  ├─ 入力フォーム
│  ├─ 記録カード
│  └─ グラフ表示
│
├─ DB処理
│  └─ expo-sqlite
│
└─ 型定義
   └─ 血圧記録データ型
```

---

## 3. 画面設計

### 3.1 ホーム画面

#### 目的

アプリ起動時に表示される画面で、主要機能へ移動する。

#### 表示内容

* アプリ名
* 今日の最新記録
* 記録追加ボタン
* 記録一覧へのボタン
* グラフ画面へのボタン

#### 操作

| 操作      | 処理       |
| ------- | -------- |
| 記録追加ボタン | 入力画面へ移動  |
| 記録一覧ボタン | 一覧画面へ移動  |
| グラフボタン  | グラフ画面へ移動 |

---

### 3.2 入力画面

#### 目的

血圧データを入力し、SQLiteに保存する。

#### 入力項目

| 項目   | 入力形式   | 必須 |
| ---- | ------ | -- |
| 上の血圧 | 数値入力   | 必須 |
| 下の血圧 | 数値入力   | 必須 |
| 脈拍   | 数値入力   | 任意 |
| 時間帯  | 選択式    | 任意 |
| メモ   | テキスト入力 | 任意 |

#### ボタン

| ボタン   | 処理                |
| ----- | ----------------- |
| 保存    | 入力チェック後、SQLiteに保存 |
| キャンセル | 前の画面へ戻る           |

---

### 3.3 一覧画面

#### 目的

保存済みの血圧記録を一覧表示する。

#### 表示内容

* 記録日時
* 上の血圧
* 下の血圧
* 脈拍
* 時間帯
* メモの一部

#### 並び順

記録日時の降順とする。

#### 操作

| 操作     | 処理        |
| ------ | --------- |
| 記録をタップ | 詳細画面へ移動   |
| 削除ボタン  | 確認後、記録を削除 |

---

### 3.4 詳細画面

#### 目的

1件の血圧記録を詳しく確認する。

#### 表示内容

* 上の血圧
* 下の血圧
* 脈拍
* 時間帯
* メモ
* 記録日時

#### 操作

| 操作    | 処理        |
| ----- | --------- |
| 編集ボタン | 編集画面へ移動   |
| 削除ボタン | 確認後、記録を削除 |
| 戻るボタン | 一覧画面へ戻る   |

---

### 3.5 グラフ画面

#### 目的

血圧の推移を視覚的に確認する。

#### 表示内容

* 上の血圧の折れ線グラフ
* 下の血圧の折れ線グラフ
* 必要に応じて脈拍の折れ線グラフ

#### 初期表示

直近30件の記録を表示する。

---

## 4. データベース設計

### 4.1 テーブル名

```text
blood_pressure_records
```

### 4.2 テーブル定義

| カラム名        | 型       | 必須 | 内容       |
| ----------- | ------- | -- | -------- |
| id          | INTEGER | 必須 | 主キー、自動採番 |
| systolic    | INTEGER | 必須 | 上の血圧     |
| diastolic   | INTEGER | 必須 | 下の血圧     |
| pulse       | INTEGER | 任意 | 脈拍       |
| time_zone   | TEXT    | 任意 | 朝、昼、夜    |
| memo        | TEXT    | 任意 | メモ       |
| measured_at | TEXT    | 必須 | 測定日時     |
| created_at  | TEXT    | 必須 | 作成日時     |
| updated_at  | TEXT    | 任意 | 更新日時     |

---

### 4.3 CREATE TABLE文

```sql
CREATE TABLE IF NOT EXISTS blood_pressure_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  pulse INTEGER,
  time_zone TEXT,
  memo TEXT,
  measured_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
```

---

## 5. データ型設計

アプリ内では、血圧記録を以下の型で扱う。

```typescript
export type BloodPressureRecord = {
  id: number;
  systolic: number;
  diastolic: number;
  pulse?: number | null;
  timeZone?: "朝" | "昼" | "夜" | null;
  memo?: string | null;
  measuredAt: string;
  createdAt: string;
  updatedAt?: string | null;
};
```

新規登録時は、idを持たない型を使用する。

```typescript
export type NewBloodPressureRecord = {
  systolic: number;
  diastolic: number;
  pulse?: number | null;
  timeZone?: "朝" | "昼" | "夜" | null;
  memo?: string | null;
  measuredAt: string;
};
```

---

## 6. 主な処理設計

### 6.1 初期化処理

アプリ起動時にSQLiteを開き、テーブルが存在しない場合は作成する。

処理の流れは以下とする。

```text
アプリ起動
↓
SQLiteを開く
↓
blood_pressure_recordsテーブルを作成
↓
ホーム画面を表示
```

---

### 6.2 登録処理

```text
入力画面で値を入力
↓
入力チェック
↓
問題なければINSERT実行
↓
一覧またはホーム画面へ戻る
```

---

### 6.3 一覧取得処理

```text
一覧画面を開く
↓
SQLiteから記録を取得
↓
measured_atの降順で並べる
↓
一覧に表示
```

使用するSQLの例は以下とする。

```sql
SELECT * FROM blood_pressure_records
ORDER BY measured_at DESC;
```

---

### 6.4 グラフ用データ取得処理

```text
グラフ画面を開く
↓
SQLiteから直近30件を取得
↓
日付順に並び替える
↓
グラフ用データに変換
↓
折れ線グラフを表示
```

使用するSQLの例は以下とする。

```sql
SELECT * FROM blood_pressure_records
ORDER BY measured_at DESC
LIMIT 30;
```

取得後、画面表示時には日付の古い順に並べ直す。

---

### 6.5 更新処理

```text
詳細画面から編集画面へ移動
↓
値を変更
↓
入力チェック
↓
UPDATE実行
↓
詳細画面または一覧画面へ戻る
```

---

### 6.6 削除処理

```text
削除ボタンを押す
↓
確認メッセージを表示
↓
ユーザーが承認
↓
DELETE実行
↓
一覧を再取得
```

---

## 7. フォルダ構成案

```text
C:\dev\blood-pressure-app
└─ mobile
   ├─ app
   │  ├─ index.tsx
   │  ├─ add.tsx
   │  ├─ records.tsx
   │  ├─ record-detail.tsx
   │  └─ chart.tsx
   │
   ├─ components
   │  ├─ BloodPressureForm.tsx
   │  ├─ RecordCard.tsx
   │  └─ BloodPressureChart.tsx
   │
   ├─ database
   │  ├─ db.ts
   │  └─ bloodPressureRepository.ts
   │
   ├─ types
   │  └─ bloodPressure.ts
   │
   ├─ utils
   │  ├─ validation.ts
   │  └─ date.ts
   │
   ├─ package.json
   └─ tsconfig.json
```

---

## 8. 各ファイルの役割

| ファイル                                | 役割            |
| ----------------------------------- | ------------- |
| app/index.tsx                       | ホーム画面         |
| app/add.tsx                         | 血圧記録の追加画面     |
| app/records.tsx                     | 記録一覧画面        |
| app/record-detail.tsx               | 記録詳細画面        |
| app/chart.tsx                       | グラフ画面         |
| components/BloodPressureForm.tsx    | 入力フォーム部品      |
| components/RecordCard.tsx           | 一覧表示用カード      |
| components/BloodPressureChart.tsx   | グラフ表示部品       |
| database/db.ts                      | SQLite初期化処理   |
| database/bloodPressureRepository.ts | 登録、取得、更新、削除処理 |
| types/bloodPressure.ts              | データ型定義        |
| utils/validation.ts                 | 入力チェック        |
| utils/date.ts                       | 日付整形処理        |

---

## 9. 入力チェック設計

### 9.1 上の血圧

* 必須
* 数値であること
* 1以上であること
* 下の血圧より大きいことを基本とする

### 9.2 下の血圧

* 必須
* 数値であること
* 1以上であること

### 9.3 脈拍

* 任意
* 入力された場合は数値であること
* 1以上であること

### 9.4 メモ

* 任意
* 最大文字数は200文字程度とする

---

## 10. 画面遷移設計

```text
ホーム画面
├─ 記録追加画面
├─ 記録一覧画面
│  └─ 記録詳細画面
│      └─ 編集画面
└─ グラフ画面
```

---

## 11. 開発方針

初期開発では、以下の順番で実装する。

```text
1. Expoプロジェクト作成
2. 画面遷移の作成
3. SQLite初期化処理の作成
4. 血圧記録の登録機能
5. 記録一覧表示
6. 削除機能
7. 編集機能
8. グラフ表示
9. UI調整
```

---

## 12. 将来のAPI化を考慮した設計

将来的にAPI化する可能性があるため、DB処理は画面ファイルに直接書かず、repositoryファイルに分離する。

現時点では以下のようにする。

```text
画面
↓
bloodPressureRepository.ts
↓
expo-sqlite
```

将来的にAPI化する場合は、以下のように差し替えやすくする。

```text
画面
↓
bloodPressureRepository.ts
↓
API通信
↓
サーバーDB
```

そのため、画面側ではSQLを直接書かない方針とする。
