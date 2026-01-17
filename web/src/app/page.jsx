"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";

export default function HomePage() {
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 都道府県IDマッピング
  const prefectureMapping = {
    1: "hokkaido",
    2: "aomori",
    3: "iwate",
    4: "miyagi",
    5: "akita",
    6: "yamagata",
    7: "fukushima",
    8: "ibaraki",
    9: "tochigi",
    10: "gunma",
    11: "saitama",
    12: "chiba",
    13: "tokyo",
    14: "kanagawa",
    15: "niigata",
    16: "toyama",
    17: "ishikawa",
    18: "fukui",
    19: "yamanashi",
    20: "nagano",
    21: "gifu",
    22: "shizuoka",
    23: "aichi",
    24: "mie",
    25: "shiga",
    26: "kyoto",
    27: "osaka",
    28: "hyogo",
    29: "nara",
    30: "wakayama",
    31: "tottori",
    32: "shimane",
    33: "okayama",
    34: "hiroshima",
    35: "yamaguchi",
    36: "tokushima",
    37: "kagawa",
    38: "ehime",
    39: "kochi",
    40: "fukuoka",
    41: "saga",
    42: "nagasaki",
    43: "kumamoto",
    44: "oita",
    45: "miyazaki",
    46: "kagoshima",
    47: "okinawa",
  };

  // 都道府県名のリスト（検索用）
  const prefectureNames = {
    1: "北海道",
    2: "青森県",
    3: "岩手県",
    4: "宮城県",
    5: "秋田県",
    6: "山形県",
    7: "福島県",
    8: "茨城県",
    9: "栃木県",
    10: "群馬県",
    11: "埼玉県",
    12: "千葉県",
    13: "東京都",
    14: "神奈川県",
    15: "新潟県",
    16: "富山県",
    17: "石川県",
    18: "福井県",
    19: "山梨県",
    20: "長野県",
    21: "岐阜県",
    22: "静岡県",
    23: "愛知県",
    24: "三重県",
    25: "滋賀県",
    26: "京都府",
    27: "大阪府",
    28: "兵庫県",
    29: "奈良県",
    30: "和歌山県",
    31: "鳥取県",
    32: "島根県",
    33: "岡山県",
    34: "広島県",
    35: "山口県",
    36: "徳島県",
    37: "香川県",
    38: "愛媛県",
    39: "高知県",
    40: "福岡県",
    41: "佐賀県",
    42: "長崎県",
    43: "熊本県",
    44: "大分県",
    45: "宮崎県",
    46: "鹿児島県",
    47: "沖縄県",
  };

  // 検索にマッチする都道府県
  const matchedPrefectures = Object.entries(prefectureNames)
    .filter(
      ([code, name]) =>
        searchQuery === "" ||
        name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .map(([code]) => parseInt(code));

  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window === "undefined") return;

    // jQueryとjmap.jsを動的に読み込む
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        // 既存のスクリプトをチェック
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        // jQueryを先に読み込む
        if (!window.jQuery) {
          await loadScript(
            "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js",
          );
        }

        // jmap.jsを読み込む
        if (!window.jQuery.fn.jmap) {
          await loadScript("https://yugokimura.github.io/jmap/jmap.js");
        }

        // 既存の地図を削除
        window.$("#jmap-container").empty();

        // レスポンシブな地図の高さを設定
        const isMobile = window.innerWidth < 768;
        const mapHeight = isMobile ? "400px" : "600px";

        // 地図を初期化
        window.$("#jmap-container").jmap({
          width: "100%",
          height: mapHeight,
          showsPrefectureName: true,
          prefectureNameType: "full",
          lineColor: "#E8E8E8",
          lineWidth: 2,
          backgroundColor: "#FBFBFB",
          prefectureLineColor: "#ffffff",
          prefectureLineWidth: 2,
          prefectureLineGap: "1px",
          prefectureRadius: "8px",
          fontSize: isMobile ? "0.6rem" : "0.75rem",
          fontColor: "#000",
          areas: [
            {
              code: 1,
              name: "北海道",
              color: matchedPrefectures.includes(1) ? "#FF6B6B" : "#E0E0E0",
              hoverColor: "#FF8787",
            },
            {
              code: 2,
              name: "青森県",
              color: matchedPrefectures.includes(2) ? "#4ECDC4" : "#E0E0E0",
              hoverColor: "#6FE0D8",
            },
            {
              code: 3,
              name: "岩手県",
              color: matchedPrefectures.includes(3) ? "#4ECDC4" : "#E0E0E0",
              hoverColor: "#6FE0D8",
            },
            {
              code: 4,
              name: "宮城県",
              color: matchedPrefectures.includes(4) ? "#4ECDC4" : "#E0E0E0",
              hoverColor: "#6FE0D8",
            },
            {
              code: 5,
              name: "秋田県",
              color: matchedPrefectures.includes(5) ? "#4ECDC4" : "#E0E0E0",
              hoverColor: "#6FE0D8",
            },
            {
              code: 6,
              name: "山形県",
              color: matchedPrefectures.includes(6) ? "#4ECDC4" : "#E0E0E0",
              hoverColor: "#6FE0D8",
            },
            {
              code: 7,
              name: "福島県",
              color: matchedPrefectures.includes(7) ? "#4ECDC4" : "#E0E0E0",
              hoverColor: "#6FE0D8",
            },
            {
              code: 8,
              name: "茨城県",
              color: matchedPrefectures.includes(8) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 9,
              name: "栃木県",
              color: matchedPrefectures.includes(9) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 10,
              name: "群馬県",
              color: matchedPrefectures.includes(10) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 11,
              name: "埼玉県",
              color: matchedPrefectures.includes(11) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 12,
              name: "千葉県",
              color: matchedPrefectures.includes(12) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 13,
              name: "東京都",
              color: matchedPrefectures.includes(13) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 14,
              name: "神奈川県",
              color: matchedPrefectures.includes(14) ? "#95E1D3" : "#E0E0E0",
              hoverColor: "#ADEEE1",
            },
            {
              code: 15,
              name: "新潟県",
              color: matchedPrefectures.includes(15) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 16,
              name: "富山県",
              color: matchedPrefectures.includes(16) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 17,
              name: "石川県",
              color: matchedPrefectures.includes(17) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 18,
              name: "福井県",
              color: matchedPrefectures.includes(18) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 19,
              name: "山梨県",
              color: matchedPrefectures.includes(19) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 20,
              name: "長野県",
              color: matchedPrefectures.includes(20) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 21,
              name: "岐阜県",
              color: matchedPrefectures.includes(21) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 22,
              name: "静岡県",
              color: matchedPrefectures.includes(22) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 23,
              name: "愛知県",
              color: matchedPrefectures.includes(23) ? "#F38181" : "#E0E0E0",
              hoverColor: "#F59B9B",
            },
            {
              code: 24,
              name: "三重県",
              color: matchedPrefectures.includes(24) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 25,
              name: "滋賀県",
              color: matchedPrefectures.includes(25) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 26,
              name: "京都府",
              color: matchedPrefectures.includes(26) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 27,
              name: "大阪府",
              color: matchedPrefectures.includes(27) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 28,
              name: "兵庫県",
              color: matchedPrefectures.includes(28) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 29,
              name: "奈良県",
              color: matchedPrefectures.includes(29) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 30,
              name: "和歌山県",
              color: matchedPrefectures.includes(30) ? "#AA96DA" : "#E0E0E0",
              hoverColor: "#BEAAE4",
            },
            {
              code: 31,
              name: "鳥取県",
              color: matchedPrefectures.includes(31) ? "#FCBAD3" : "#E0E0E0",
              hoverColor: "#FDCBDF",
            },
            {
              code: 32,
              name: "島根県",
              color: matchedPrefectures.includes(32) ? "#FCBAD3" : "#E0E0E0",
              hoverColor: "#FDCBDF",
            },
            {
              code: 33,
              name: "岡山県",
              color: matchedPrefectures.includes(33) ? "#FCBAD3" : "#E0E0E0",
              hoverColor: "#FDCBDF",
            },
            {
              code: 34,
              name: "広島県",
              color: matchedPrefectures.includes(34) ? "#FCBAD3" : "#E0E0E0",
              hoverColor: "#FDCBDF",
            },
            {
              code: 35,
              name: "山口県",
              color: matchedPrefectures.includes(35) ? "#FCBAD3" : "#E0E0E0",
              hoverColor: "#FDCBDF",
            },
            {
              code: 36,
              name: "徳島県",
              color: matchedPrefectures.includes(36) ? "#FFFFD2" : "#E0E0E0",
              hoverColor: "#FFFFE0",
            },
            {
              code: 37,
              name: "香川県",
              color: matchedPrefectures.includes(37) ? "#FFFFD2" : "#E0E0E0",
              hoverColor: "#FFFFE0",
            },
            {
              code: 38,
              name: "愛媛県",
              color: matchedPrefectures.includes(38) ? "#FFFFD2" : "#E0E0E0",
              hoverColor: "#FFFFE0",
            },
            {
              code: 39,
              name: "高知県",
              color: matchedPrefectures.includes(39) ? "#FFFFD2" : "#E0E0E0",
              hoverColor: "#FFFFE0",
            },
            {
              code: 40,
              name: "福岡県",
              color: matchedPrefectures.includes(40) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 41,
              name: "佐賀県",
              color: matchedPrefectures.includes(41) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 42,
              name: "長崎県",
              color: matchedPrefectures.includes(42) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 43,
              name: "熊本県",
              color: matchedPrefectures.includes(43) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 44,
              name: "大分県",
              color: matchedPrefectures.includes(44) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 45,
              name: "宮崎県",
              color: matchedPrefectures.includes(45) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 46,
              name: "鹿児島県",
              color: matchedPrefectures.includes(46) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
            {
              code: 47,
              name: "沖縄県",
              color: matchedPrefectures.includes(47) ? "#A8E6CF" : "#E0E0E0",
              hoverColor: "#BDEEDA",
            },
          ].map((area) => ({
            ...area,
            color: matchedPrefectures.includes(area.code)
              ? area.color
              : "#E0E0E0",
          })),
          onSelect: function (e, data) {
            const prefectureId = prefectureMapping[data.code];
            if (prefectureId) {
              window.location.href = `/prefecture/${prefectureId}`;
            }
          },
        });

        setIsMapReady(true);
      } catch (error) {
        console.error("地図の読み込みに失敗しました:", error);
      }
    };

    initializeMap();
  }, [searchQuery, matchedPrefectures]);

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
          <div className="flex items-center space-x-2 md:space-x-3">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-black" />
            <h1 className="font-noto-sans-jp font-semibold text-lg md:text-xl text-black">
              月丸マップ
            </h1>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm text-black opacity-60 hover:opacity-100 transition-opacity"
          >
            Instagram →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-noto-sans-jp font-medium text-2xl md:text-3xl lg:text-4xl text-black mb-3 md:mb-4">
            都道府県を選択してください
          </h2>
          <p className="text-xs md:text-sm text-[#4D4D4D] max-w-2xl mx-auto px-4">
            地方ごとに色分けされた日本地図から、気になる都道府県をクリックして詳細をご覧ください
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 md:mb-8">
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#4D4D4D] opacity-50" />
            <input
              type="text"
              placeholder="都道府県名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border border-[#E8E8E8] rounded-lg font-noto-sans-jp text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-xs text-[#4D4D4D] text-center">
              {matchedPrefectures.length}件の都道府県が見つかりました
            </p>
          )}
        </div>

        {/* Map Legend */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-2">
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#FF6B6B" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              北海道
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#4ECDC4" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              東北
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#95E1D3" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              関東
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#F38181" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              中部
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#AA96DA" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              関西
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#FCBAD3" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              中国
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#FFFFD2" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              四国
            </span>
          </div>
          <div className="flex items-center space-x-1.5 md:space-x-2">
            <div
              className="w-3 h-3 md:w-4 md:h-4 rounded"
              style={{ backgroundColor: "#A8E6CF" }}
            ></div>
            <span className="text-[10px] md:text-xs font-noto-sans-jp text-black">
              九州・沖縄
            </span>
          </div>
        </div>

        {/* Japan Map */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] p-4 md:p-8 shadow-sm">
          <div id="jmap-container" className="w-full"></div>
          {!isMapReady && (
            <div className="flex items-center justify-center h-[400px] md:h-[600px]">
              <p className="text-sm text-[#4D4D4D] font-noto-sans-jp">
                地図を読み込んでいます...
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-xs text-black opacity-50">
            各都道府県をクリックすると、投稿内容を確認できます
          </p>
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
