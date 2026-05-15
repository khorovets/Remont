// =============================================================================
// Order Types — Remont.by
// =============================================================================

// -----------------------------------------------------------------------------
// Статусы
// -----------------------------------------------------------------------------

/** Статус заказа: OPEN → IN_PROGRESS → COMPLETED / CANCELLED */
export type OrderStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

/** Статус отклика: PENDING → ACCEPTED / REJECTED */
export type ResponseStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

// -----------------------------------------------------------------------------
// Вспомогательные (связанные) типы
// -----------------------------------------------------------------------------

/** Минимальный тип города (денормализованный) */
export interface OrderCity {
  id: number
  name: string
  slug: string
}

/** Минимальный тип категории (денормализованный) */
export interface OrderCategory {
  id: number
  name: string
  slug: string
  parent_id: number | null
}

// -----------------------------------------------------------------------------
// OrderResponse — отклик на заказ
// -----------------------------------------------------------------------------

export interface OrderResponse {
  id: number
  order_id: number
  contractor_id: number
  /** Предложение цены, BYN */
  price_offer: number | null
  /** Сопроводительное сообщение */
  message: string | null
  status: ResponseStatus
  created_at: string
}

// -----------------------------------------------------------------------------
// Order — полный тип заказа
// -----------------------------------------------------------------------------

export interface Order {
  id: number
  customer_id: number
  category_id: number
  category: OrderCategory | null
  /** Краткое название */
  title: string
  /** Описание работ */
  description: string
  /** Полное описание для AI-анализа (будущее) */
  project_description: string | null
  /** Минимальный бюджет, BYN */
  budget_min: number | null
  /** Максимальный бюджет, BYN */
  budget_max: number | null
  /** Желаемый срок завершения */
  deadline: string | null
  city_id: number | null
  city: OrderCity | null
  /** Адрес объекта */
  address: string | null
  status: OrderStatus
  created_at: string
  updated_at: string

  /** Отклики на заказ */
  responses: OrderResponse[]
}

// -----------------------------------------------------------------------------
// OrderListItem — краткий тип для списка заказов
// -----------------------------------------------------------------------------

export interface OrderListItem {
  id: number
  title: string
  description: string
  budget_min: number | null
  budget_max: number | null
  deadline: string | null
  status: OrderStatus
  created_at: string
  /** Денормализованное имя категории */
  category_name: string
  /** Денормализованное имя города */
  city_name: string | null
  /** Количество откликов */
  responses_count: number
}

// -----------------------------------------------------------------------------
// CreateOrderInput — данные для создания заказа
// -----------------------------------------------------------------------------

export interface CreateOrderInput {
  category_id: number
  title: string
  description: string
  project_description?: string | null
  budget_min?: number | null
  budget_max?: number | null
  deadline?: string | null
  city_id?: number | null
  address?: string | null
}

// -----------------------------------------------------------------------------
// RespondInput — данные для отклика на заказ
// -----------------------------------------------------------------------------

export interface RespondInput {
  /** Предложение цены, BYN */
  price_offer?: number | null
  /** Сопроводительное сообщение */
  message?: string | null
}
