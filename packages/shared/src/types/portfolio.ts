// =============================================================================
// Portfolio Types — Remont.by
// =============================================================================

// -----------------------------------------------------------------------------
// PortfolioItem — элемент портфолио исполнителя
// -----------------------------------------------------------------------------

export interface PortfolioItem {
  id: number
  contractor_id: number
  category_id: number
  /** Денормализованное имя категории */
  category_name?: string
  photo_url: string
  /** Описание работы */
  description?: string | null
  created_at: string
}

// -----------------------------------------------------------------------------
// PortfolioByCategory — портфолио, сгруппированное по категориям
// -----------------------------------------------------------------------------

export interface PortfolioByCategory {
  category_id: number
  category_name: string
  /** Фотографии работ в категории */
  photos: PortfolioItem[]
}

// -----------------------------------------------------------------------------
// Review — отзыв о работе исполнителя
// -----------------------------------------------------------------------------

export interface Review {
  id: number
  order_id: number
  customer_id: number
  /** Денормализованное имя заказчика */
  customer_name?: string
  contractor_id: number
  category_id: number
  /** Денормализованное имя категории */
  category_name?: string
  /** Оценка (1–5) */
  rating: number
  /** Текст отзыва */
  text?: string | null
  created_at: string
}

// -----------------------------------------------------------------------------
// Favorite — избранный исполнитель (денормализованный)
// -----------------------------------------------------------------------------

export interface Favorite {
  contractor_id: number
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
  /** Денормализованное имя города */
  city_name?: string | null
  /** Средний рейтинг исполнителя */
  rating_avg?: number | null
}
