import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map(e => e.trim())
  .filter(Boolean);

if (ADMIN_EMAILS.length === 0) {
  throw new Error("ADMIN_EMAILS is not configured");
}

/**
 * 管理者チェック（401 / 403 を厳密に分離）
 */
async function requireAdmin(request: Request) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) return { ok: false, status: 401 as const };
  if (!token.email || !ADMIN_EMAILS.includes(token.email)) {
    return { ok: false, status: 403 as const };
  }

  return { ok: true, token };
}

/**
 * PUT: 投稿編集（管理者限定）
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return Response.json(
        { error: auth.status === 401 ? "Unauthorized" : "Forbidden" },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const {
      title,
      image_url,
      instagram_url,
      prefecture,
      category,
      address,
      tags,
      parking,
      price_range,
      entrance_fee,
    } = body;

    if (
      [title, image_url, instagram_url, prefecture, category]
        .some(v => typeof v !== "string" || v.trim(

