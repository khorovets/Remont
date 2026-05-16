import type { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-middleware';
import { requireRole } from '@/lib/role-middleware';
import {
  successResponse,
  errorResponse,
  unauthorized,
  forbidden,
  notFound,
  internalError,
} from '@/lib/response';

// =============================================================================
// DELETE /api/v1/portfolio/[id] — удаление фото портфолио (CONTRACTOR, владелец)
// =============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    // 1. Извлечь пользователя из токена
    const authUser = await getAuthUser(_request);

    if (!authUser) {
      return unauthorized();
    }

    // 2. Проверить роль — только CONTRACTOR
    requireRole(authUser, 'CONTRACTOR');

    // 3. Извлечь и валидировать id из params
    const portfolioId = Number(params.id);

    if (!Number.isInteger(portfolioId) || portfolioId < 1) {
      return errorResponse('VALIDATION_ERROR', 'Некорректный ID портфолио', 400);
    }

    // 4. Найти запись портфолио в БД
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      select: {
        id: true,
        contractor_id: true,
        photo_url: true,
      },
    });

    if (!portfolio) {
      return notFound('Фото портфолио не найдено');
    }

    // 5. Проверить что пользователь — владелец фото
    if (portfolio.contractor_id !== authUser.userId) {
      return forbidden();
    }

    // 6. Удалить файл с диска
    const filePath = path.join(process.cwd(), 'public', portfolio.photo_url);

    try {
      await fs.unlink(filePath);
    } catch {
      // Файл уже отсутствует на диске — не критично, продолжаем
    }

    // 7. Удалить запись из БД
    await prisma.portfolio.delete({
      where: { id: portfolioId },
    });

    // 8. Вернуть успешный ответ
    return successResponse({ deleted: true });
  } catch (error) {
    // requireRole выбрасывает ошибку с префиксом «Доступ запрещён»
    if (error instanceof Error && error.message.startsWith('Доступ запрещён')) {
      return forbidden();
    }

    return internalError();
  }
}
