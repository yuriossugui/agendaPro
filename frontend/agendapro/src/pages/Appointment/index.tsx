import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
} from "lucide-react";
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
import type { AppointmentItem, PaginatedResponse } from "@/types";
import { cn } from "@/lib/utils";

// Mock de appointments paginados (substitui chamada ao appointment-service)
const MOCK_APPOINTMENTS: PaginatedResponse<AppointmentItem> = {
  current_page: 1,
  data: [
    {
      id: 1,
      user_id: 1,
      service_id: 1,
      start_time: "2026-03-26T09:00:00Z",
      end_time: "2026-03-26T09:30:00Z",
      status: "scheduled",
      created_at: "2026-03-20T10:00:00Z",
      updated_at: "2026-03-21T11:00:00Z",
      deleted_at: null,
      user: {
        id: 1,
        name: "João Silva",
        email: "joao.silva@example.com",
        email_verified_at: null,
      },
      service: {
        id: 1,
        name: "Consulta Inicial",
        description: "Avaliação inicial com o profissional.",
        duration_minutes: 30,
        price: "150.00",
        created_at: "2026-03-01T10:00:00Z",
        updated_at: "2026-03-10T10:00:00Z",
        deleted_at: null,
      },
    },
    {
      id: 2,
      user_id: 2,
      service_id: 2,
      start_time: "2026-03-26T10:00:00Z",
      end_time: "2026-03-26T11:00:00Z",
      status: "completed",
      created_at: "2026-03-18T14:00:00Z",
      updated_at: "2026-03-25T15:30:00Z",
      deleted_at: null,
      user: {
        id: 2,
        name: "Maria Oliveira",
        email: "maria.oliveira@example.com",
        email_verified_at: null,
      },
      service: {
        id: 2,
        name: "Sessão de Acompanhamento",
        description: "Sessão de acompanhamento recorrente.",
        duration_minutes: 60,
        price: "200.00",
        created_at: "2026-02-15T09:00:00Z",
        updated_at: "2026-03-05T09:00:00Z",
        deleted_at: null,
      },
    },
    {
      id: 3,
      user_id: 3,
      service_id: 1,
      start_time: "2026-03-27T15:00:00Z",
      end_time: "2026-03-27T15:30:00Z",
      status: "cancelled",
      created_at: "2026-03-19T09:30:00Z",
      updated_at: "2026-03-22T08:00:00Z",
      deleted_at: null,
      user: {
        id: 3,
        name: "Carlos Souza",
        email: "carlos.souza@example.com",
        email_verified_at: null,
      },
      service: {
        id: 1,
        name: "Consulta Inicial",
        description: "Avaliação inicial com o profissional.",
        duration_minutes: 30,
        price: "150.00",
        created_at: "2026-03-01T10:00:00Z",
        updated_at: "2026-03-10T10:00:00Z",
        deleted_at: null,
      },
    },
  ],
  first_page_url: "https://example.com/api/appointments?page=1",
  from: 1,
  last_page: 1,
  last_page_url: "https://example.com/api/appointments?page=1",
  links: [],
  next_page_url: null,
  path: "https://example.com/api/appointments",
  per_page: 10,
  prev_page_url: null,
  to: 3,
  total: 3,
};

function mockGetAppointments(page: number): Promise<PaginatedResponse<AppointmentItem>> {
  // Em um cenário real, poderíamos simular diferentes páginas; aqui mantemos simples
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...MOCK_APPOINTMENTS, current_page: page }), 600);
  });
}

