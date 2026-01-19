"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ルーティング用に追加
import { setupAuthMessageListener } from '@/lib/authMessageListener';

/**
 * ログイン待機画面
 * iframeやポップアップからの認証結果（postMessage）をリッスンします。
 */
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 許可するオリジンのリスト
    // 環境変数に本番URLを、フォールバックにローカル環境を指定
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_ORIGIN!,
      'http://localhost:3000',
    ].filter(Boolean); // 未定義の値を排除

    const cleanup = setupAuthMessageListener({
      allowedOrigins,
      onSuccess: ({ jwt, user }) => {
        console.log('認証成功:', user.email);
        
        // 【次のアクション例】
        // 1. JWTをCookieやセッションに保存（Auth.js等のライブラリ設定に従う）
        // 2. ダッシュボードへ遷移
        // router.push('/dashboard');
      },
      onError: (err) => {
        console.error('認証エラーが発生しました:', err.error);
        // 必要に応じてエラー画面への遷移やトースト通知を表示
      },
    });

    // コンポーネントのアンマウント時にリスナーを確実に解除
    return cleanup;
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>認証処理中</h1>
        <p>画面を閉じずに少々お待ちください...</p>
        {/* ここにローディングアニメーションなどを配置すると親切です */}
      </div>
    </div>
  );
}
