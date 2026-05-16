import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { successResponse, notFound, errorResponse, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/profile/[id] — публичный профиль пользователя
// =============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    // 1. Извлечь и валидировать id из params
    const userId = Number(params.id);

    if (!Number.isInteger(userId) || userId < 1) {
      return errorResponse('VALIDATION_ERROR', 'Некорректный ID пользователя', 400);
    }

    // 2. Найти пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
        about: true,
        experience_years: true,
        city: {
          select: { id: true, name: true },
        },
        skills: {
          select: {
            rating: true,
            reviews_count: true,
            category: {
              select: { id: true, name: true },
            },
          },
        },
        portfolio: {
          select: {
            id: true,
            photo_url: true,
            description: true,
            category: {
              select: { id: true, name: true },
            },
          },
        },
        reviews_received: {
          select: {
            id: true,
            rating: true,
            text: true,
            category: {
              select: { name: true },
            },
            customer: {
              select: { first_name: true },
            },
          },
          orderBy: { created_at: 'desc' },
          take: 10,
        },
      },
    });

    // 3. Если пользователь не найден — 404
    if (!user) {
      return notFound('Пользователь не найден');
    }

    // 4. Вернуть успешный ответ с профилем
    return successResponse(user);
  } catch {
    return internalError();
  }
}
