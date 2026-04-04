import { z } from 'zod';

export const createAppointmentSchema = z.object({
  user_id: z
    .number()
    .int('ID do usuário deve ser um número inteiro')
    .min(1, 'ID do usuário é obrigatório'),
  service_id: z
    .number()
    .int('ID do serviço deve ser um número inteiro')
    .min(1, 'ID do serviço é obrigatório'),
  start_time: z
    .string()
    .min(1, 'Data e hora são obrigatórias')
    .refine(
      (value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value),
      'Data e hora devem estar no formato YYYY-MM-DDTHH:MM (formato datetime-local)'
    ),
});

export type CreateAppointmentFormData = z.infer<typeof createAppointmentSchema>