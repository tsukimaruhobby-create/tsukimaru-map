/**
 * Authentication callback endpoint.
 * Used to send JWT authentication results to the parent window
 * (e.g. iframe or popup-based auth flow).
 */
import { getToken } from '@auth/core/jwt';

export async function GET(request: Request) {
  const [rawToken, decodedJwt] = await Promise.all([
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith('https'),
      raw: true,
    }),
    getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith('https'),
    }),
  ]);

  // Unauthorized
  if (!decodedJwt) {
return new Response(
      `
      <html>
        <body>
          <script>
            // セキュリティのため、送信先を自分のサイトのドメインに限定します
            window.parent.postMessage(
              { type: 'AUTH_ERROR', error: 'Unauthorized' },
              window.location.origin
            );
          </script>
        </body>
      </html>
      `,
      {
        status: 401,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  const message = {
    type: 'AUTH_SUCCESS',
    jwt: rawToken,
    user: {
      id: decodedJwt.sub,
      email: decodedJwt.email,
      name: decodedJwt.name,
    },
  };

  return new Response(
    `
    <html>
      <body>
        <script>
          // window.location.origin を使用することで、
          // 開発環境(localhost)でも本番URLでも、自動的に正しい宛先へ送信されます。
          window.parent.postMessage(
            ${JSON.stringify(message)}, 
            window.location.origin
          );
        </script>
      </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

