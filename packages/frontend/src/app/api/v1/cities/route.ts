import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/cities — список городов с фильтром по region_id и поиском
// =============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = request.nextUrl;
    const regionIdParam = searchParams.get('region_id');
    const search = searchParams.get('search');

    // Валидация region_id если передан
    let regionId: number | undefined;
    if (regionIdParam !== null) {
      regionId = Number(regionIdParam);
      if (!Number.isInteger(regionId) || regionId < 1) {
        return errorResponse(
          'VALIDATION_ERROR',
          'region_id должен быть положительным целым числом',
          400,
        );
      }
    }

    // Построение where-условия
    const where: Record<string, unknown> = {};

    if (regionId !== undefined) {
      where.region_id = regionId;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const cities = await prisma.city.findMany({
      where,
      include: {
        region: {
          select: { name: true },
        },
      },
      orderBy: { sort_order: 'asc' },
    });

    return successResponse(cities);
  } catch {
    return internalError();
  }
}
