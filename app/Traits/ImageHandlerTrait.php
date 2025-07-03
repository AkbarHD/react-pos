<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait ImageHandlerTrait
{
    // ini fungsinya untuk mengupload gambar
    // ke storage/public/images
    // dan mengembalikan nama file yang diupload
    public function uploadImage(UploadedFile $file, $directory = 'images'): string
    {
        $imageName = $file->hashName();
        $file->storeAs($directory, $imageName, 'public');
        return $imageName;
    }

    // ini fungsinya untuk mengupdate gambar
    // dengan menghapus gambar lama jika ada
    // dan mengupload gambar baru
    public function updateImage(?string $oldFileName, UploadedFile $newFile, $directory = 'images'): string
    {
        $this->deleteImage($oldFileName, $directory);
        return $this->uploadImage($newFile, $directory);
    }

    // ini fungsinya untuk menghapus gambar
    // dari storage/public/images
    // jika file ada
    // jika tidak ada, tidak melakukan apa-apa
    public function deleteImage($fileName, $directory = 'images'): void
    {
        if ($fileName && Storage::disk('public')->exists("{$directory}/{$fileName}")) {
            Storage::disk('public')->delete("{$directory}/{$fileName}");
        }
    }
}
