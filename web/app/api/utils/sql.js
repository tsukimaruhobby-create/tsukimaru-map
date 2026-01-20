import { neon, NeonQueryFunction } from '@neondatabase/serverless';

/**
 * データベース接続設定
 * Neonの接続文字列は環境変数 DATABASE_URL から取得します。
 */

// 設定がない場合にエラーを投げるためのダミー関数
const NullishQueryFunction = (() => {
  const errorFn = () => {
    throw new Error(
      'DATABASE_URL が設定されていません。`.env.local` または Vercel の環境変数を確認してください。'
    );
  };
  errorFn.transaction = () => { throw new Error('DATABASE_URL is missing'); };
  return errorFn as unknown as NeonQueryFunction<false, false>;
})();

/**
 * SQLを安全に実行するユーティリティ関数
 * 使い方: const rows = await sql("SELECT * FROM posts WHERE id = $1", [id]);
 */
const sql: NeonQueryFunction<false, false> = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : NullishQueryFunction;

export default sql;
