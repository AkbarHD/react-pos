import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import AdminLayout from "../../../Layouts/AdminLayout";
import hasAnyPermission from '../../../utils/hasAnyPermission';
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer
} from 'recharts';

import { formatRupiah } from '../../../utils/rupiah';

const CARD_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#FF5722'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#9966FF', '#C9CBCF'];

const TITLES = {
  totalSales: 'Total Penjualan',
  totalTransactions: 'Total Transaksi',
  totalCustomers: 'Total Customer',
  totalProducts: 'Total Produk di Stok',
  totalSuppliers: 'Total Supplier Aktif',
};

const ICONS = {
  totalSales: 'bi bi-cash-stack',
  totalTransactions: 'bi bi-receipt',
  totalCustomers: 'bi bi-people-fill',
  totalProducts: 'bi bi-box-seam',
  totalSuppliers: 'bi bi-truck'
};

// Fungsi untuk memeriksa apakah data kosong
// Data dianggap kosong jika tidak ada atau jika array atau objek tersebut kosong
const isEmpty = (data) => !data || (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0);

// Komponen untuk menampilkan kartu statistik
// Menerima props seperti warna, ikon, judul, dan nilai
const StatCard = ({ color, icon, title, value }) => (
  <div className="col-6 col-md-4 col-lg-4 mb-3">
    <div
      className="card text-white text-center shadow h-100 p-4 d-flex flex-column justify-content-between"
      style={{ backgroundColor: color }}
    >
      <div
        className="mb-3 mx-auto bg-warning rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: 60, height: 60 }}
      >
        <i className={icon} style={{ fontSize: 24 }} />
      </div>
      <h5 className="fs-6 text-uppercase mb-1">{title}</h5>
      <p className="fs-4 fw-bold">{value}</p>
    </div>
  </div>
);

// Komponen untuk menampilkan kartu chart
// Menerima props seperti judul, children (untuk chart), dan pesan jika data kosong
// Jika children tidak diberikan, akan menampilkan pesan kosong
const ChartCard = ({ title, children, emptyMessage }) => (
  <div className="card shadow border-0 h-100">
    <div className="card-body">
      <h5 className="card-title text-center mb-3">{title}</h5>
      {children || <div className="text-center text-muted">{emptyMessage}</div>}
    </div>
  </div>
);

// Mapping antara statistik dan permission
const STAT_PERMISSION_MAP = {
  totalSales: 'dashboard.view_sales',
  totalTransactions: 'dashboard.view_transactions',
  totalCustomers: 'dashboard.view_customers',
  totalProducts: 'dashboard.view_products',
  totalSuppliers: 'dashboard.view_supplier',
};

export default function Dashboard() {

    // Mengambil data dari props yang diberikan oleh Inertia
  // Gunakan usePage untuk mendapatkan data yang dikirim dari server
  // Pastikan data ini sudah tersedia di controller sebelum dikirim ke view
  const { stats, transactionData, salesData, productsData, categoryData } = usePage().props;

  // Ubah data status transaksi agar sesuai dengan Recharts (name, value)
  const transactionStatusData = Object.entries(transactionData || {}).map(([name, value]) => ({ name, value }));

  return (
    <>
      <Head>
        <title>Dashboard - EasyPOS</title>
      </Head>

      <AdminLayout>
        <div className="container-fluid">
          <h1 className="mb-4 h3">Dashboard</h1>

          {/* Bagian Kartu Statistik */}
          <div className="row g-3">
            {/* perbadaan key dan i key : key = totalSales, i = 0 */}
            {Object.keys(stats).map((key, i) => {
              const permission = STAT_PERMISSION_MAP[key];
              if (!permission) return null;

              return (
                hasAnyPermission([permission]) && (
                  <StatCard
                    key={key}
                    color={CARD_COLORS[i % CARD_COLORS.length]}
                    icon={ICONS[key] || 'bi bi-plus-circle-fill'}
                    title={TITLES[key] || key}
                    value={key === 'totalSales' ? formatRupiah(stats[key]) : stats[key]}
                  />
                )
              );
            })}
          </div>

          {/* Pesan jika data transaksi kosong */}
          {/* Jika data transaksi kosong, tampilkan pesan */}
          {isEmpty(transactionData) && (
            <div className="alert alert-warning my-4">Data transaksi kosong. Tambahkan data terlebih dahulu.</div>
          )}

        {/* Bagian Kartu Chart jika ada data */}
          {/* Charts */}
          <div className="row g-4 my-4">
            {/* Chart Pie: Status Transaksi */}
            {hasAnyPermission(['dashboard.view_transactions']) && (
              <div className="col-md-6">
                <ChartCard title="Status Transaksi" emptyMessage="Data transaksi tidak tersedia">
                  {!isEmpty(transactionStatusData) && (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={transactionStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {transactionStatusData.map((_, idx) => (
                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            )}

            {/* Chart Line: Penjualan dari Waktu ke Waktu */}
            {hasAnyPermission(['dashboard.view_sales']) && (
              <div className="col-md-6">
                <ChartCard title="Penjualan dari Waktu ke Waktu" emptyMessage="Data penjualan tidak tersedia">
                  {!isEmpty(salesData) && (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => formatRupiah(value)} />

                        <Tooltip formatter={(value) => formatRupiah(value)} />

                        <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            )}
          </div>

          <div className="row g-4 my-4">
            {/* Chart Bar: Produk Terlaris */}
            {hasAnyPermission(['dashboard.view_products']) && (
              <div className="col-md-6">
                <ChartCard title="Produk Terlaris" emptyMessage="Data produk terlaris tidak tersedia">
                  {!isEmpty(productsData) && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={productsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_quantity" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            )}

            {/* Chart Bar: Stok Produk per Kategori */}
            {hasAnyPermission(['dashboard.view_products']) && (
              <div className="col-md-6">
                <ChartCard title="Stok Produk per Kategori" emptyMessage="Data kategori tidak tersedia">
                  {!isEmpty(categoryData) && (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_stock" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
