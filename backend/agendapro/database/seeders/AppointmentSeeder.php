<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Appointment;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Appointment::create([
            'user_id' => 2,
            'service_id' => 1,
            'start_time' => '2026-01-27 13:00:00',
            'end_time' => '2026-01-27 13:30:00',
            'status' => 'scheduled',
        ]);
    }
}
