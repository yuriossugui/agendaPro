import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SettingsContent = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Gerencie suas configurações de conta</p>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">Informações de Perfil</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome" defaultValue="Michael Scott" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                defaultValue="michael@scott.com"
              />
            </div>
          </div>
          <Button className="w-full md:w-auto">Salvar Alterações</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="shadow-lg border-0">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Notificações por Email</p>
                <p className="text-sm text-gray-600">Receba atualizações sobre seus agendamentos</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="font-medium text-gray-900">Tema Escuro</p>
                <p className="text-sm text-gray-600">Ativar modo escuro</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Settings = () => {
  return (
    <Layout>
      <SettingsContent />
    </Layout>
  );
};

export default Settings;
