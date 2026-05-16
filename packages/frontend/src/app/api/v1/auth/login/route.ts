import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { createToken } from '@/lib/jwt';
import { successResponse, errorResponse, internalError } from '@/lib/response';
import { validateBody } from '@/lib/validate';
import { loginSchema } from '@remont/shared';

// =============================================================================
// POST /api/v1/auth/login — логин пользователя
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Распарсить тело запроса
    const body = await request.json();

    // 2. Валидировать через loginSchema
    const parsed = validateBody(loginSchema, body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.message, 400);
    }

    const { email, password } = parsed.data;

    // 3. Найти пользователя по email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Неверный email или пароль', 401);
    }

    // 4. Проверить пароль
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse('UNAUTHORIZED', 'Неверный email или пароль', 401);
    }

    // 5. Создать JWT
    const token = await createToken({ userId: user.id, role: user.role });

    // 6. Убрать password_hash из ответа
    const { password_hash: _, ...userWithoutPassword } = user;

    // 7. Вернуть успешный ответ
    return successResponse({ user: userWithoutPassword, token });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse('VALIDATION_ERROR', error.message, 400);
    }

    return internalError();
  }
}
