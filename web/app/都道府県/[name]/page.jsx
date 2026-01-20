"use client";

import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Filter, MapPin } from "lucide-react";
import Header from "@/components/Header";

// 投稿データの型定義
interface Post {
  id: string;
  title: string;
  post_type: "food" | "tourist_spot";
  tags: string[];
  image_url: string;
  instagram_url?: string;
  shop_url?: string;
  reserve_url?: string;
}

interface PrefectureMapping {
  [key: string]: { name: string; region: string; color: string };
}

interface Props {
  params: Promise<{ name: string }>; // Next.js 15+ の非同期型に対応
}

export default function PrefecturePage({ params }: Props) {
  // params をアンラップ（展開）
  const { name: prefectureId } = use(params);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィルター状態
  const [category, setCategory] = useState("all"); 
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 都道府県設定（ここに追加してください）
  const prefectureMapping: PrefectureMapping = {
    tokyo: { name: "東京都", region: "関東", color: "#95E1D3" },
    osaka: { name: "大阪府", region: "関西", color: "#AA96DA" },
    kanagawa: { name: "神奈川県", region: "関東", color: "#F38181" },
    fukuoka: { name: "福岡県", region: "九州", color: "#FCE38A" },
  };

  const prefecture = prefectureMapping[prefectureId] || {
    name: prefectureId,
    region: "日本",
    color: "#95E1D3",
  };

  // CTR計測用（クリックされたことをAPIに送る）
  const recordClick = async (postId: string) => {
    try {
      await fetch(`/api/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
    } catch (err) {
      console.error("CTR recording failed:", err);
    }
  };

  // データ取得処理
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({ prefecture: prefectureId });

        if (category !== "all") queryParams.append("category", category);
        if (address) queryParams.append("address", address);
        if (searchQuery) queryParams.append("search", searchQuery);
        if (selectedTag) queryParams.append("tag", selectedTag);

        const res = await fetch(`/api/posts?${queryParams.toString()}`);
        if (!res.ok) throw new Error("データの取得に失敗しました");

        const data = await res.json();
        setPosts(data.posts || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [prefectureId, category, address, searchQuery, selectedTag]);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));
  const handleBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-24">
        {/* ナビゲーション */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center space-x-2 text-black hover:opacity-60">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">地図に戻る</span>
          </button>
          <span className="text-xs text-gray-400">ホーム • {prefecture.region} • {prefecture.name}</span>
        </div>

        {/* ヘッダー */}
        <div className="mb-8 flex items-center space-x-3">
          <div className="w-2 h-10 rounded-full" style={{ backgroundColor: prefecture.color }} />
          <h1 className="text-4xl font-bold text-gray-900">{prefecture.name}</h1>
        </div>

        {/* 検索・絞り込み */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="店名やタイトルで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl border flex items-center justify-center gap-2 ${showFilters ? "bg-black text-white" : "bg-white text-gray-700"}`}
            >
              <Filter size={18} /> 絞り込み
            </button>
          </div>

          {showFilters && (
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div>
                <p className="text-sm font-bold mb-3">カテゴリー</p>
                <div className="flex gap-2">
                  {[{id:"all", l:"すべて"}, {id:"food", l:"ご飯"}, {id:"tourist_spot", l:"観光地"}].map(c => (
                    <button key={c.id} onClick={() => setCategory(c.id)}
                      className={`px-4 py-2 rounded-lg text-sm ${category === c.id ? "bg-black text-white" : "bg-gray-100"}`}>
                      {c.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold mb-3">タグ</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs ${selectedTag === tag ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 一覧 */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed"><MapPin className="mx-auto text-gray-200 mb-4" /><p>まだ投稿がありません</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-[10px] font-bold rounded-full">{post.post_type === "food" ? "EAT" : "VISIT"}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags?.slice(0, 3).map((t, i) => <span key={i} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{t}</span>)}
                  </div>
                  {post.instagram_url && (
                    <a href={post.instagram_url} target="_blank" onClick={() => recordClick(post.id)}
                      className="inline-flex items-center justify-center w-full py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl mb-2">Instagram</a>
                  )}
                  {post.shop_url && (
                    <a href={post.shop_url} target="_blank" onClick={() => recordClick(post.id)}
                      className="inline-flex items-center justify-center w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl mb-2">公式サイト</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
