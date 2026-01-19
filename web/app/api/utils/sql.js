/**
 * DB接続用ユーティリティ
 * Neonの接続URLを環境変数から取得して接続
 * もし設定されていなければエラーを投げる
 */
import { neon } from '@neondatabase/serverless';

// DATABASE_URL が設定されていない場合のエラー関数
const NullishQueryFunction = () => {
  throw new Error(
    'No database connection string was provided to `neon()`. ' +
    'Perhaps process.env.DATABASE_URL has not been set'
  );
};

// トランザクション用も同様にエラー
NullishQueryFunction.transaction = () => {
  throw new Error(
    'No database connection string was provided to `neon()`. ' +
    'Perhaps process.env.DATABASE_URL has not been set'
  );
};

// 環境変数があればNeon接続、なければエラー
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : NullishQueryFunction;

export default sql;
