import { NextResponse } from 'next/server';
import type { ErrorCode } from '@remont/shared';

// =============================================================================
// successResponse<T> — успешный ответ с данными
// =============================================================================

export function successResponse<T>(
  data: T,
  status = 200,
): NextResponse {
  return NextResponse.json({ data, error: null }, { status });
}

// =============================================================================
// errorResponse — ответ с ошибкой
// =============================================================================

export function errorResponse(
  code: ErrorCode,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    { data: null, error: { code, message } },
    { status },
  );
}

// =============================================================================
// Shorthand'ы для типовых ошибок
// =============================================================================

export function notFound(message = 'Ресурс не найден'): NextResponse {
  return errorResponse('NOT_FOUND', message, 404);
}

export function unauthorized(): NextResponse {
  return errorResponse('UNAUTHORIZED', 'Необходима авторизация', 401);
}

export function forbidden(): NextResponse {
  return errorResponse('FORBIDDEN', 'Доступ запрещён', 403);
}

export function conflict(message = 'Конфликт данных'): NextResponse {
  return errorResponse('CONFLICT', message, 409);
}

export function internalError(): NextResponse {
  return errorResponse('INTERNAL_ERROR', 'Внутренняя ошибка сервера', 500);
}
