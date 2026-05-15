import { z } from 'zod';

// -----------------------------------------------------------------------------
// createOrderSchema — создание заказа
// -----------------------------------------------------------------------------

export const createOrderSchema = z.object({
  category_id: z
    .number({ required_error: 'Категория обязательна' })
    .int('Категория должна быть целым числом')
    .positive('Категория должна быть положительным числом'),
  title: z
    .string({ required_error: 'Название обязательно' })
    .min(5, 'Название должно содержать минимум 5 символов')
    .max(200, 'Название не должно превышать 200 символов'),
  description: z
    .string({ required_error: 'Описание обязательно' })
    .min(20, 'Описание должно содержать минимум 20 символов'),
  project_description: z
    .string()
    .optional(),
  budget_min: z
    .number()
    .min(0, 'Минимальный бюджет не может быть отрицательным')
    .optional(),
  budget_max: z
    .number()
    .optional(),
  deadline: z
    .string()
    .optional(),
  city_id: z
    .number()
    .optional(),
  address: z
    .string()
    .optional(),
});

// -----------------------------------------------------------------------------
// respondSchema — отклик на заказ
// -----------------------------------------------------------------------------

export const respondSchema = z.object({
  price_offer: z
    .number()
    .optional(),
  message: z
    .string()
    .max(1000, 'Сообщение не должно превышать 1000 символов')
    .optional(),
});

// -----------------------------------------------------------------------------
// updateOrderStatusSchema — изменение статуса заказа
// -----------------------------------------------------------------------------

export const updateOrderStatusSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], {
    required_error: 'Статус обязателен',
    invalid_type_error: 'Статус должен быть OPEN, IN_PROGRESS, COMPLETED или CANCELLED',
  }),
});

// -----------------------------------------------------------------------------
// updateResponseStatusSchema — изменение статуса отклика
// -----------------------------------------------------------------------------

export const updateResponseStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED'], {
    required_error: 'Статус обязателен',
    invalid_type_error: 'Статус должен быть ACCEPTED или REJECTED',
  }),
});

// -----------------------------------------------------------------------------
// Inferred types
// -----------------------------------------------------------------------------

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type RespondInput = z.infer<typeof respondSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateResponseStatusInput = z.infer<typeof updateResponseStatusSchema>;
