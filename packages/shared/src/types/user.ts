// =============================================================================
// User Types — Remont.by
// =============================================================================

/** Роль пользователя */
export type Role = 'CUSTOMER' | 'CONTRACTOR'

// -----------------------------------------------------------------------------
// Вспомогательные (связанные) типы
// -----------------------------------------------------------------------------

export interface City {
  id: number
  name: string
  slug: string
  region_id: number
  sort_order: number
}

export interface ContractorSkill {
  id: number
  contractor_id: number
  category_id: number
  rating: number
  reviews_count: number
  created_at: string
}

export interface Portfolio {
  id: number
  contractor_id: number
  category_id: number
  photo_url: string
  description: string | null
  created_at: string
}

// -----------------------------------------------------------------------------
// User — полный тип (Prisma User без password_hash)
// -----------------------------------------------------------------------------

export interface User {
  id: number
  email: string
  role: Role
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  city_id: number | null
  city: City | null
  about: string | null
  experience_years: number | null
  created_at: string
  updated_at: string

  // Связанные коллекции
  skills: ContractorSkill[]
  portfolio: Portfolio[]
  // Для остальных связей — легковесные заглушки;
  // при необходимости типизировать глубже.
  orders: unknown[]
  responses: unknown[]
  reviews_given: unknown[]
  reviews_received: unknown[]
  favorites: unknown[]
  favorited_by: unknown[]
  user_subscriptions: unknown[]
  messages_sent: unknown[]
  messages_received: unknown[]
}

// -----------------------------------------------------------------------------
// UserPublic — безопасный тип для ответов API
// (email и phone — опциональны)
// -----------------------------------------------------------------------------

export interface UserPublic {
  id: number
  email?: string
  role: Role
  first_name: string | null
  last_name: string | null
  phone?: string | null
  avatar_url: string | null
  city_id: number | null
  city: City | null
  about: string | null
  experience_years: number | null
  created_at: string
  updated_at: string

  skills: ContractorSkill[]
  portfolio: Portfolio[]
}

// -----------------------------------------------------------------------------
// UserProfile — профиль исполнителя (city, skills, portfolio)
// -----------------------------------------------------------------------------

export interface UserProfile {
  id: number
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  city: City | null
  about: string | null
  experience_years: number | null
  skills: ContractorSkill[]
  portfolio: Portfolio[]
  created_at: string
}
