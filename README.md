# 血圧記録アプリ

日々の血圧をスマートフォンで簡単に記録・管理できるアプリです。

## 機能

- 血圧（上・下）、脈拍、時間帯、メモの記録
- 記録一覧の表示・編集・削除
- 折れ線グラフによる血圧推移の確認
- オフライン対応（端末内SQLiteに保存）

## 技術スタック

- [Expo](https://expo.dev/) / React Native
- TypeScript
- expo-sqlite
- react-native-chart-kit

## セットアップ

```bash
cd mobile
npm install
npx expo start
```

Expo Go（iOS / Android）でQRコードを読み込むと動作確認できます。
