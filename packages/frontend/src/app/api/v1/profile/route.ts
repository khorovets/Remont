import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-middleware';
import { validateBody } from '@/lib/validate';
import { successResponse, errorResponse, unauthorized, internalError } from '@/lib/response';
import { updateProfileSchema } from '@remont/shared';

// =============================================================================
// PATCH /api/v1/profile — редактирование своего профиля
// =============================================================================

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Извлечь пользователя из токена
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorized();
    }

    // 2. Распарсить и валидировать тело запроса
    const body = await request.json();
    const parsed = validateBody(updateProfileSchema, body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.message, 400);
    }

    // 3. Обновить профиль
    const user = await prisma.user.update({
      where: { id: authUser.userId },
      data: parsed.data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        city_id: true,
        about: true,
        experience_years: true,
      },
    });

    // 4. Вернуть успешный ответ
    return successResponse({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse('VALIDATION_ERROR', error.message, 400);
    }

    return internalError();
  }
}
