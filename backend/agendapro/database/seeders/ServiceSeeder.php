<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::factory()->create([
            'name' => 'Troca de Óleo',
            'description' => 'Troca de Óleo W40 + Militec, troca de filtro de óleo e limpeza de filtro de ar',
            'duration_minutes' => 25,
            'price' => 200.50,
        ]);

        Service::factory()->create([
            'name' => 'Faxina do Escritório',
            'description' => 'Realizar faxina no chão, mesas e prateleiras do escritório',
            'duration_minutes' => 30,
        ]);
    }
}
