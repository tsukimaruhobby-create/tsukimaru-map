import sql from "@/app/api/utils/sql";
import { getToken } from "@auth/core/jwt";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * GET: 投稿一覧取得
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // クエリパラメータの取得
    const prefecture = searchParams.get("prefecture");
    const category = searchParams.get("category");
    const address = searchParams.get("address");
    const parking = searchParams.get("parking");
    const priceRange = searchParams.get("price_range");
    const entranceFee = searchParams.get("entrance_fee");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    let query = "SELECT * FROM posts WHERE 1=1";
　const values: (string | boolean | null)[] = [];
    let paramCount = 0;

    // フィルタリングロジック
    if (prefecture) {
      values.push(prefecture);
      query += ` AND prefecture = $${++paramCount}`;
    }
    if (category) {
      values.push(category);
      query += ` AND post_type = $${++paramCount}`;
    }
    if (address) {
      values.push(`%${address}%`);
      query += ` AND LOWER(address) LIKE LOWER($${++paramCount})`;
    }
    if (parking !== null && parking !== "") {
      values.push(parking === "true");
      query += ` AND parking = $${++paramCount}`;
    }
    if (priceRange) {
      values.push(priceRange);
      query += ` AND price_range = $${++paramCount}`;
    }
    if (entranceFee !== null && entranceFee !== "") {
      values.push(entranceFee === "true");
      query += ` AND entrance_fee = $${++paramCount}`;
    }
    if (tag) {
      values.push(tag);
      query += ` AND $${++paramCount} = ANY(tags)`;
    }

    // 全文検索ロジック（SQLインジェクション対策済み）
    if (search) {
      const searchVal = `%${search}%`;
      values.push(searchVal);
      const pIndex = ++paramCount;
      query += `
        AND (
          LOWER(title) LIKE LOWER($${pIndex})
          OR EXISTS (
            SELECT 1 FROM unnest(tags) t WHERE LOWER(t) LIKE LOWER($${pIndex})
          )
        )
      `;
    }

    query += " ORDER BY posted_at DESC";

    const posts = await sql(query, values);
    return Response.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/**
 * POST: 新規投稿作成（管理者限定）
 */
export async function POST(request: Request) {
  try {
    // 🔐 認証と管理者権限のチェック
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith('https'),
    });

    if (!token || token.email !== ADMIN_EMAIL) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title, image_url, instagram_url, prefecture,
      category, address, tags, parking,
      price_range, entrance_fee, posted_at
    } = body;

    // 必須項目のバリデーション
    if (!title || !image_url || !instagram_url || !prefecture || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // パラメータ化クエリによる安全な挿入
    const insertQuery = `
      INSERT INTO posts (
        title, image_url, instagram_url, prefecture, post_type,
        address, tags, parking, price_range, entrance_fee, posted_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const insertValues = [
      title, image_url, instagram_url, prefecture, category,
      address ?? null, tags ?? [], parking === true, 
      price_range ?? null, entrance_fee ?? null, 
      posted_at ?? new Date().toISOString()
    ];

    const result = await sql(insertQuery, insertValues);
    return Response.json({ post: result[0] });
  } catch (error) {
    console.error("Error creating post:", error);
    return Response.json({ error: "Failed to create post" }, { status: 500 });
  }
}
