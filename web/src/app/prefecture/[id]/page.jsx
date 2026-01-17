"use client";

import React, { useState } from "react";
import { ArrowLeft, MapPin, Instagram, Tag } from "lucide-react";

export default function PrefecturePage({ params }) {
  const prefectureId = params.id;
  const [selectedTag, setSelectedTag] = useState("すべて");

  // 都道府県データ（後でデータベースに移行可能）
  const prefectureData = {
    hokkaido: {
      name: "北海道",
      region: "北海道",
      description:
        "日本最北の地、北海道。雄大な自然と美味しい海鮮、乳製品が有名です。",
      color: "#FF6B6B",
      posts: [
        {
          id: 1,
          title: "札幌の夜景",
          image:
            "https://images.unsplash.com/photo-1570977662707-63dade9b826c?w=800&h=600&fit=crop",
          date: "2024-01-15",
          tags: ["夜景", "都市"],
        },
        {
          id: 2,
          title: "富良野のラベンダー畑",
          image:
            "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop",
          date: "2024-01-10",
          tags: ["自然", "花"],
        },
      ],
    },
    tokyo: {
      name: "東京都",
      region: "関東",
      description: "日本の首都、東京。伝統と最先端が融合する国際都市です。",
      color: "#95E1D3",
      posts: [
        {
          id: 1,
          title: "東京タワーの夕暮れ",
          image:
            "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
          date: "2024-01-20",
          tags: ["夜景", "観光地"],
        },
        {
          id: 2,
          title: "浅草寺",
          image:
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop",
          date: "2024-01-18",
          tags: ["寺社", "観光地"],
        },
      ],
    },
    osaka: {
      name: "大阪府",
      region: "関西",
      description:
        "日本の台所、大阪。たこ焼き、お好み焼きなど美味しい食べ物がたくさんあります。",
      color: "#AA96DA",
      posts: [
        {
          id: 1,
          title: "道頓堀の夜",
          image:
            "https://images.unsplash.com/photo-1589452271712-64eae8f4e14e?w=800&h=600&fit=crop",
          date: "2024-01-22",
          tags: ["夜景", "グルメ"],
        },
        {
          id: 2,
          title: "大阪城",
          image:
            "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&h=600&fit=crop",
          date: "2024-01-19",
          tags: ["観光地", "歴史"],
        },
      ],
    },
    kyoto: {
      name: "京都府",
      region: "関西",
      description: "古都京都。数多くの寺社仏閣や伝統文化が残る美しい街です。",
      color: "#AA96DA",
      posts: [
        {
          id: 1,
          title: "金閣寺",
          image:
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
          date: "2024-01-21",
          tags: ["寺社", "観光地"],
        },
        {
          id: 2,
          title: "伏見稲荷大社",
          image:
            "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&h=600&fit=crop",
          date: "2024-01-17",
          tags: ["寺社", "観光地"],
        },
      ],
    },
  };

  // デフォルトデータ
  const prefecture = prefectureData[prefectureId] || {
    name: prefectureId,
    region: "日本",
    description: "この都道府県の詳細情報は準備中です。",
    color: "#95E1D3",
    posts: [],
  };

  // すべてのタグを取得
  const allTags = [
    "すべて",
    ...new Set(prefecture.posts.flatMap((post) => post.tags || [])),
  ];

  // 選択されたタグでフィルタリング
  const filteredPosts =
    selectedTag === "すべて"
      ? prefecture.posts
      : prefecture.posts.filter(
          (post) => post.tags && post.tags.includes(selectedTag),
        );

  const handleBackClick = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] font-inter">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="bg-white border-b border-[#E8E8E8] px-4 md:px-6 py-4 md:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-1.5 md:space-x-2 text-black hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm font-noto-sans-jp">
              地図に戻る
            </span>
          </button>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 md:space-x-2 text-black opacity-60 hover:opacity-100 transition-opacity"
          >
            <Instagram className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm">Instagram</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 md:mb-6">
          <span className="text-[10px] md:text-xs text-black opacity-45 font-noto-sans-jp">
            ホーム • {prefecture.region} • {prefecture.name}
          </span>
        </div>

        {/* Prefecture Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
            <div
              className="w-2 h-8 md:w-3 md:h-12 rounded"
              style={{ backgroundColor: prefecture.color }}
            ></div>
            <h1 className="font-noto-sans-jp font-medium text-3xl md:text-4xl lg:text-5xl text-black">
              {prefecture.name}
            </h1>
          </div>
          <p className="text-sm md:text-base text-[#4D4D4D] leading-6 md:leading-7 max-w-3xl">
            {prefecture.description}
          </p>
        </div>

        {/* Tag Filter */}
        {prefecture.posts.length > 0 && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
              <Tag className="w-4 h-4 md:w-5 md:h-5 text-black" />
              <h3 className="font-noto-sans-jp font-medium text-base md:text-lg text-black">
                タグで絞り込み
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-noto-sans-jp transition-all duration-200 ${
                    selectedTag === tag
                      ? "bg-black text-white"
                      : "bg-white text-black border border-[#E8E8E8] hover:border-black"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
            <h2 className="font-noto-sans-jp font-semibold text-xl md:text-2xl text-black">
              投稿一覧
              {selectedTag !== "すべて" && (
                <span className="text-xs md:text-sm font-normal text-[#4D4D4D] ml-2">
                  （{filteredPosts.length}件）
                </span>
              )}
            </h2>
            <div className="h-px flex-1 bg-[#E8E8E8]"></div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden border border-[#E8E8E8] hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="relative h-48 md:h-64 bg-[#F5F5F5] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-noto-sans-jp font-medium text-base md:text-lg text-black mb-2">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags &&
                        post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-[#F5F5F5] rounded text-[10px] md:text-xs font-noto-sans-jp text-[#4D4D4D]"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <p className="text-[10px] md:text-xs text-black opacity-50">
                      {post.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16 bg-white rounded-lg border border-[#E8E8E8]">
              <MapPin className="w-10 h-10 md:w-12 md:h-12 text-black opacity-20 mx-auto mb-3 md:mb-4" />
              <p className="text-sm text-[#4D4D4D] font-noto-sans-jp">
                {selectedTag === "すべて"
                  ? "まだ投稿がありません"
                  : `「${selectedTag}」の投稿がありません`}
              </p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 md:mt-12 text-center">
          <button
            onClick={handleBackClick}
            className="bg-black text-white font-noto-sans-jp font-semibold text-xs uppercase tracking-widest px-6 md:px-8 py-3 md:py-4 rounded-sm hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200"
          >
            地図に戻る
          </button>
        </div>
      </main>

      <style jsx global>{`
        .font-inter {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
        }
        .font-noto-sans-jp {
          font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }
      `}</style>
    </div>
  );
}
