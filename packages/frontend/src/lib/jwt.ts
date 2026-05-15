import { SignJWT, jwtVerify } from 'jose';
import type { Role } from '@remont/shared';

// =============================================================================
// JWT Payload — данные, хранящиеся в токене
// =============================================================================

export interface JwtPayload {
  userId: number;
  role: Role;
}

// =============================================================================
// Helpers
// =============================================================================

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

function getExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN ?? '7d';
}

// =============================================================================
// createToken — создаёт подписанный JWT
// =============================================================================

export async function createToken(payload: JwtPayload): Promise<string> {
  const secret = getSecret();

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(getExpiresIn())
    .sign(secret);
}

// =============================================================================
// verifyToken — проверяет JWT и возвращает payload (или null при ошибке)
// =============================================================================

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify<JwtPayload>(token, secret);
    return payload;
  } catch {
    return null;
  }
}
