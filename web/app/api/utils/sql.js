// 月丸マップ/web/app/api/utils/sql.ts
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

/**
 * データベース接続文字列が未設定の場合のフォールバック
 */
const NullishQueryFunction = (() => {
  const errorFn = () => {
    throw new Error(
      'DATABASE_URL が設定されていません。`.env.local` またはデプロイ先の環境変数を確認してください。'
    );
  };
  // neon の戻り値である NeonQueryFunction の型に合わせるためのダミー設定
  errorFn.transaction = () => { throw new Error('DATABASE_URL is missing'); };
  return errorFn as unknown as NeonQueryFunction<false, false>;
})();

// 環境変数があれば接続、なければエラーを投げる
const sql: NeonQueryFunction<false, false> = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : NullishQueryFunction;

export default sql;
