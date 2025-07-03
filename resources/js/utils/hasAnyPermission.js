import { usePage } from '@inertiajs/react';

export default function hasAnyPermission(permissions) {
    const { auth } = usePage().props; // ini fungsinya untuk mengambil data auth dari halaman yang sedang aktif
    const allPermissions = auth.permissions; // auth.permissions adalah array yang berisi semua permission yang dimiliki user

    return permissions.some(permission => allPermissions[permission]);  // mengecek apakah ada permission yang cocok
    // jika ada, maka akan mengembalikan true, jika tidak ada, maka akan
    // mengembalikan false
    // contoh penggunaan: hasAnyPermission(['create', 'edit']) akan mengembalikan
    // true jika user memiliki permission 'create' atau 'edit', dan false jika tidak
    // memiliki keduanya
    // ini akan digunakan untuk mengecek apakah user memiliki permission tertentu
    // sebelum menampilkan tombol atau link tertentu di frontend
}
