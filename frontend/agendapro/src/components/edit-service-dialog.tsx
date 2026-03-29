import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  updateServiceSchema,
  type UpdateServiceFormData,
} from "@/schemas/update-service-schema";
import type { ServiceItem } from "@/types";

interface EditServiceDialogProps {
  service: ServiceItem;
  onServiceUpdated?: (data: UpdateServiceFormData) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditServiceDialog({
  service,
  onServiceUpdated,
  isOpen = false,
  onOpenChange,
}: EditServiceDialogProps) {
  const [localOpen, setLocalOpen] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = isOpen !== undefined ? isOpen : localOpen;
  const setOpen = onOpenChange || setLocalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateServiceFormData>({
    resolver: zodResolver(updateServiceSchema),
    defaultValues: {
      name: service.name || "",
      description: service.description || "",
      duration_minutes: service.duration_minutes || 30,
      price: parseFloat(service.price) || 0,
    },
  });

  const onSubmit = async (data: UpdateServiceFormData) => {
    setIsSubmitting(true);

    try {
      if (onServiceUpdated) {
        onServiceUpdated(data);
      }

      setOpen(false);
      reset();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Nome */}
            <Field>
              <FieldLabel htmlFor="name">Nome do Serviço</FieldLabel>
              <Input
                id="name"
                placeholder="Ex: Corte de cabelo"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <FieldDescription className="text-red-600">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            {/* Descrição */}
            <Field>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Textarea
                id="description"
                placeholder="Ex: Corte de cabelo com secagem e tratamento"
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <FieldDescription className="text-red-600">
                  {errors.description.message}
                </FieldDescription>
              )}
            </Field>

            {/* Duração e Preço em uma linha */}
            <div className="grid grid-cols-2 gap-4">
              {/* Duração */}
              <Field>
                <FieldLabel htmlFor="duration_minutes">
                  Duração (minutos)
                </FieldLabel>
                <Input
                  id="duration_minutes"
                  placeholder="Ex: 30"
                  type="number"
                  min="1"
                  max="480"
                  {...register("duration_minutes", {
                    valueAsNumber: true,
                  })}
                />
                {errors.duration_minutes && (
                  <FieldDescription className="text-red-600">
                    {errors.duration_minutes.message}
                  </FieldDescription>
                )}
              </Field>

              {/* Preço */}
              <Field>
                <FieldLabel htmlFor="price">Preço (R$)</FieldLabel>
                <Input
                  id="price"
                  placeholder="Ex: 50.00"
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register("price", {
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <FieldDescription className="text-red-600">
                    {errors.price.message}
                  </FieldDescription>
                )}
              </Field>
            </div>
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
              {isSubmitting ? "Atualizando..." : "Atualizar Serviço"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
