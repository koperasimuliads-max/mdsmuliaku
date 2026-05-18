"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  date: string;
  type: "setoran" | "penarikan" | "pembayaran_pinjam" | "pencairan_pinjam" | "bunga" | "biaya_admin";
  amount: number;
  memberName: string;
  memberNik: string;
  reference: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "setoran" | "penarikan" | "pembayaran_pinjam" | "pencairan_pinjam" | "bunga" | "biaya_admin">("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulate fetching transactions data
    const fetchTransactions = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample data
      const sampleTransactions: Transaction[] = [
        {
          id: "1",
          date: "2024-05-18",
          type: "setoran",
          amount: 500000,
          memberName: "Budi Santoso",
          memberNik: "3201011203900001",
          reference: "SET/20240518/001",
          status: "completed",
          description: "Setoran tabungan wajib"
        },
        {
          id: "2",
          date: "2024-05-17",
          type: "pembayaran_pinjam",
          amount: 23537,
          memberName: "Budi Santoso",
          memberNik: "3201011203900001",
          reference: "BYR/20240517/001",
          status: "completed",
          description: "Cicilan pinjaman usaha kopi"
        },
        {
          id: "3",
          date: "2024-05-16",
          type: "pencairan_pinjam",
          amount: 30000000,
          memberName: "Ahmad Fauzi",
          memberNik: "3201017809920003",
          reference: "PCR/20240516/001",
          status: "completed",
          description: "Pencairan pinjaman pembelihan rumah"
        },
        {
          id: "4",
          date: "2024-05-15",
          type: "bunga",
          amount: 150000,
          memberName: "Budi Santoso",
          memberNik: "3201011203900001",
          reference: "BG/20240515/001",
          status: "completed",
          description: "Bunga tabungan sukarela April 2024"
        },
        {
          id: "5",
          date: "2024-05-14",
          type: "penarikan",
          amount: 2000000,
          memberName: "Siti Rahayu",
          memberNik: "3201014506910002",
          reference: "PNR/20240514/001",
          status: "completed",
          description: "Penarikan tabungan sukarela"
        },
        {
          id: "6",
          date: "2024-05-13",
          type: "biaya_admin",
          amount: 50000,
          memberName: "Ahmad Fauzi",
          memberNik: "3201017809920003",
          reference: "ADM/20240513/001",
          status: "completed",
          description: "Biaya administrasi pinjaman"
        }
      ];
      
      setTransactions(sampleTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.memberName.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.memberNik.includes(search) ||
                         transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.reference.includes(search);
    
    const matchesType = filter === "all" || transaction.type === filter;
    
    // Date filtering would go here in a real implementation
    const matchesDate = true; // Simplified for demo
    
    return matchesSearch && matchesType && matchesDate;
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionTypeLabel = (type: Transaction["type"]): string => {
    switch (type) {
      case "setoran": return "Setoran Tabungan";
      case "penarikan": return "Penarikan Tabungan";
      case "pembayaran_pinjam": return "Pembayaran Pinjaman";
      case "pencairan_pinjam": return "Pencairan Pinjaman";
      case "bunga": return "Penerimaan Bunga";
      case "biaya_admin": return "Biaya Administrasi";
      default: return type;
    }
  };

  const getTransactionTypeIcon = (type: Transaction["type"]): string => {
    switch (type) {
      case "setoran": return "💰";
      case "penarikan": return "🏧";
      case "pembayaran_pinjam": return "💳";
      case "pencairan_pinjam": return "💸";
      case "bunga": return "📈";
      case "biaya_admin": return "💳";
      default: return "📝";
    }
  };

  const getTransactionTypeColor = (type: Transaction["type"]): string => {
    switch (type) {
      case "setoran": return "bg-emerald-50 text-emerald-800";
      case "penarikan": return "bg-rose-50 text-rose-800";
      case "pembayaran_pinjam": return "bg-indigo-50 text-indigo-800";
      case "pencairan_pinjam": return "bg-blue-50 text-blue-800";
      case "bunga": return "bg-yellow-50 text-yellow-800";
      case "biaya_admin": return "bg-gray-50 text-gray-800";
      default: return "bg-gray-50 text-gray-800";
    }
  };

  const getStatusBadgeClass = (status: Transaction["status"]): string => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500 h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">
            Riwayat Transaksi
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="year">Tahun Ini</option>
              <option value="custom">Custom Range</option>
            </select>
            <Link 
              href="/transactions/add" 
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <span className="text-lg">+</span>
              Tambah Transaksi
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, NIK, deskripsi, atau nomor referensi..."
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full max-w-xs sm:w-auto"
                >
                </input>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">Semua Jenis Transaksi</option>
                  <option value="setoran">Setoran Tabungan</option>
                  <option value="penarikan">Penarikan Tabungan</option>
                  <option value="pembayaran_pinjam">Pembayaran Pinjaman</option>
                  <option value="pencairan_pinjam">Pencairan Pinjaman</option>
                  <option value="bunga">Penerimaan Bunga</option>
                  <option value="biaya_admin">Biaya Administrasi</option>
                </select>
              </div>
            </div>
          </div>
          
          {transactions.length === 0 && filteredTransactions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Belum ada data transaksi</p>
              <Link 
                href="/transactions/add" 
                className="mt-4 inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Catat Transaksi Pertama
              </Link>
            </div>
          )}
          
          {!loading && filteredTransactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Transaksi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Anggota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referensi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-sm font-medium">
                        <div className="p-2 rounded-full">{getTransactionTypeIcon(transaction.type)}</div>
                        <div className={`${getTransactionTypeColor(transaction.type)} px-3 py-1 rounded text-xs font-medium`}>
                          {getTransactionTypeLabel(transaction.type)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.memberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.memberNik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status === "completed" ? "Selesai" : transaction.status === "pending" ? "Menunggu" : "Gagal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link 
                          href={`/transactions/${transaction.id}/detail`} 
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Detail
                        </Link>
                        {transaction.status === "pending" && (
                          <Link 
                            href={`/transactions/${transaction.id}/process`} 
                            className="text-emerald-600 hover:text-emerald-500"
                          >
                            Proses
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Ringkasan Transaksi
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-emerald-800 mb-2">
                    Total Setoran Bulan Ini
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === "setoran" && t.status === "completed")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-rose-800 mb-2">
                    Total Penarikan Bulan Ini
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === "penarikan" && t.status === "completed")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">
                    Total Pembayaran Pinjaman
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === "pembayaran_pinjam" && t.status === "completed")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                    Total Pencairan Pinjaman
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      transactions
                        .filter(t => t.type === "pencairan_pinjam" && t.status === "completed")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}