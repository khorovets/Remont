import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-middleware';
import { successResponse, unauthorized, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/auth/me — текущий пользователь по JWT
// =============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Извлечь пользователя из токена
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorized();
    }

    // 2. Найти полные данные пользователя (без password_hash)
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        role: true,
        first_name: true,
        last_name: true,
        phone: true,
        avatar_url: true,
        city_id: true,
        city: true,
        about: true,
        experience_years: true,
        created_at: true,
        updated_at: true,
        skills: true,
        portfolio: true,
        orders: true,
        responses: true,
        reviews_given: true,
        reviews_received: true,
        favorites: true,
        favorited_by: true,
        user_subscriptions: true,
        messages_sent: true,
        messages_received: true,
      },
    });

    // 3. Если пользователь не найден (маловероятно, но для безопасности)
    if (!user) {
      return unauthorized();
    }

    // 4. Вернуть успешный ответ
    return successResponse({ user });
  } catch {
    return internalError();
  }
}
