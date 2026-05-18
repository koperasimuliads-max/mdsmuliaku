"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  title: string;
  value: string | number;
  icon: () => React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  color: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats([
        {
          title: "Total Anggota",
          value: "1,245",
          icon: () => <span className="text-xl">👥</span>,
          trend: "up",
          trendValue: "+12% dari bulan lalu",
          color: "bg-indigo-100 text-indigo-800"
        },
        {
          title: "Total Pinjaman Aktif",
          value: "Rp 845,5 Juta",
          icon: () => <span className="text-xl">💰</span>,
          trend: "up",
          trendValue: "+8% dari bulan lalu",
          color: "bg-emerald-100 text-emerald-800"
        },
        {
           title: "Total Simpanan",
          value: "Rp 1,2 T",
          icon: () => <span className="text-xl">🏦</span>,
          trend: "up",
          trendValue: "+15% dari bulan lalu",
          color: "bg-blue-100 text-blue-800"
        },
        {
          title: "Transaksi Hari Ini",
          value: "87",
          icon: () => <span className="text-xl">📊</span>,
          trend: "neutral",
          trendValue: "Stabil",
          color: "bg-purple-100 text-purple-800"
        }
      ]);
      
      setLoading(false);
    };

    fetchData();
  }, []);

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
            Dashboard KSP Mulia Dana Sejahtera
          </h1>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="text-sm text-indigo-600 hover:text-indigo-700">
              Profil Saya
            </Link>
            <Link href="/auth" className="px-4 py-2 border border-indigo-300 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50">
              Keluar
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-white/20">
                    {stat.icon()}
                  </div>
                  <h3 className="ml-4 text-lg font-medium text-gray-800">{stat.title}</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className={`text-sm font-medium ${
                  stat.trend === "up"
                    ? "text-emerald-600"
                    : stat.trend === "down"
                    ? "text-rose-600"
                    : "text-gray-500"
                }`}>
                  {stat.trendValue}
                </p>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  Aktivitas Terbaru
                </h2>
              </div>
              <div className="space-y-4 px-6 py-4">
                {/* Sample activity items */}
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <span className="text-indigo-600">💳</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Penyaluran pinjaman baru kepada anggota
                    </p>
                    <p className="text-sm text-gray-500">
                      Hari ini, 10:30
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-emerald-100">
                    <span className="text-emerald-600">💰</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Setoran simpanan anggota
                    </p>
                    <p className="text-sm text-gray-500">
                      Kemarin, 15:45
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-purple-100">
                    <span className="text-purple-600">📝</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Pembayaran cicilan pinjaman
                    </p>
                    <p className="text-sm text-gray-500">
                      Kemarin, 09:15
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Laporan Singkat
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 px-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Pertumbuhan Anggota (6 Bulan Terakhir)
                </h3>
                <div className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                  {/* In a real app, this would be a chart */}
                  <div className="flex h-full items-end">
                    <div className="w-1/6 bg-indigo-500"></div>
                    <div className="w-1/6 bg-indigo-400"></div>
                    <div className="w-1/6 bg-indigo-300"></div>
                    <div className="w-1/6 bg-indigo-200"></div>
                    <div className="w-1/6 bg-indigo-100"></div>
                    <div className="w-1/6 bg-indigo-50"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Grafik menunjukkan pertumbuhan anggota secara konsisten
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Distribusi Jenis Pinjaman
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="p-2 rounded-full bg-indigo-200">
                      <span className="text-indigo-600">🏦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Usaha</p>
                      <p className="text-sm text-gray-500">45%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="p-2 rounded-full bg-emerald-200">
                      <span className="text-emerald-600">🏠</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Kepemilikan Rumah</p>
                      <p className="text-sm text-gray-500">30%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="p-2 rounded-full bg-purple-200">
                      <span className="text-purple-600">🚗</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Kendaraan</p>
                      <p className="text-sm text-gray-500">15%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-rose-50 rounded-lg">
                    <div className="p-2 rounded-full bg-rose-200">
                      <span className="text-rose-600">📚</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Pendidikan</p>
                      <p className="text-sm text-gray-500">10%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}