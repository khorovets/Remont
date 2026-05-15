// =============================================================================
// Constants — Remont.by
// =============================================================================

// -----------------------------------------------------------------------------
// ROLE — роли пользователей
// -----------------------------------------------------------------------------

export const ROLE = {
  CUSTOMER: 'CUSTOMER',
  CONTRACTOR: 'CONTRACTOR',
} as const

// -----------------------------------------------------------------------------
// ORDER_STATUS — статусы заказа
// -----------------------------------------------------------------------------

export const ORDER_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

// -----------------------------------------------------------------------------
// RESPONSE_STATUS — статусы отклика
// -----------------------------------------------------------------------------

export const RESPONSE_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const

// -----------------------------------------------------------------------------
// ERROR_CODES — коды ошибок API
// -----------------------------------------------------------------------------

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

// -----------------------------------------------------------------------------
// UPLOAD — ограничения для загрузки файлов
// -----------------------------------------------------------------------------

export const UPLOAD = {
  /** Максимальный размер файла: 5 MiB */
  MAX_SIZE: 5 * 1024 * 1024,
  /** Допустимые MIME-типы изображений */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const
