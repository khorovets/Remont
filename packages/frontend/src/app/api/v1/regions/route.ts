import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { successResponse, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/regions — список областей (6 областей + г. Минск = 7)
// =============================================================================

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const regions = await prisma.region.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { sort_order: 'asc' },
    });

    return successResponse(regions);
  } catch {
    return internalError();
  }
}
