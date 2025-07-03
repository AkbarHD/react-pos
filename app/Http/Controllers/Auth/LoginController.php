<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Http;

class LoginController extends Controller
{
    /**
     * Menampilkan halaman login.
     */
    public function index()
    {

        return inertia('Auth/Login');
    }

    /**
     * Proses login.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {

            $request->session()->regenerate();

            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors([
            'email' => 'The credentials provided do not match our records.',
        ]);
    }

    public function faceLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'face_image' => 'required|file|image|max:2048',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$user->face_embeddings) {
            throw ValidationException::withMessages([
                'face_image' => 'No registered face data found for this email.',
            ]);
        }

        // Kirim gambar ke API Face Recognition
        $response = Http::asMultipart()->post('https://imagerecognize.com/api/v3/', [
            ['name' => 'apikey', 'contents' => env('FACE_API_KEY')],
            ['name' => 'type', 'contents' => 'detect_faces'],
            [
                'name' => 'file',
                'contents' => fopen($request->file('face_image')->getRealPath(), 'r'),
                'filename' => 'face_image.jpg',
            ],
        ]);

        if ($response->failed()) {
            Log::error('Face detection API failed: ' . $response->body());
            throw ValidationException::withMessages([
                'face_image' => 'Face detection failed. Please try again.',
            ]);
        }

        $responseData = $response->json();
        $detectedFaces = $responseData['data']['objects'] ?? [];

        if (empty($detectedFaces)) {
            throw ValidationException::withMessages([
                'face_image' => 'No face detected in the provided image.',
            ]);
        }

        if (count($detectedFaces) > 1) {
            throw ValidationException::withMessages([
                'face_image' => 'Multiple faces detected. Please provide an image with only one face.',
            ]);
        }

        $currentEmbedding = $detectedFaces[0];

        if (!$this->compareEmbeddings($user->face_embeddings, $currentEmbedding)) {
            throw ValidationException::withMessages([
                'face_image' => 'Face does not match registered data.',
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'redirect' => route('admin.dashboard'),
        ]);
    }

    private function compareEmbeddings($stored, $current)
    {
        $confidenceThreshold = 0.9;

        if (!isset($current['confidence']) || $current['confidence'] < $confidenceThreshold) {
            return false;
        }

        if (
            !isset($stored['coordinates']) ||
            !isset($current['coordinates']) ||
            count($stored['coordinates']) !== count($current['coordinates'])
        ) {
            return false;
        }

        $distance = 0;
        foreach ($stored['coordinates'] as $index => $storedCoord) {
            $currentCoord = $current['coordinates'][$index];
            $distance += pow($storedCoord['x'] - $currentCoord['x'], 2) +
                pow($storedCoord['y'] - $currentCoord['y'], 2) +
                pow($storedCoord['width'] - $currentCoord['width'], 2) +
                pow($storedCoord['height'] - $currentCoord['height'], 2);
        }
        $distance = sqrt($distance);

        $maxDistance = 0.1;

        return $distance <= $maxDistance;
    }
}
