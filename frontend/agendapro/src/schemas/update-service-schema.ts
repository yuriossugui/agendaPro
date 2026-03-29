import { z } from 'zod';

export const updateServiceSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  duration_minutes: z
    .number()
    .int('Duração deve ser um número inteiro')
    .min(1, 'Duração deve ser no mínimo 1 minuto')
    .optional(),
  price: z
    .number()
    .min(1, 'Preço deve ser no mínimo 1')
    .optional(),
}).refine(
  (data) => Object.values(data).some(value => value !== undefined && value !== ''),
  {
    message: 'Pelo menos um campo deve ser preenchido para atualizar',
    path: [],
  }
);

export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;
