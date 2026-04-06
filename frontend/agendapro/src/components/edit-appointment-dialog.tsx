import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  updateServiceSchema,
  type UpdateServiceFormData,
} from "@/schemas/update-appointment-schema";
import type { AppointmentItem, ServiceItem } from "@/types";
import { getServicesRequest } from "@/services/service-service";

interface EditAppointmentDialogProps {
  appointment: AppointmentItem;
  onAppointmentUpdated?: (data: UpdateServiceFormData) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditAppointmentDialog({
  appointment,
  onAppointmentUpdated,
  isOpen = false,
  onOpenChange,
}: EditAppointmentDialogProps) {
  const [localOpen, setLocalOpen] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedServices, setLoadedServices] = useState<ServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  const open = isOpen !== undefined ? isOpen : localOpen;
  const setOpen = onOpenChange || setLocalOpen;

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const response = await getServicesRequest();
        setLoadedServices(response.data);
      } catch (error) {
        console.error("Erro ao obter serviços:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (open) {
      fetchServices();
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      user_id: appointment.user_id,
      service_id: appointment.service_id,
      start_time: appointment.start_time.replace(" ", "T").slice(0, 16),
      status:
        appointment.status === "no-show" ? undefined : appointment.status,
    },
  });

  useEffect(() => {
    if (!isLoadingServices && loadedServices.length > 0) {
      setValue("service_id", appointment.service_id);
    }
  }, [isLoadingServices, loadedServices, appointment.service_id, setValue]);

  const onSubmit = async (data: UpdateServiceFormData) => {
    setIsSubmitting(true);

    try {
      let startTimeFormatted = data.start_time;
      if (data.start_time) {
        const [date, time] = data.start_time.split("T");
        startTimeFormatted = `${date} ${time}:00`;
      }

      const payload: Record<string, any> = {};
      
      if (data.user_id !== undefined && data.user_id !== appointment.user_id) {
        payload.user_id = data.user_id;
      }
      if (data.service_id !== undefined && data.service_id !== appointment.service_id) {
        payload.service_id = data.service_id;
      }
      if (data.start_time !== undefined && startTimeFormatted) {
        payload.start_time = startTimeFormatted;
      }
      if (data.status !== undefined && data.status !== appointment.status) {
        payload.status = data.status;
      }

      console.log("Dados alterados para atualização de agendamento:", {
        ...payload,
        appointmentId: appointment.id,
        timestamp: new Date().toISOString(),
      });

      if (onAppointmentUpdated) {
        onAppointmentUpdated(payload as UpdateServiceFormData);
      }

      setOpen(false);
      reset();
    } catch (error) {
      console.error("Erro ao processar atualização:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data as UpdateServiceFormData))}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Selecionar Serviço */}
            <Field>
              <FieldLabel htmlFor="service_id">Serviço</FieldLabel>
              <select
                id="service_id"
                {...register("service_id", {
                  setValueAs: (value) => (value ? Number(value) : undefined),
                })}
                disabled={isLoadingServices}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Selecione um serviço</option>
                {loadedServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - R$ {parseFloat(service.price).toFixed(2)} (
                    {service.duration_minutes}min)
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

            {/* Status */}
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select
                id="status"
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um status</option>
                <option value="scheduled">Agendado</option>
                <option value="completed">Concluído</option>
                <option value="canceled">Cancelado</option>
              </select>
              {errors.status && (
                <FieldDescription className="text-red-600">
                  {errors.status.message}
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
                setOpen(false);
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
                  Atualizando...
                </>
              ) : (
                "Atualizar Agendamento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
