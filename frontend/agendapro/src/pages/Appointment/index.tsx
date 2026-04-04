import React, { useState, useEffect } from "react";
import { Trash2, Edit, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
import axios from "axios";
import { createAppointmentRequest, getAppointmentsRequest } from "@/services/appointment-service";
import { CreateAppointmentDialog } from "@/components/create-appointment-dialog";
import type { CreateAppointmentFormData } from "@/schemas/create-appointment-schema";
import { ToastContainer, useToast } from "@/components/ui/toast";

const AppointmentContent: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginatedResponse<AppointmentItem> | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadAppointments(currentPage);
  }, [currentPage]);

  const loadAppointments = async (page: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getAppointmentsRequest(page);
      setAppointments(response.data);
      setPaginationData(response);
    } catch (err) {
      let errorMessage = "Erro ao carregar agendamentos";

      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as { message?: string; error?: string };
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }

    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  };

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const handleEdit = (id: number) => {
    // TODO: Implementar lógica de edição
    console.log("Editando agendamento:", id);
  };

  const handleAppointmentCreated = async (data: CreateAppointmentFormData) => {
    try {

      const response = await createAppointmentRequest(data);

      addToast({
        type: "success",
        message: response.message || "Agendamento cadastrado com sucesso!",
        duration: 3000,
      });

      loadAppointments(currentPage);
      
    } catch (err) {
      let errorMessage = "Erro ao cadastrar agendamento";

      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as { message?: string; error?: string };
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      addToast({
        type: "error",
        message: errorMessage,
        duration: 4000,
      });

      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os seus agendamentos</p>
        </div>
        <CreateAppointmentDialog 
          onAppointmentCreated={handleAppointmentCreated}
        />
      </div>

      {/* Error Alert */}
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
                onClick={() => loadAppointments(currentPage)}
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
              <p className="text-gray-600 font-medium">Carregando agendamentos...</p>
              <p className="text-gray-500 text-sm">Aguarde um momento</p>
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
                      <TableHead className="font-semibold text-gray-700">Serviço</TableHead>
                      <TableHead className="font-semibold text-gray-700">Início</TableHead>
                      <TableHead className="font-semibold text-gray-700">Término</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Valor</TableHead>
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
                            {formatDate(appointment.start_time)}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {formatDate(appointment.end_time)}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              {appointment.status === "scheduled" && "Agendado"}
                              {appointment.status === "completed" && "Concluído"}
                              {appointment.status === "cancelled" && "Cancelado"}
                              {appointment.status === "no-show" && "Não compareceu"}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-700 font-semibold">
                            <span className="text-green-600">
                              R$ {parseFloat(appointment.service?.price || "0").toFixed(2)}
                            </span>
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
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-4xl">📭</div>
                            <p className="text-gray-600 font-medium">Nenhum agendamento encontrado</p>
                            <p className="text-gray-500 text-sm">Comece criando seu primeiro agendamento</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination Card */}
          {paginationData && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info */}
                  <div className="text-sm text-gray-600">
                    <p>
                      Exibindo <span className="font-semibold text-gray-900">{paginationData.from}</span> até{" "}
                      <span className="font-semibold text-gray-900">{paginationData.to}</span> de{" "}
                      <span className="font-semibold text-gray-900">{paginationData.total}</span> agendamentos
                    </p>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!paginationData.prev_page_url}
                      onClick={() => setCurrentPage(currentPage - 1)}
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
                      onClick={() => setCurrentPage(currentPage + 1)}
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
