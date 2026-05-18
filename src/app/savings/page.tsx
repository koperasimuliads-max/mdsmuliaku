"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Savings {
  id: string;
  memberName: string;
  memberNik: string;
  accountType: "wajib" | "sukarela" | "pelajar" | "pokok" | "sibuhar" | "masadepan" | "hari tua";
  balance: number;
  interestRate: number; // annual
  lastTransaction: string;
  status: "aktif" | "nonaktif" | "tertutup";
  monthlyDeposit: number;
  totalInterest: number;
}

export default function Savings() {
  const [savingsList, setSavingsList] = useState<Savings[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "wajib" | "sukarela" | "pelajar" | "aktif" | "nonaktif" | "tertutup">("all");

  useEffect(() => {
    // Simulate fetching savings data
    const fetchSavings = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Sample data
      const sampleSavings: Savings[] = [
        {
          id: "1",
          memberName: "Budi Santoso",
          memberNik: "3201011203900001",
          accountType: "wajib",
          balance: 5000000,
          interestRate: 6,
          lastTransaction: "2024-05-15",
          status: "aktif",
          monthlyDeposit: 200000,
          totalInterest: 150000
        },
        {
          id: "2",
          memberName: "Budi Santoso",
          memberNik: "3201011203900001",
          accountType: "sukarela",
          balance: 12500000,
          interestRate: 5,
          lastTransaction: "2024-05-10",
          status: "aktif",
          monthlyDeposit: 500000,
          totalInterest: 375000
        },
        {
          id: "3",
          memberName: "Siti Rahayu",
          memberNik: "3201014506910002",
          accountType: "wajib",
          balance: 3000000,
          interestRate: 6,
          lastTransaction: "2024-05-12",
          status: "aktif",
          monthlyDeposit: 150000,
          totalInterest: 90000
        },
        {
          id: "4",
          memberName: "Siti Rahayu",
          memberNik: "3201014506910002",
          accountType: "pelajar",
          balance: 2000000,
          interestRate: 4,
          lastTransaction: "2024-05-08",
          status: "aktif",
          monthlyDeposit: 100000,
          totalInterest: 40000
        },
        {
          id: "5",
          memberName: "Ahmad Fauzi",
          memberNik: "3201017809920003",
          accountType: "wajib",
          balance: 0,
          interestRate: 6,
          lastTransaction: "2024-01-20",
          status: "nonaktif",
          monthlyDeposit: 0,
          totalInterest: 0
        }
      ];
      
      setSavingsList(sampleSavings);
      setLoading(false);
    };

    fetchSavings();
  }, []);

  const filteredSavings = savingsList.filter(saving => {
    const matchesSearch = saving.memberName.toLowerCase().includes(search.toLowerCase()) ||
                         saving.memberNik.includes(search);
    
    const matchesAccountType = 
      filter === "all" || 
      filter === "wajib" && saving.accountType === "wajib" ||
      filter === "sukarela" && saving.accountType === "sukarela" ||
      filter === "pelajar" && saving.accountType === "pelajar";
    
    const matchesStatus = 
      filter === "all" || 
      filter === "aktif" && saving.status === "aktif" ||
      filter === "nonaktif" && saving.status === "nonaktif" ||
      filter === "tertutup" && saving.status === "tertutup";
    
    // If filter is account type, ignore status filter and vice versa
    const isAccountTypeFilter = ["wajib", "sukarela", "pelajar"].includes(filter);
    const isStatusFilter = ["aktif", "nonaktif", "tertutup"].includes(filter);
    
    if (isAccountTypeFilter) {
      return matchesSearch && matchesAccountType;
    }
    if (isStatusFilter) {
      return matchesSearch && matchesStatus;
    }
    return matchesSearch; // "all" filter
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAccountTypeLabel = (type: Savings["accountType"]): string => {
    switch (type) {
       case "wajib": return "Simpanan Wajib";

       case "sukarela": return "Simpanan Sukarela";

       case "pelajar": return "Simpanan Pelajar";
      default: return type;
    }
  };

  const getAccountTypeIcon = (type: Savings["accountType"]): string => {
    switch (type) {
      case "wajib": return "💳";
      case "sukarela": return "💰";
      case "pelajar": return "🎓";
      default: return "💳";
    }
  };

  const getStatusBadgeClass = (status: Savings["status"]): string => {
    switch (status) {
      case "aktif": return "bg-emerald-100 text-emerald-800";
      case "nonaktif": return "bg-gray-100 text-gray-800";
      case "tertutup": return "bg-rose-100 text-rose-800";
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
             Manajemen Simpanan
          </h1>
          <div className="flex items-center space-x-3">
            <Link 
              href="/savings/add" 
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <span className="text-lg">+</span>
               Buka Simpanan Baru
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
                  placeholder="Cari nama anggota atau NIK..."
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
                   <option value="all">Semua Jenis Simpanan</option>

                   <option value="wajib">Simpanan Wajib</option>

                   <option value="sukarela">Simpanan Sukarela</option>

                   <option value="pelajar">Simpanan Pelajar</option>
                  <option value="aktif">Status Aktif</option>
                  <option value="nonaktif">Status Nonaktif</option>
                  <option value="tertutup">Status Tertutup</option>
                </select>
              </div>
            </div>
          </div>
          
          {savingsList.length === 0 && filteredSavings.length === 0 && (
            <div className="px-6 py-12 text-center">
               <p className="text-gray-500">Belum ada data simpanan</p>
              <Link 
                href="/savings/add" 
                className="mt-4 inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                 Buka Simpanan Pertama
              </Link>
            </div>
          )}
          
          {!loading && filteredSavings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Anggota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Jenis Simpanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suku Bunga/Tahun
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Setoran/Bulan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Bunga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaksi Terakhir
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSavings.map((saving) => (
                    <tr key={saving.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {saving.memberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saving.memberNik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-sm font-medium text-gray-900">
                        <div className="text-xl">{getAccountTypeIcon(saving.accountType)}</div>
                        <div>{getAccountTypeLabel(saving.accountType)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(saving.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {saving.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(saving.monthlyDeposit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(saving.totalInterest)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(saving.lastTransaction).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(saving.status)}`}>
                          {saving.status === "aktif" ? "Aktif" : saving.status === "nonaktif" ? "Nonaktif" : "Tertutup"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link 
                          href={`/savings/${saving.id}/detail`} 
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Detail
                        </Link>
                        {saving.status === "aktif" && (
                          <>
                            <Link 
                              href={`/savings/${saving.id}/deposit`} 
                              className="text-emerald-600 hover:text-emerald-500 mr-2"
                            >
                              Setoran
                            </Link>
                            <Link 
                              href={`/savings/${saving.id}/withdraw`} 
                              className="text-blue-600 hover:text-blue-500"
                            >
                              Penarikan
                            </Link>
                          </>
                        )}
                        {saving.status === "nonaktif" && (
                          <Link 
                            href={`/savings/${saving.id}/activate`} 
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            Aktifkan
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
               Menampilkan {filteredSavings.length} dari {savingsList.length} rekening simpanan
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                 Ringkasan Simpanan
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-emerald-800 mb-2">
                     Total Simpanan Wajib
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      savingsList
                        .filter(s => s.accountType === "wajib" && s.status === "aktif")
                        .reduce((sum, saving) => sum + saving.balance, 0)
                    )}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">
                     Total Simpanan Sukarela
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      savingsList
                        .filter(s => s.accountType === "sukarela" && s.status === "aktif")
                        .reduce((sum, saving) => sum + saving.balance, 0)
                    )}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">
                     Total Simpanan Pelajar
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      savingsList
                        .filter(s => s.accountType === "pelajar" && s.status === "aktif")
                        .reduce((sum, saving) => sum + saving.balance, 0)
                    )}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">
                    Total Bunga yang Diperoleh
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      savingsList
                        .reduce((sum, saving) => sum + saving.totalInterest, 0)
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