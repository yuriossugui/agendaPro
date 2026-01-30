<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::paginate(25);
        return response()->json($services);
    }

    public function all()
    {
        $services = Service::all();
        return response()->json($services);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:100',
            'description' => 'required|string|min:3|max:200',
            'duration_minutes' => 'required|integer|min:1',
            'price' => 'sometimes|numeric|min:1'
        ]);

        $service = new Service();
        $service->name = $request->name;
        $service->description = $request->description;
        $service->duration_minutes = $request->duration_minutes;
        $service->price = $request->price;
        $service->save();

        return response()->json([
            'message' => 'Serviço cadastrado com sucesso !',
            'data' => $service,
        ],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Serviço não encontrado.'], 404);
        }
        return response()->json($service);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Serviço não encontrado.'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|min:3|max:100',
            'description' => 'sometimes|required|string|min:3|max:200',
            'duration_minutes' => 'sometimes|required|integer|min:1',
            'price' => 'sometimes|numeric|min:1'
        ]);

        if ($request->has('name')) {
            $service->name = $request->name;
        }
        if ($request->has('description')) {
            $service->description = $request->description;
        }
        if ($request->has('duration_minutes')) {
            $service->duration_minutes = $request->duration_minutes;
        }
        if ($request->has('price')) {
            $service->price = $request->price;
        }
        $service->save();

        return response()->json([
            'message' => 'Serviço atualizado com sucesso !',
            'data' => $service,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['message' => 'Serviço não encontrado.'], 404);
        }

        $service->delete();

        return response()->json(['message' => 'Serviço deletado com sucesso !']);
    }
}
