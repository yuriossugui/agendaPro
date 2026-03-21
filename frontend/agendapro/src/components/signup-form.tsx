import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@/schemas/register-schema"
import { registerRequest } from "@/services/auth-service"
import { useState } from "react"
import axios from "axios"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await registerRequest(data)
      navigate("/login")
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as { message?: string }
        setError(errorData.message || "Erro ao criar conta. Tente novamente.")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erro ao criar conta. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Crie sua conta</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Digite seus dados abaixo para criar sua conta
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Michael Scott"
                  {...register("name")}
                />
                {errors.name && (
                  <FieldDescription className="text-red-600">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <FieldDescription className="text-red-600">
                    {errors.email.message}
                  </FieldDescription>
                )}
                <FieldDescription>
                  Usaremos isso para contatá-lo. Não compartilharemos seu
                  e-mail com ninguém.
                </FieldDescription>
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <FieldDescription className="text-red-600">
                        {errors.password.message}
                      </FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password_confirmation">
                      Confirmar Senha
                    </FieldLabel>
                    <Input
                      id="password_confirmation"
                      type="password"
                      {...register("password_confirmation")}
                    />
                    {errors.password_confirmation && (
                      <FieldDescription className="text-red-600">
                        {errors.password_confirmation.message}
                      </FieldDescription>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Deve ter pelo menos 6 caracteres.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Criar Conta"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Já tem uma conta? <Link to="/login">Fazer login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/register_background_image.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
