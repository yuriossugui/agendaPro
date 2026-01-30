<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Service;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $appointments = Appointment::with('user', 'service')->paginate(25);
        return response()->json($appointments);
    }

    public function all()
    {
        $appointments = Appointment::with('user', 'service')->get();
        return response()->json($appointments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'service_id' => 'required|integer|exists:services,id',
            'start_time' => 'required|date_format:Y-m-d H:i:s|after_or_equal:now',
        ]);

        $service = Service::findOrFail($request->service_id);
        
        $serviceDuration = $service->duration_minutes;

        $startTime = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->start_time);
        $endTime = $startTime->copy()->addMinutes($serviceDuration);

        $conflict = Appointment::where('service_id', $request->service_id)
        ->where(function ($query) use ($startTime, $endTime) {
            $query->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q) use ($startTime, $endTime) {
                      $q->where('start_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                  });
        })
        ->exists();

        if ($conflict) {
            return response()->json(['error' => 'Já existe um agendamento para este horário.'], 409);
        }

        $appointment = Appointment::create([
            'user_id' => $request->user_id,
            'service_id' => $request->service_id,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        return response()->json($appointment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $appointment = Appointment::with('user','service')->findOrFail($id);
        if (!$appointment) {
            return response()->json(['message' => 'Agendamento não encontrado.'], 404);
        }
        return response()->json($appointment);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Agendamento não encontrado.'], 404);
        }

        $request->validate([
            'user_id' => 'sometimes|required|integer|exists:users,id',
            'service_id' => 'sometimes|required|integer|exists:services,id',
            'start_time' => 'sometimes|required|date_format:Y-m-d H:i:s|after_or_equal:now',
            'status' => 'sometimes|required|string|in:scheduled,canceled',
        ]);

        $serviceId = $request->has('service_id') ? $request->service_id : $appointment->service_id;
        $startTime = $request->has('start_time') ? $request->start_time : $appointment->start_time;

        $service = Service::findOrFail($serviceId);
        $serviceDuration = $service->duration_minutes;

        $startTimeCarbon = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $startTime);
        $endTime = $startTimeCarbon->copy()->addMinutes($serviceDuration);

        $conflict = Appointment::where('service_id', $serviceId)
        ->where('id', '!=', $appointment->id)
        ->where('status', '!=', 'canceled') 
        ->where(function ($query) use ($startTimeCarbon, $endTime) {
            $query->where(function ($q) use ($startTimeCarbon, $endTime) {
                $q->where('start_time', '<=', $endTime)
                  ->where('end_time', '>=', $startTimeCarbon);
            });
        })
        ->exists();

        if ($conflict) {
            return response()->json(['error' => 'Já existe um agendamento para este horário.'], 409);
        }

        $appointment->user_id = $request->has('user_id') ? $request->user_id : $appointment->user_id;
        $appointment->service_id = $serviceId;
        $appointment->start_time = $startTimeCarbon;
        $appointment->end_time = $endTime;
        if ($request->has('status')) {
            $appointment->status = $request->status;
        }

        $appointment->save();

        return response()->json([
            'message' => 'Agendamento atualizado com sucesso !',
            'data' => $appointment,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $appointment = Appointment::find($id);
        if (!$appointment) {
            return response()->json(['message' => 'Agendamento não encontrado.'], 404);
        }

        $appointment->delete();

        return response()->json(['message' => 'Agendamento deletado com sucesso !']);
    }
}
