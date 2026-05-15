export * from './constants'

// ── Types ────────────────────────────────────────────────────────────────────

export * from './types/api'
export * from './types/dictionaries'
export * from './types/portfolio'

// Explicit re-exports to avoid conflict with schemas/order (Zod-inferred types take precedence)
export {
  type OrderStatus,
  type ResponseStatus,
  type OrderCity,
  type OrderCategory,
  type OrderResponse,
  type Order,
  type OrderListItem,
} from './types/order'

// Explicit re-exports to avoid City conflict with types/dictionaries
export {
  type Role,
  type ContractorSkill,
  type Portfolio,
  type User,
  type UserPublic,
  type UserProfile,
} from './types/user'

// ── Schemas ──────────────────────────────────────────────────────────────────

export * from './schemas/auth'
export * from './schemas/order'
export * from './schemas/profile'
export * from './schemas/review'
