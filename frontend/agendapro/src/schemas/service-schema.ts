import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome não pode ter mais de 255 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(1000, "Descrição não pode ter mais de 1000 caracteres"),
  duration_minutes: z
    .number()
    .min(1, "Duração deve ser pelo menos 1 minuto")
    .max(480, "Duração não pode exceder 8 horas (480 minutos)"),
  price: z
    .number()
    .min(0.01, "Preço deve ser maior que 0")
    .max(99999.99, "Preço não pode exceder 99999.99"),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
