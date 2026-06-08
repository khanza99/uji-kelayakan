<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->paginate(10);
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:superadmin,staff,user',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $request->role,
        ]);

        $user->assignRole($request->role);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'user' => $user->load('roles'),
        ], 201);
    }

    public function show(User $user)
    {
        return response()->json([
            'user' => $user->load('roles'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:superadmin,staff,user',
        ]);

        $user->update([
            'name' => $request->name  ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'phone' => $request->has('phone') ? $request->phone : $user->phone,
            'role' => $request->role  ?? $user->role,
        ]);

        if ($request->role) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'message' => 'User berhasil diupdate',
            'user' => $user->load('roles'),
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return response()->json([
                'message' => 'Tidak bisa menghapus akun sendiri',
            ], 422);
        }

        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus',
        ]);
    }
}