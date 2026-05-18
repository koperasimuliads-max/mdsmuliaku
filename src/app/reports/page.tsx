"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface ReportData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  link: string;
}

interface ChartData {
  name: string;
  value: number;
}

export default function ReportsAnalytics() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  useEffect(() => {
    // Simulate fetching reports data
    const fetchReports = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
       setReports([
         {
           id: "1",
           title: "Laporan Keuangan Bulanan",
           description: "Ringkasan pemasukan, pengeluaran, dan saldo akhir setiap bulan",
           icon: "📊",
           color: "bg-indigo-100 text-indigo-800",
           link: "/reports/financial"
         },
         {
           id: "2",
           title: "Laporan Anggota Aktif",
           description: "Analisis pertumbuhan dan distribusi anggota berdasarkan demografi",
           icon: "👥",
           color: "bg-emerald-100 text-emerald-800",
           link: "/reports/members"
         },
         {
           id: "3",
           title: "Laporan Pinjaman",
           description: "Analisis portofolio pinjaman, tingkat bunga, dan risiko kredit",
           icon: "💰",
           color: "bg-amber-100 text-amber-800",
           link: "/reports/loans"
         },
         {
           id: "4",
            title: "Laporan Simpanan",
           description: "Analisis saldo simpanan, suku bunga yang dibayarkan, dan likuiditas",
           icon: "🏦",
           color: "bg-blue-100 text-blue-800",
           link: "/reports/savings"
         }
       ]);
      
      setLoading(false);
    };

    fetchReports();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Sample chart data
  const financialChartData: ChartData[] = [
    { name: "Pemasukan", value: 850000000 },
    { name: "Pengeluaran", value: 420000000 },
    { name: "Laba Bersih", value: 430000000 }
  ];

  const memberGrowthData: ChartData[] = [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 135 },
    { name: "Mar", value: 142 },
    { name: "Apr", value: 158 },
    { name: "Mei", value: 167 },
    { name: "Jun", value: 182 }
  ];

  const loanPortfolioData: ChartData[] = [
    { name: "Pinjaman Usaha", value: 45 },
    { name: "Pinjaman Rumah", value: 30 },
    { name: "Pinjaman Kendaraan", value: 15 },
    { name: "Pinjaman Pendidikan", value: 10 }
  ];

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
            Laporan dan Analitik
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="quarter">Kuartal Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
            <Link 
              href="/reports/add" 
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <span className="text-lg">+</span>
              Buat Laporan Baru
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Laporan Utama
            </h2>
          </div>
          <div className="grid gap-6 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {reports.map((report) => (
                <Link 
                  key={report.id} 
                  href={report.link} 
                  className="group block hover:shadow-xl transition-shadow"
                >
                  <div className={`${report.color} rounded-2xl p-6 flex items-start space-x-4`}>
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-white/20 rounded-xl">
                      <span className="text-2xl">{report.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Analitik Kinerja
              </h2>
            </div>
            <div className="grid gap-6 px-6 py-4">
              <div className="grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Keuangan Bulan Ini
                  </h3>
                  <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                    {/* Simplified bar chart */}
                    <div className="flex h-full">
                      <div className="w-1/3 bg-indigo-500"></div>
                      <div className="w-1/3 bg-gray-300"></div>
                      <div className="w-1/3 bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Pemasukan</span>
                      <span>{formatCurrency(850000000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pengeluaran</span>
                      <span>{formatCurrency(420000000)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Laba Bersih</span>
                      <span>{formatCurrency(430000000)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Pertumbuhan Anggota
                  </h3>
                  <div className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                    {/* Simplified line chart */}
                    <div className="h-full flex items-end">
                      <div className="w-1/6 bg-emerald-400"></div>
                      <div className="w-1/6 bg-emerald-300"></div>
                      <div className="w-1/6 bg-emerald-200"></div>
                      <div className="w-1/6 bg-emerald-100"></div>
                      <div className="w-1/6 bg-emerald-50"></div>
                      <div className="w-1/6 bg-emerald-400"></div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Anggota baru bulan ini: +15 (12.5% growth)
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
                Portofolio Pinjaman
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Distribusi Jenis Pinjaman
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg">
                    <div className="p-3 rounded-full bg-amber-200">
                      <span className="text-amber-600 text-xl">🏦</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Usaha</p>
                      <p className="text-base font-bold text-gray-900">45%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="p-3 rounded-full bg-blue-200">
                      <span className="text-blue-600 text-xl">🏠</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Rumah</p>
                      <p className="text-base font-bold text-gray-900">30%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
                    <div className="p-3 rounded-full bg-indigo-200">
                      <span className="text-indigo-600 text-xl">🚗</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Kendaraan</p>
                      <p className="text-base font-bold text-gray-900">15%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <div className="p-3 rounded-full bg-purple-200">
                      <span className="text-purple-600 text-xl">📚</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Pinjaman Pendidikan</p>
                      <p className="text-base font-bold text-gray-900">10%</p>
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