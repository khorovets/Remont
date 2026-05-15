import * as bcrypt from 'bcrypt';

// =============================================================================
// Конфигурация
// =============================================================================

const SALT_ROUNDS = 10;

// =============================================================================
// hashPassword — хеширует пароль с помощью bcrypt
// =============================================================================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// =============================================================================
// comparePassword — сравнивает пароль с хешем
// =============================================================================

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
