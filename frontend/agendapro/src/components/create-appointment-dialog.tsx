import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createAppointmentSchema, type CreateAppointmentFormData } from "@/schemas/create-appointment-schema";
import type { ServiceItem, User } from "@/types";
import { getUserRequest } from "@/services/auth-service";
import { getServicesRequest } from "@/services/service-service";

interface CreateAppointmentDialogProps {
  // Props opcionais para compatibilidade com a página pai
  // O componente busca os dados dinamicamente via API
  users?: User[];
  services?: ServiceItem[];
  onAppointmentCreated?: (data: CreateAppointmentFormData) => void;
}

export function CreateAppointmentDialog({
  onAppointmentCreated,
}: CreateAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [loadedServices, setLoadedServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await getUserRequest();
        setUserId(response.id);
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await getServicesRequest();
        setLoadedServices(response.data);
      } catch (error) {
        console.error("Erro ao obter serviços:", error);
      }
    };

    fetchUserId();
    fetchServices();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateAppointmentFormData>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      user_id: userId,
      service_id: undefined,
      start_time: "",
    },
  });

  useEffect(() => {
    if (userId) {
      setValue("user_id", userId);
    }
  }, [userId, setValue]);

  const onSubmit = async (data: CreateAppointmentFormData) => {
    setIsSubmitting(true);

    try {
      // Converter formato datetime-local (YYYY-MM-DDTHH:MM) para formato esperado (YYYY-MM-DD HH:MM:SS)
      const [date, time] = data.start_time.split("T");
      const startTimeFormatted = `${date} ${time}:00`;

      const formattedData = {
        ...data,
        start_time: startTimeFormatted,
      };

      console.log("Dados validados do agendamento:", {
        ...formattedData,
        timestamp: new Date().toISOString(),
      });

      if (onAppointmentCreated) {
        onAppointmentCreated(formattedData as any);
      }

      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Erro ao processar agendamento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormErrors = (data: any) => {
    console.log("Erros na validação do formulário:", data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, handleFormErrors)}
          className="space-y-4"
        >
          {/* Campo oculto para user_id */}
          <input type="hidden" {...register("user_id", { setValueAs: Number })} />

          <FieldGroup>
            {/* Selecionar Serviço */}
            <Field>
              <FieldLabel htmlFor="service_id">Serviço</FieldLabel>
              <select
                id="service_id"
                {...register("service_id", {
                  setValueAs: (value) => value ? Number(value) : undefined,
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um serviço</option>
                {loadedServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {parseFloat(service.price).toFixed(2)} ({service.duration_minutes}min)
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <FieldDescription className="text-red-600">
                  {errors.service_id.message}
                </FieldDescription>
              )}
            </Field>

            {/* Data e Hora */}
            <Field>
              <FieldLabel htmlFor="start_time">
                Data e Hora de Início
              </FieldLabel>
              <Input
                id="start_time"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:MM"
                {...register("start_time")}
              />
              <FieldDescription className="text-gray-500 text-xs">
                Selecione a data e hora do agendamento
              </FieldDescription>
              {errors.start_time && (
                <FieldDescription className="text-red-600">
                  {errors.start_time.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>

          {/* Footer com botões */}
          <DialogFooter className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                "Criar Agendamento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
