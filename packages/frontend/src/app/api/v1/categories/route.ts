import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/categories — список категорий с опциональной фильтрацией по group_id
// =============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;
    const groupIdParam = searchParams.get('group_id');

    // Валидация group_id если передан
    let groupId: number | undefined;
    if (groupIdParam !== null) {
      groupId = Number(groupIdParam);
      if (!Number.isInteger(groupId) || groupId < 1) {
        return errorResponse(
          'VALIDATION_ERROR',
          'group_id должен быть положительным целым числом',
          400,
        );
      }
    }

    // Построение where-условия
    const where = groupId !== undefined ? { parent_id: groupId } : {};

    const categories = await prisma.category.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        parent_id: true,
        metadata: true,
        parent: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { sort_order: 'asc' },
    });

    // Маппинг: parent_id → group_id, parent.name → group_name
    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      group_id: c.parent_id,
      group_name: c.parent?.name ?? null,
      metadata: c.metadata,
    }));

    return successResponse(result);
  } catch {
    return internalError();
  }
}