function formatDateTime(dateString: string | undefined): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getStatusBadgeClasses(status: AppointmentItem["status"]): string {
  switch (status) {
    case "scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "no-show":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

const AppointmentContent: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationData, setPaginationData] =
    useState<PaginatedResponse<AppointmentItem> | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments(page: number) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await mockGetAppointments(page);
        if (!isMounted) return;

        setAppointments(response.data);
        setPaginationData(response);
      } catch (err) {
        if (!isMounted) return;
        setError("Erro ao carregar agendamentos (mock).");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadAppointments(currentPage);

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handleDelete = (id: number) => {
    setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
  };

  const handleEdit = (id: number) => {
    // Aqui no futuro você pode navegar para tela de edição ou abrir um modal
    console.log("Editando agendamento:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarClock className="w-8 h-8 text-blue-600" />
            Agendamentos
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie todos os compromissos marcados
          </p>
        </div>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Error Alert (mock) */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Erro ao carregar agendamentos</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-red-600 border-red-200 hover:bg-red-100"
                onClick={() => setCurrentPage((page) => page)}
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-gray-600 font-medium">Carregando agendamentos (mock)...</p>
              <p className="text-gray-500 text-sm">Os dados exibidos são apenas para testes.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Card */}
      {!isLoading && (
        <>
          <Card className="overflow-hidden shadow-lg border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-linear-to-r from-slate-50 to-slate-100 border-b">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                      <TableHead className="font-semibold text-gray-700">Serviço</TableHead>
                      <TableHead className="font-semibold text-gray-700">Início</TableHead>
                      <TableHead className="font-semibold text-gray-700">Término</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Valor</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-right">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length > 0 ? (
                      appointments.map((appointment, index) => (
                        <TableRow
                          key={appointment.id}
                          className={cn(
                            "hover:bg-gray-50 transition-colors border-b",
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                          )}
                        >
                          <TableCell className="font-medium text-gray-900">
                            #{appointment.id}
                          </TableCell>
                          <TableCell className="text-gray-700 font-medium">
                            {appointment.user?.name ?? "-"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {appointment.service?.name ?? "-"}
                              </span>
                              {appointment.service?.duration_minutes && (
                                <span className="text-xs text-gray-500">
                                  {appointment.service.duration_minutes} min
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {formatDateTime(appointment.start_time)}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {formatDateTime(appointment.end_time)}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border",
                                getStatusBadgeClasses(appointment.status),
                              )}
                            >
                              <span>
                                {appointment.status === "scheduled" && "Agendado"}
                                {appointment.status === "completed" && "Concluído"}
                                {appointment.status === "cancelled" && "Cancelado"}
                                {appointment.status === "no-show" && "Não compareceu"}
                              </span>
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-700 font-semibold">
                            {appointment.service?.price ? (
                              <span className="text-green-600">
                                R$ {parseFloat(appointment.service.price).toFixed(2)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 w-9 p-0 hover:bg-blue-50 border-blue-200"
                                onClick={() => handleEdit(appointment.id)}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 w-9 p-0 hover:bg-red-50 border-red-200"
                                onClick={() => handleDelete(appointment.id)}
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-4xl">📭</div>
                            <p className="text-gray-600 font-medium">
                              Nenhum agendamento encontrado
                            </p>
                            <p className="text-gray-500 text-sm">
                              Comece criando seu primeiro agendamento
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Card (mock) */}
          {paginationData && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info */}
                  <div className="text-sm text-gray-600">
                    <p>
                      Exibindo
                      <span className="font-semibold text-gray-900 ml-1">
                        {paginationData.from}
                      </span>{" "}
                      até
                      <span className="font-semibold text-gray-900 ml-1">
                        {paginationData.to}
                      </span>{" "}
                      de
                      <span className="font-semibold text-gray-900 ml-1">
                        {paginationData.total}
                      </span>{" "}
                      agendamentos (mock)
                    </p>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!paginationData.prev_page_url}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">
                        {paginationData.current_page}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-sm text-gray-600">
                        {paginationData.last_page}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!paginationData.next_page_url}
                      onClick={() => setCurrentPage((page) => page + 1)}
                      className="gap-2"
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

const Appointment: React.FC = () => {
  return (
    <Layout>
      <AppointmentContent />
    </Layout>
  );
};

export default Appointment;
