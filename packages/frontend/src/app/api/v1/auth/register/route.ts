import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { createToken } from '@/lib/jwt';
import { successResponse, errorResponse, conflict, internalError } from '@/lib/response';
import { validateBody } from '@/lib/validate';
import { registerSchema } from '@remont/shared';

// =============================================================================
// POST /api/v1/auth/register — регистрация нового пользователя
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Распарсить тело запроса
    const body = await request.json();

    // 2. Валидировать через registerSchema
    const parsed = validateBody(registerSchema, body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.message, 400);
    }

    const { email, password, role, first_name, last_name, phone, city_id } = parsed.data;

    // 3. Проверить, что email не занят
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return conflict('Пользователь с таким email уже зарегистрирован');
    }

    // 4. Хешировать пароль
    const password_hash = await hashPassword(password);

    // 5. Создать пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        role,
        first_name,
        last_name,
        phone,
        city_id,
      },
    });

    // 6. Создать JWT
    const token = await createToken({ userId: user.id, role: user.role });

    // 7. Убрать password_hash из ответа
    const { password_hash: _, ...userWithoutPassword } = user;

    // 8. Вернуть успешный ответ (201)
    return successResponse({ user: userWithoutPassword, token }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse('VALIDATION_ERROR', error.message, 400);
    }

    return internalError();
  }
}
