<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    // Register user baru dan kembalikan token JWT.
    public function register(Request $request)
    {
        // Validasi input register.
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        // Simpan user baru ke database.
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'user',
        ]);

        $user->assignRole('user');

        // Buat token JWT untuk user baru.
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Register berhasil',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // Login user dan keluarkan token JWT.
    public function login(Request $request)
    {
        // Validasi kredensial login.
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            // Gagal autentikasi.
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401);
        }

        $user = JWTAuth::user();

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Ambil data profil user yang sedang login.
    public function me()
    {
        // Load relasi role untuk profil user.
        return response()->json([
            'user' => JWTAuth::user()->load('roles'),
        ]);
    }

    // Refresh token JWT pengguna.
    public function refresh()
    {
        try {
            $token = JWTAuth::refresh(JWTAuth::getToken());

            return response()->json([
                'token' => $token,
            ]);
        } catch (JWTException $e) {
            // Token refresh gagal.
            return response()->json([
                'message' => 'Token tidak valid atau sudah expired',
            ], 401);
        }
    }

    // Logout user dan invalidasi token JWT.
    public function logout()
    {
        // Invalidate token saat logout.
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}
