// src/lib/authMessageListener.ts

type AuthSuccessMessage = {
  type: 'AUTH_SUCCESS';
  jwt: string;
  user: {
    id?: string;
    email?: string;
    name?: string;
  };
};

type AuthErrorMessage = {
  type: 'AUTH_ERROR';
  error: string;
};

// 受け取る可能性のあるデータの型を柔軟にしておく
type AuthMessage = AuthSuccessMessage | AuthErrorMessage | any;

type Options = {
  allowedOrigins: string[];
  onSuccess: (message: AuthSuccessMessage) => void;
  onError?: (message: AuthErrorMessage) => void;
};

export function setupAuthMessageListener(options: Options) {
  const { allowedOrigins, onSuccess, onError } = options;

  // URLの末尾スラッシュを削除して正規化しておく
  const normalizedOrigins = allowedOrigins.map(origin => origin.replace(/\/$/, ""));

  function handler(event: MessageEvent<AuthMessage>) {
    // ① origin チェック（最重要：信頼できるドメインか）
    if (!normalizedOrigins.includes(event.origin)) {
      return;
    }

    const data = event.data;

    // ② メッセージ形式のバリデーション
    if (!data || typeof data !== 'object') {
      return;
    }

    // ③ 成功 / 失敗の分岐
    if (data.type === 'AUTH_SUCCESS') {
      // JWTが存在し、文字列であることを確認
      if (typeof data.jwt === 'string') {
        onSuccess(data as AuthSuccessMessage);
      }
    } else if (data.type === 'AUTH_ERROR') {
      onError?.(data as AuthErrorMessage);
    }
  }

  window.addEventListener('message', handler);

  // クリーンアップ関数
  return () => {
    window.removeEventListener('message', handler);
  };
}
