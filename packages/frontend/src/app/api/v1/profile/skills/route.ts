import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-middleware';
import { requireRole } from '@/lib/role-middleware';
import { validateBody } from '@/lib/validate';
import { successResponse, errorResponse, unauthorized, forbidden, internalError } from '@/lib/response';
import { skillsSchema } from '@remont/shared';

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

// =============================================================================
// PUT /api/v1/profile/skills — сохранить список компетенций (CONTRACTOR)
// =============================================================================

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Извлечь пользователя из токена
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorized();
    }

    // 2. Проверить роль — только CONTRACTOR
    requireRole(authUser, 'CONTRACTOR');

    // 3. Распарсить и валидировать тело запроса
    const body = await request.json();
    const parsed = validateBody(skillsSchema, body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.message, 400);
    }

    // 4. Удалить все существующие компетенции и создать новые
    const deleted = await prisma.contractorSkill.deleteMany({
      where: { contractor_id: authUser.userId },
    });

    await prisma.contractorSkill.createMany({
      data: parsed.data.category_ids.map((category_id) => ({
        contractor_id: authUser.userId,
        category_id,
      })),
    });

    const result = {
      added: parsed.data.category_ids.length,
      removed: deleted.count,
    };

    // 5. Вернуть успешный ответ
    return successResponse(result);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Доступ запрещён')) {
      return forbidden();
    }

    return internalError();
  }
}

