"use client";

import { useEffect, useState } from "react";

/**
 * 投稿データ型（管理画面用に必要な最小限）
 */
type Post = {
  id: string;
  title: string;
  image_url: string;
  instagram_url: string;
  prefecture: string;
  post_type: string;
  address?: string | null;
  tags?: string[];
  parking: boolean;
  price_range?: string | null;
  entrance_fee: boolean;
};

type FormState = {
  title: string;
  image_url: string;
  instagram_url: string;
  prefecture: string;
  category: string;
  address: string;
  tags: string; // UIでは文字列
  parking: boolean;
  price_range: string;
  entrance_fee: boolean;
};

type Props = {
  post?: Post;
  onSuccess: () => void;
};

export default function AdminPostForm({ post, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: "",
    image_url: "",
    instagram_url: "",
    prefecture: "",
    category: "",
    address: "",
    tags: "",
    parking: false,
    price_range: "",
    entrance_fee: false,
  });

  /**
   * 編集モード：既存投稿をフォームに反映
   */
  useEffect(() => {
    if (!post) return;

    setForm({
      title: post.title ?? "",
      image_url: post.image_url ?? "",
      instagram_url: post.instagram_url ?? "",
      prefecture: post.prefecture ?? "",
      category: post.post_type ?? "",
      address: post.address ?? "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      parking: post.parking ?? false,
      price_range: post.price_range ?? "",
      entrance_fee: post.entrance_fee ?? false,
    });
  }, [post]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        image_url: form.image_url.trim(),
        instagram_url: form.instagram_url.trim(),
        prefecture: form.prefecture.trim(),
        category: form.category.trim(),
        address: form.address || null,
        tags: form.tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        parking: form.parking,
        price_range: form.price_range || null,
        entrance_fee: form.entrance_fee,
      };

      const method = post ? "PUT" : "POST";
      const url = post ? `/api/posts/${post.id}` : "/api/posts";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "保存に失敗しました");
      }

      alert(post ? "更新しました" : "作成しました");
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: "1px solid #ccc",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <h3>{post ? "投稿を編集" : "新規投稿"}</h3>

      <input
        placeholder="タイトル（必須）"
        required
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="画像URL（必須）"
        required
        value={form.image_url}
        onChange={e => setForm({ ...form, image_url: e.target.value })}
      />

      <input
        placeholder="Instagram URL（必須）"
        required
        value={form.instagram_url}
        onChange={e => setForm({ ...form, instagram_url: e.target.value })}
      />

      <input
        placeholder="都道府県"
        value={form.prefecture}
        onChange={e => setForm({ ...form, prefecture: e.target.value })}
      />

      <input
        placeholder="カテゴリ（post_type）"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="住所"
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
      />

      <input
        placeholder="タグ（カンマ区切り）"
        value={form.tags}
        onChange={e => setForm({ ...form, tags: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={form.parking}
          onChange={e => setForm({ ...form, parking: e.target.checked })}
        />
        駐車場あり
      </label>

      <label>
        <input
          type="checkbox"
          checked={form.entrance_fee}
          onChange={e =>
            setForm({ ...form, entrance_fee: e.target.checked })
          }
        />
        入場料あり
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: 10,
          backgroundColor: loading ? "#ccc" : "#0070f3",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {loading ? "送信中..." : post ? "更新する" : "新規作成する"}
      </button>
    </form>
  );
}

