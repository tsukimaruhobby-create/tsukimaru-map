/**
 * 認証・権限確認 API
 * 配置パス: 月丸マップ/Web/App/Api/Auth/Token/route.ts
 */
import { getToken } from "@auth/core/jwt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function GET(request: Request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    // 本番環境(https)ではセキュアクッキーを使用する設定
    secureCookie: process.env.AUTH_URL?.startsWith("https"),
  });

  // 未認証の場合
  if (!token) {
    return Response.json(
      { authenticated: false, isAdmin: false }, // 型を合わせるため isAdmin も返すと親切
      { status: 401 }
    );
  }

  // 認証済みレスポンス
  return Response.json({
    authenticated: true,
    isAdmin: token.email === ADMIN_EMAIL,
    user: {
      id: token.sub ?? null,
      email: token.email ?? null,
      name: token.name ?? null,
    },
  }, {
    headers: {
      // 認証情報のキャッシュを徹底的に排除
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
