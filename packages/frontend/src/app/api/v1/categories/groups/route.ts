import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { successResponse, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/categories/groups — список групп верхнего уровня (parent_id = null)
// =============================================================================

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const groups = await prisma.category.findMany({
      where: { parent_id: null },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { sort_order: 'asc' },
    });

    return successResponse(groups);
  } catch {
    return internalError();
  }
}
