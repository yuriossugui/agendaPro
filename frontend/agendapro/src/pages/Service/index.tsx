import React, { useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Row, ServiceItem as ServiceItem } from "@/types";

const sample = {
  current_page: 1,
  data: [
    {
      id: 1,
      user_id: 2,
      service_id: 1,
      start_time: "2026-01-27 13:00:00",
      end_time: "2026-01-27 13:30:00",
      status: "scheduled",
      created_at: "2026-01-27T14:08:11.000000Z",
      updated_at: "2026-01-27T14:08:11.000000Z",
      deleted_at: null,
      user: {
        id: 2,
        name: "admin",
        email: "admin@admin.com",
        email_verified_at: "2026-01-27T11:44:31.000000Z",
        created_at: "2026-01-27T11:44:31.000000Z",
        updated_at: "2026-01-27T11:44:31.000000Z",
      },
      service: {
        id: 1,
        name: "Troca de Óleo",
        description:
          "Troca de Óleo W40 + Militec, troca de filtro de óleo e limpeza de filtro de ar",
        duration_minutes: 25,
        price: "200.50",
        created_at: "2026-01-27T14:00:09.000000Z",
        updated_at: "2026-01-27T14:00:09.000000Z",
        deleted_at: null,
      },
    },
  ] as Row[],
};

const Service: React.FC = () => {
  // preencher lista de serviços a partir do JSON de exemplo (extrai serviços únicos)
  const initialServices: ServiceItem[] = Array.from(
    new Map(
      sample.data.map((r) => [r.service.id, r.service])
    ).values()
  );

  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: 30,
    price: "0.00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleCreate = (e?: React.FormEvent) => {
    e?.preventDefault();
    const nextId = services.length ? Math.max(...services.map((s) => s.id)) + 1 : 1;
    const newService: ServiceItem = {
      id: nextId,
      name: form.name || `Serviço ${nextId}`,
      description: form.description,
      duration_minutes: Number(form.duration_minutes),
      price: form.price,
    };
    setServices((s) => [newService, ...s]);
    setForm({ name: "", description: "", duration_minutes: 30, price: "0.00" });
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setServices((s) => s.filter((svc) => svc.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-[#0b1220]">
      <Card className="bg-[#0f1724] border border-[#925FE2] shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-gray-100">Serviços</CardTitle>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#0b3b8c] hover:bg-[#925FE2]">
                <Plus size={16} /> Novo serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm text-gray-100 bg-[#0f1724] border border-[#925FE2]">
              <DialogHeader>
                <DialogTitle>Novo serviço</DialogTitle>
                <DialogDescription>
                  Preencha os dados do serviço para cadastrar.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={(e) => handleCreate(e)} className="space-y-4 mt-2">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="bg-[#0b1220] text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="bg-[#0b1220] text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration_minutes">Duração (min)</Label>
                    <Input
                      id="duration_minutes"
                      name="duration_minutes"
                      type="number"
                      value={String(form.duration_minutes)}
                      onChange={handleChange}
                      className="bg-[#0b1220] text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="bg-[#0b1220] text-gray-100"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="bg-[#0b3b8c] hover:bg-[#925FE2]">
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">ID</TableHead>
                <TableHead className="text-gray-400">Serviço</TableHead>
                <TableHead className="text-gray-400">Descrição</TableHead>
                <TableHead className="text-gray-400">Duração</TableHead>
                <TableHead className="text-gray-400">Preço</TableHead>
                <TableHead className="text-gray-400">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-gray-300">{s.id}</TableCell>
                  <TableCell className="text-gray-100 font-medium">{s.name}</TableCell>
                  <TableCell className="text-gray-300">{s.description}</TableCell>
                  <TableCell className="text-gray-300">{s.duration_minutes} min</TableCell>
                  <TableCell className="text-gray-300">R$ {s.price}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-[#7fb0ff]">
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-400">
                    Nenhum serviço cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Service;