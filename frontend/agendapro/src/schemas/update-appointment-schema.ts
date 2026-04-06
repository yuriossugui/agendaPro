import { z } from 'zod';

export const updateServiceSchema = z.object({
  user_id: z 
    .number()
    .int('O id do usuário deve ser do tipo inteiro')
    .min(1, 'o id do usuário é obrigatório')
    .optional(),
  service_id: z 
    .number()
    .int('O id do serviço deve ser do tipo inteiro')
    .min(1, 'o id do serviço é obrigatório')
    .optional(),
  start_time: z
    .string()
    .min(1, 'Data e hora são obrigatórias')
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value),
      'Data e hora devem estar no formato YYYY-MM-DDTHH:MM (formato datetime-local)'
    )
    .optional(),
  status: z 
    .enum(['scheduled', 'completed', 'canceled'])
    .optional()
}).refine(
  (data) => Object.values(data).some(value => value !== undefined),
  'Pelo menos um campo deve ser alterado'
);

export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;
