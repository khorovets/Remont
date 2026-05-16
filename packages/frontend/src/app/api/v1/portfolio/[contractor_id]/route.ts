import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, internalError } from '@/lib/response';

// =============================================================================
// GET /api/v1/portfolio/[contractor_id] — портфолио исполнителя, сгруппированное по категориям
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { contractor_id: string } },
): Promise<NextResponse> {
  try {
    // 1. Извлечь и валидировать contractor_id из params
    const contractorId = Number(params.contractor_id);

    if (!Number.isInteger(contractorId) || contractorId < 1) {
      return errorResponse('VALIDATION_ERROR', 'Некорректный ID исполнителя', 400);
    }

    // 2. Извлечь опциональный category_id из query
    const { searchParams } = request.nextUrl;
    const categoryIdParam = searchParams.get('category_id');
    let categoryId: number | undefined;

    if (categoryIdParam !== null) {
      categoryId = Number(categoryIdParam);

      if (!Number.isInteger(categoryId) || categoryId < 1) {
        return errorResponse(
          'VALIDATION_ERROR',
          'category_id должен быть положительным целым числом',
          400,
        );
      }
    }

    // 3. Построить where-условие
    const where: Record<string, number> = { contractor_id: contractorId };

    if (categoryId !== undefined) {
      where.category_id = categoryId;
    }

    // 4. Запросить портфолио из БД
    const items = await prisma.portfolio.findMany({
      where,
      select: {
        id: true,
        photo_url: true,
        description: true,
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // 5. Сгруппировать по category_id на стороне сервера
    const grouped = new Map<number, {
      category_id: number;
      category_name: string;
      photos: { id: number; photo_url: string; description: string | null }[];
    }>();

    for (const item of items) {
      const { id, photo_url, description, category } = item;

      if (!grouped.has(category.id)) {
        grouped.set(category.id, {
          category_id: category.id,
          category_name: category.name,
          photos: [],
        });
      }

      grouped.get(category.id)!.photos.push({ id, photo_url, description });
    }

    const by_category = Array.from(grouped.values());

    // 6. Вернуть успешный ответ
    return successResponse({ by_category });
  } catch {
    return internalError();
  }
}
