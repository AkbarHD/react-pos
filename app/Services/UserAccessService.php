<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

class UserAccessService
{
    /**
     * Cek akses user ke store tertentu
     */
    public function checkStoreAccess(?int $targetStoreId): bool
    {
        $user = Auth::user();

        // Admin selalu boleh akses
        if ($user->hasRole('admin')) {
            return true;
        }

        // Cek kesesuaian store_id
        return $user->store_id === $targetStoreId;
    }

    /**
     * Cek akses ke user tertentu
     */
    public function checkUserAccess(int $targetUserId): bool
    {
        $user = Auth::user();

        // Admin atau user sendiri
        return $user->hasRole('admin') || $user->id === $targetUserId;
    }

    /**
     * Cek akses ke resource model
     */
    public function checkModelAccess(Model $model): bool
    {
        $user = Auth::user();

        if ($user->hasRole('admin')) {
            return true;
        }

        // Jika model adalah Warehouse
        if ($model instanceof Warehouse) {
            return $model->stores()->where('store_id', $user->store_id)->exists();
        }

        // Jika model Store
        if ($model instanceof Store) {
            return $model->id === $user->store_id;
        }

        // Untuk model lainnya
        return $model->store_id === $user->store_id;
    }

    /**
     * Dapatkan store_id user yang login
     */
    public function getStoreId(): ?int
    {
        return Auth::user()->store_id ?? null;
    }

    /**
     * Cek apakah user adalah admin
     */
    public function isAdmin(): bool
    {
        return Auth::user()->hasRole('admin');
    }

    /**
     * Mendapatkan ID user yang sedang login.
     */
    public function getUserId(): int
    {
        return Auth::user()->id;
    }
}
