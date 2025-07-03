export const formatRupiah = (number) => {
    if (!number || number === 0) return 'Rp'; // Jika number tidak ada atau nol, kembalikan 'Rp' tanpa angka
    // Gunakan Intl.NumberFormat untuk memformat angka menjadi format mata uang Indonesia (IDR) dan menghapus bagian ,00 di akhir hasil format:
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(number).replace(/,00$/, ''); //
};
