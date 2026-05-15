import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import type { JwtPayload } from './jwt';

// =============================================================================
// getAuthUser — извлекает payload из JWT в заголовке Authorization.
// Возвращает null, если токен отсутствует или невалиден.
// =============================================================================

export async function getAuthUser(
  request: NextRequest,
): Promise<JwtPayload | null> {
  const header = request.headers.get('authorization');

  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return verifyToken(token);
}

// =============================================================================
// requireAuth — то же, что getAuthUser, но выбрасывает ошибку 401, если
// пользователь не аутентифицирован.
// =============================================================================

export async function requireAuth(
  request: NextRequest,
): Promise<JwtPayload> {
  const user = await getAuthUser(request);

  if (!user) {
    throw new Error('Необходима авторизация');
  }

  return user;
}
