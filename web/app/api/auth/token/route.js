/**
 * 認証済みユーザーの JWT と最低限のユーザー情報を返す API
 *
 * 配置パス:
 * 月丸マップ/Web/App/Api/Auth/Token/route.ts
 *
 * 設計方針:
 * - JWT は Cookie に保存された認証情報を元にサーバー側で取得
 * - 未認証の場合は 401 を返す
 * - ユーザー情報は必要最小限かつ null 許容で返却
 * - キャッシュは完全に無効化
 */

import { getToken } from '@auth/core/jwt';

export async function GET(request: Request) {
  // Auth.js が管理する JWT を取得
  const [rawToken, decodedJwt] = await Promise.all([
    // クライアントへ渡す用（署名付き JWT 文字列）
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith('https'),
      raw: true,
    }),

    // サーバー側での検証・情報取得用（デコード済み）
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith('https'),
    }),
  ]);

  // 未認証の場合は即 401
  if (!decodedJwt || !rawToken) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  // 認証プロバイダ差異を考慮し、ユーザー情報は null 許容とする
  const responseData = {
    jwt: rawToken,
    user: {
      id: decodedJwt.sub ?? null,
      email: decodedJwt.email ?? null,
      name: decodedJwt.name ?? null,
    },
  };

  return new Response(
    JSON.stringify(responseData),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // 認証情報のため厳格にキャッシュ無効化
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

