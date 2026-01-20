"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";

/**
 * アプリ全体でデータフェッチ（React Query）を有効にするためのプロバイダー
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5分間はデータを「最新」とみなし、再取得を抑える
            staleTime: 1000 * 60 * 5,
            // キャッシュがメモリに残る時間（React Query v5）
            gcTime: 1000 * 60 * 30,
            // 通信失敗時のリトライ回数
            retry: 1,
            // フォーカス復帰時の自動再取得を無効化
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
