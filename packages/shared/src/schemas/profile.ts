import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'Имя не может быть пустым')
    .optional(),
  last_name: z
    .string()
    .min(1, 'Фамилия не может быть пустой')
    .optional(),
  phone: z
    .string()
    .regex(/^\+375\d{9}$/, 'Номер телефона должен быть в формате +375XXXXXXXXX')
    .optional(),
  city_id: z.number().optional(),
  about: z
    .string()
    .optional(),
  experience_years: z
    .number()
    .int('Опыт должен быть целым числом')
    .min(0, 'Опыт не может быть отрицательным')
    .optional(),
});

export const skillsSchema = z.object({
  category_ids: z
    .array(z.number(), {
      required_error: 'Категории обязательны',
      invalid_type_error: 'Категории должны быть массивом чисел',
    })
    .min(1, 'Должна быть выбрана хотя бы одна категория'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SkillsInput = z.infer<typeof skillsSchema>;
