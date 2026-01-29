import React from "react";
import { Mail, Lock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const Login: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      email: (form.email as HTMLInputElement).value,
      password: (form.password as HTMLInputElement).value,
      remember: (form.remember as HTMLInputElement).checked,
    };
    // substituir por lógica real de autenticação
    console.log("login:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220]">
      <Card className="w-full max-w-md bg-[#0f1724] border border-[#0a0f18] shadow-lg">
        <CardHeader className="px-8 pt-8">
          <CardTitle className="text-2xl text-gray-100">Entrar</CardTitle>
        </CardHeader>

        <CardContent className="px-8 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Mail size={16} />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-10 bg-[#0b1220] border-[#12202b] text-gray-100 placeholder-gray-400"
                  placeholder="seu@exemplo.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-3 text-gray-400">
                  <Lock size={16} />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 bg-[#0b1220] border-[#12202b] text-gray-100 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-gray-300">
                <Checkbox id="remember" name="remember" className="accent-[#0b3b8c]" />
                Lembrar-me
              </label>
              <a className="text-sm text-[#7fb0ff] hover:underline" href="#">
                Esqueci a senha
              </a>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-[#071428] hover:bg-[#0b3b8c] text-white border-none"
              >
                Entrar
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-0">
          <div className="w-full text-center text-sm text-gray-400">
            Não tem conta? <a className="text-[#7fb0ff] hover:underline" href="#">Crie uma</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;