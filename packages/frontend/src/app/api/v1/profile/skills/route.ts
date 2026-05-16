import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-middleware';
import { requireRole } from '@/lib/role-middleware';
import { successResponse, errorResponse, unauthorized, forbidden, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/profile/skills — свои компетенции (CONTRACTOR)
// =============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Извлечь пользователя из токена
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorized();
    }

    // 2. Проверить роль — только CONTRACTOR
    requireRole(authUser, 'CONTRACTOR');

    // 3. Найти компетенции исполнителя
    const skills = await prisma.contractorSkill.findMany({
      where: { contractor_id: authUser.userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // 4. Вернуть успешный ответ
    return successResponse(skills);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Доступ запрещён')) {
      return forbidden();
    }

    return internalError();
  }
}
