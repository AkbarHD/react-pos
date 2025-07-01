<?php

namespace Database\Seeders;

use App\Models\Provincy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class ProvincesTableSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil data provinsi dari API Rajaongkir
        $response = Http::withHeaders([
            'key' => config('services.rajaongkir.api_key'),
        ])->get('https://api.rajaongkir.com/starter/province');

        // dd($response->json());

        // Loop data provinsi yang diterima dari API
        foreach ($response['rajaongkir']['results'] as $province) {
            // Simpan setiap provinsi ke dalam tabel 'provinces'
            Provincy::create([
                'id'   => $province['province_id'],
                'name' => $province['province']
            ]);
        }
    }
}
