import Link from "next/link";
import { useState, useEffect } from "react";

interface Loan {
  id: string;
  memberName: string;
  memberNik: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "defaulted";
  monthlyPayment: number;
  totalPayment: number;
  purpose: string;
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "active" | "completed" | "defaulted">("all");
  const [sort, setSort] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");

  useEffect(() => {
    // Simulate fetching loans data
    const fetchLoans = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample data
      const sampleLoans: Loan[] = [
        {
          id: "1",
          memberName: "Budi Santoso",
          memberNik: "3201011203900001",
          amount: 50000000,
          interestRate: 12,
          term: 24,
          startDate: "2024-01-15",
          endDate: "2026-01-15",
          status: "active",
          monthlyPayment: 23537,
          totalPayment: 564888,
          purpose: "Modal Usaha Kopi"
        },
        {
          id: "2",
          memberName: "Siti Rahayu",
          memberNik: "3201014506910002",
          amount: 75000000,
          interestRate: 10,
          term: 36,
          startDate: "2023-08-01",
          endDate: "2026-08-01",
          status: "completed",
          monthlyPayment: 24156,
          totalPayment: 869616,
          purpose: "Pembayaran Sekolah Anak"
        },
        {
          id: "3",
          memberName: "Ahmad Fauzi",
          memberNik: "3201017809920003",
          amount: 30000000,
          interestRate: 15,
          term: 12,
          startDate: "2024-03-10",
          endDate: "2025-03-10",
          status: "pending",
          monthlyPayment: 27083,
          totalPayment: 325000,
          purpose: "Pemebelihan Rumah"
        },
        {
          id: "4",
          memberName: "Dewi Lestari",
          memberNik: "3201012212930004",
          amount: 100000000,
          interestRate: 8,
          term: 60,
          startDate: "2022-05-20",
          endDate: "2027-05-20",
          status: "active",
          monthlyPayment: 20276,
          totalPayment: 1216560,
          purpose: "Expansi Usaha Kuliner"
        }
      ];
      
      setLoans(sampleLoans);
      setLoading(false);
    };

    fetchLoans();
  }, []);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.memberName.toLowerCase().includes(search.toLowerCase()) ||
                         loan.memberNik.includes(search) ||
                         loan.purpose.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "all" || loan.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (sort === "date-desc") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    if (sort === "date-asc") {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    if (sort === "amount-desc") {
      return b.amount - a.amount;
    }
    if (sort === "amount-asc") {
      return a.amount - b.amount;
    }
    return 0;
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status: Loan["status"]): string => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "active": return "bg-indigo-100 text-indigo-800";
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "rejected": return "bg-rose-100 text-rose-800";
      case "defaulted": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Loan["status"]): string => {
    switch (status) {
      case "pending": return "Menunggu Persetujuan";
      case "approved": return "Disetujui";
      case "active": return "Aktif";
      case "completed": return "Lunas";
      case "rejected": return "Ditolak";
      case "defaulted": return "Macet";
      default: return status;
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
            Manajemen Pinjaman
          </h1>
          <div className="flex items-center space-x-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="date-desc">Tanggal Baru ke Lama</option>
              <option value="date-asc">Tanggal Lama ke Baru</option>
              <option value="amount-desc">Jumlah Besar ke Kecil</option>
              <option value="amount-asc">Jumlah Kecil ke Besar</option>
            </select>
            <Link 
              href="/loans/add" 
              className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <span className="text-lg">+</span>
              Ajukan Pinjaman Baru
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
                  placeholder="Cari nama anggota, NIK, atau tujuan pinjaman..."
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
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu Persetujuan</option>
                  <option value="approved">Disetujui</option>
                  <option value="active">Aktif</option>
                  <option value="completed">Lunas</option>
                  <option value="defaulted">Macet</option>
                </select>
              </div>
            </div>
          </div>
          
          {loans.length === 0 && filteredLoans.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Belum ada data pinjaman</p>
              <Link 
                href="/loans/add" 
                className="mt-4 inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ajukan Pinjaman Pertama
              </Link>
            </div>
          )}
          
          {!loading && filteredLoans.length > 0 && (
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
                      Jumlah Pinjaman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suku Bunga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jangka Waktu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cicilan/Bulan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tujuan
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
                  {sortedLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {loan.memberName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.memberNik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.term} Bulan
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(loan.monthlyPayment)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {loan.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(loan.status)}`}>
                          {getStatusLabel(loan.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link 
                          href={`/loans/${loan.id}/detail`} 
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Detail
                        </Link>
                        {loan.status === "pending" && (
                          <>
                            <Link 
                              href={`/loans/${loan.id}/approve`} 
                              className="text-emerald-600 hover:text-emerald-500 mr-2"
                            >
                              Setujui
                            </Link>
                            <Link 
                              href={`/loans/${loan.id}/reject`} 
                              className="text-rose-600 hover:text-rose-500"
                            >
                              Tolak
                            </Link>
                          </>
                        )}
                        {loan.status === "active" && (
                          <Link 
                            href={`/loans/${loan.id}/payment`} 
                            className="text-blue-600 hover:text-blue-500"
                          >
                            Bayar Cicilan
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
              Menampilkan {filteredLoans.length} dari {loans.length} pinjaman
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                Statistik Pinjaman
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">
                    Total Pinjaman Aktif
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      loans
                        .filter(l => l.status === "active" || l.status === "approved")
                        .reduce((sum, loan) => sum + loan.amount, 0)
                    )}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-emerald-800 mb-2">
                    Pinjaman Lunas Bulan Ini
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {loans.filter(l => l.status === "completed").length} Pinjaman
                  </p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-rose-800 mb-2">
                    Pinjaman Macet
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {loans.filter(l => l.status === "defaulted").length} Pinjaman
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">
                    Menunggu Persetujuan
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {loans.filter(l => l.status === "pending").length} Pinjaman
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