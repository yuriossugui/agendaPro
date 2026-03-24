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
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import type { ServiceItem } from "@/types";
import { cn } from "@/lib/utils";

const ServiceContent: React.FC = () => {
  // Mock data - será substituído por requisição à API
  const [appointments, setAppointments] = useState<ServiceItem[]>([
    {
			id: 1,
			name: "Troca de Óleo",
			description: "Troca de Óleo W40 + Militec, troca de filtro de óleo e limpeza de filtro de ar",
			duration_minutes: 25,
			price: "200.50",
			created_at: "2026-02-08T20:59:03.000000Z",
			updated_at: "2026-02-08T20:59:03.000000Z",
			deleted_at: null
		},
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const handleEdit = (id: number) => {
    // TODO: Implementar lógica de edição
    console.log("Editando agendamento:", id);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os seus serviços</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Serviço
          </Button>
        </div>

        {/* Table Card */}
        <Card className="overflow-hidden shadow-lg border-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-linear-to-r from-slate-50 to-slate-100 border-b">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nome</TableHead>
                    <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
                    <TableHead className="font-semibold text-gray-700">Duração (Minutos)</TableHead>
                    <TableHead className="font-semibold text-gray-700">Preço</TableHead>
                    <TableHead className="font-semibold text-gray-700">Data de Criação</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <TableRow
                        key={appointment.id}
                        className={cn(
                          "hover:bg-gray-50 transition-colors border-b",
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        )}
                      >
                        <TableCell className="font-medium text-gray-900">
                          #{appointment.id}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {appointment.name}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm max-w-xs truncate">
                          {appointment.description}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {appointment.duration_minutes} min
                        </TableCell>
                        <TableCell className="text-gray-700 font-medium">
                          R$ {parseFloat(appointment.price).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {formatDate(appointment.created_at || "")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-blue-50"
                              onClick={() => handleEdit(appointment.id)}
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-red-50"
                              onClick={() => handleDelete(appointment.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <p className="text-gray-500">Nenhum serviço encontrado</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-sm text-gray-600">
          <p>Total de serviços: <span className="font-semibold">{appointments.length}</span></p>
        </div>
      </div>
    </div>
  );
};

const Service: React.FC = () => {
  return (
    <Layout>
      <ServiceContent />
    </Layout>
  );
};

export default Service;