/**
 * ファイル / 画像アップロード用ユーティリティ
 * - 投稿画面などから渡された画像データを外部ストレージに保存し、URLを返します。
 */

type UploadInput = {
  buffer?: ArrayBuffer | Uint8Array;
  base64?: string;
  url?: string;
};

type UploadResult = {
  url: string;
  mimeType: string | null;
};

// 環境変数からアップロード先のURLを取得
const UPLOAD_API_URL = process.env.UPLOAD_API_URL;

/**
 * 画像を外部ストレージにアップロードする共通関数
 */
export async function upload({
  buffer,
  base64,
  url,
}: UploadInput): Promise<UploadResult> {
  // 1. 環境変数チェック
  if (!UPLOAD_API_URL) {
    throw new Error(
      "環境変数 UPLOAD_API_URL が設定されていません。"
    );
  }

  // 2. 引数チェック
  if (!buffer && !base64 && !url) {
    throw new Error(
      "アップロードするデータ（buffer, base64, または url）が指定されていません。"
    );
  }

  try {
    // 3. 外部APIへ送信
    const response = await fetch(UPLOAD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": buffer
          ? "application/octet-stream"
          : "application/json",
        // "Authorization": `Bearer ${process.env.UPLOAD_API_KEY}`,
      },
      body: buffer
        ? buffer
        : JSON.stringify({ base64, url }),
    });

    // 4. エラーハンドリング
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `アップロードサーバーエラー: ${response.status} ${errorText}`
      );
    }

    const data = await response.json();

    // 5. レスポンス検証
    if (!data?.url) {
      throw new Error("アップロードレスポンスにURLが含まれていません。");
    }

    return {
      url: data.url,
      mimeType: data.mimeType ?? null,
    };
  } catch (error) {
    console.error("Upload Utility Error:", error);
    throw error;
  }
}

export default upload;

