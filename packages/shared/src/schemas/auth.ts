import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email обязателен' })
    .min(5, 'Email должен содержать минимум 5 символов')
    .email('Некорректный формат email'),
  password: z
    .string({ required_error: 'Пароль обязателен' })
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(100, 'Пароль не должен превышать 100 символов'),
  role: z.enum(['CUSTOMER', 'CONTRACTOR'], {
    required_error: 'Роль обязательна',
    invalid_type_error: 'Роль должна быть CUSTOMER или CONTRACTOR',
  }),
  first_name: z
    .string({ required_error: 'Имя обязательно' })
    .min(1, 'Имя обязательно для заполнения'),
  last_name: z
    .string({ required_error: 'Фамилия обязательна' })
    .min(1, 'Фамилия обязательна для заполнения'),
  phone: z
    .string()
    .regex(/^\+375\d{9}$/, 'Номер телефона должен быть в формате +375XXXXXXXXX')
    .optional(),
  city_id: z.number().optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email обязателен' })
    .email('Некорректный формат email'),
  password: z
    .string({ required_error: 'Пароль обязателен' })
    .min(1, 'Пароль обязателен для заполнения'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
