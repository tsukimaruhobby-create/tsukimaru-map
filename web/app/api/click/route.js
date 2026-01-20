import { NextResponse } from "next/server";
import sql from "@/app/api/utils/sql"; // 統一したDB接続を使用

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // フロントエンドから送られてくる検索条件を取得
  const prefecture = searchParams.get("prefecture"); // 都道府県
  const category = searchParams.get("category");     // カテゴリー
  const priceRange = searchParams.get("price_range");
  const hasParking = searchParams.get("has_parking");
  const hasEntranceFee = searchParams.get("has_entrance_fee");
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const address = searchParams.get("address");

  // 基本となるSQL文 (prefectureは必須としている設計の場合)
  let query = `SELECT * FROM posts WHERE 1=1`;
  const values: any[] = [];
  let idx = 1;

  // 都道府県絞り込み
  if (prefecture) {
    query += ` AND prefecture = $${idx++}`;
    values.push(prefecture);
  }

  // カテゴリー絞り込み（DBのカラム名 post_type に合わせる）
  if (category) {
    query += ` AND post_type = $${idx++}`;
    values.push(category);
  }

  // 予算
  if (priceRange) {
    query += ` AND price_range = $${idx++}`;
    values.push(priceRange);
  }

  // 駐車場 (boolean型として処理)
  if (hasParking) {
    query += ` AND parking = $${idx++}`;
    values.push(hasParking === "true");
  }

  // 入場料
  if (hasEntranceFee) {
    query += ` AND entrance_fee = $${idx++}`;
    values.push(hasEntranceFee === "true");
  }

  // 住所のあいまい検索
  if (address) {
    query += ` AND address ILIKE $${idx++}`;
    values.push(`%${address}%`);
  }

  // キーワード自由検索 (タイトルから)
  if (search) {
    query += ` AND title ILIKE $${idx++}`;
    values.push(`%${search}%`);
  }

  // タグ検索 (配列の中に含まれているか)
  if (tag) {
    query += ` AND $${idx++} = ANY(tags)`;
    values.push(tag);
  }

  // 新しい順に並べる
  query += ` ORDER BY created_at DESC`;

  try {
    const result = await sql(query, values);

    return NextResponse.json(
      { posts: result },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "検索に失敗しました" },
      { status: 500 }
    );
  }
}
