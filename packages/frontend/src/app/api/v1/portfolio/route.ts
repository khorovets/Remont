import type { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-middleware';
import { requireRole } from '@/lib/role-middleware';
import { parseUpload } from '@/lib/upload';
import {
  successResponse,
  errorResponse,
  unauthorized,
  forbidden,
  internalError,
} from '@/lib/response';

// =============================================================================
// POST /api/v1/portfolio — загрузка фото портфолио (CONTRACTOR)
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Извлечь пользователя из токена
    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorized();
    }

    // 2. Проверить роль — только CONTRACTOR
    requireRole(authUser, 'CONTRACTOR');

    // 3. Разобрать multipart/form-data (photo файл + поля)
    const { fields, files } = await parseUpload(request);

    // 4. Валидировать наличие файла
    const photo = files[0];

    if (!photo) {
      return errorResponse('VALIDATION_ERROR', 'Файл photo обязателен', 400);
    }

    // 5. Валидировать category_id
    const categoryIdRaw = fields.category_id;
    const categoryId = Number(categoryIdRaw);

    if (!categoryIdRaw || !Number.isInteger(categoryId) || categoryId < 1) {
      return errorResponse(
        'VALIDATION_ERROR',
        'category_id должен быть положительным целым числом',
        400,
      );
    }

    // 6. Проверить, что категория существует
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return errorResponse(
        'NOT_FOUND',
        `Категория с id=${categoryId} не найдена`,
        400,
      );
    }

    // 7. Собрать photo_url
    const photoUrl = `/uploads/portfolio/${photo.filename}`;

    // 8. description — опционально
    const description = fields.description?.trim() || null;

    // 9. Сохранить в БД
    const portfolio = await prisma.portfolio.create({
      data: {
        contractor_id: authUser.userId,
        category_id: categoryId,
        photo_url: photoUrl,
        description,
      },
    });

    // 10. Вернуть успешный ответ (201)
    return successResponse(
      {
        id: portfolio.id,
        photo_url: portfolio.photo_url,
        category_id: portfolio.category_id,
        description: portfolio.description,
      },
      201,
    );
  } catch (error) {
    // requireRole выбрасывает ошибку с префиксом «Доступ запрещён»
    if (error instanceof Error && error.message.startsWith('Доступ запрещён')) {
      return forbidden();
    }

    // Ошибки multer (недопустимый тип, превышение размера и т.д.)
    if (error instanceof Error) {
      return errorResponse('VALIDATION_ERROR', error.message, 400);
    }

    return internalError();
  }
}
