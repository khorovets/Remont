import { ZodSchema } from 'zod';

// =============================================================================
// validateBody<T> — безопасный Zod-парсинг тела запроса
// =============================================================================

type Success<T> = { success: true; data: T };
type Failure = { success: false; error: { code: string; message: string } };

export function validateBody<T>(
  schema: ZodSchema<T>,
  body: unknown,
): Success<T> | Failure {
  const result = schema.safeParse(body);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: result.error.message,
    },
  };
}
