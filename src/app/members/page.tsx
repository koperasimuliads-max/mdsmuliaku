import Link from "next/link";
import { useState, useEffect } from "react";

interface Member {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noTelepon: string;
  tanggalBergabung: string;
  status: "aktif" | "nonaktif";
  jenisKelamin: "laki-laki" | "perempuan";
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "aktif" | "nonaktif">("all");

  useEffect(() => {
    // Simulate fetching members data
    const fetchMembers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Sample data
      const sampleMembers: Member[] = [
        {
          id: "1",
          nama: "Budi Santoso",
          nik: "3201011203900001",
          alamat: "Jl. Merdeka No. 12, RT 01/02, Kecamatan Cipedes",
          noTelepon: "081234567890",
          tanggalBergabung: "2023-05-15",
          status: "aktif",
          jenisKelamin: "laki-laki"
        },
        {
          id: "2",
          nama: "Siti Rahayu",
          nik: "3201014506910002",
          alamat: "Jl. Pahlawan No. 45, RT 03/04, Kecamatan Cipedes",
          noTelepon: "081234567891",
          tanggalBergabung: "2023-07-22",
          status: "aktif",
          jenisKelamin: "perempuan"
        },
        {
          id: "3",
          nama: "Ahmad Fauzi",
          nik: "3201017809920003",
          alamat: "Jl. Veteran No. 78, RT 05/06, Kecamatan Cipedes",
          noTelepon: "081234567892",
          tanggalBergabung: "2024-01-10",
          status: "nonaktif",
          jenisKelamin: "laki-laki"
        },
        {
          id: "4",
          nama: "Dewi Lestari",
          nik: "3201012212930004",
          alamat: "Jl. Sudirman No. 22, RT 07/08, Kecamatan Cipedes",
          noTelepon: "081234567893",
          tanggalBergabung: "2024-03-05",
          status: "aktif",
          jenisKelamin: "perempuan"
        }
      ];
      
      setMembers(sampleMembers);
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.nama.toLowerCase().includes(search.toLowerCase()) ||
                         member.nik.includes(search) ||
                         member.noTelepon.includes(search);
    
    const matchesFilter = filter === "all" || member.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      // Simulate delete API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setMembers(prev => prev.filter(member => member.id !== id));
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
            Manajemen Anggota
          </h1>
          <Link 
            href="/members/add" 
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <span className="text-lg">+</span>
            Tambah Anggota Baru
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, NIK, atau no. telepon..."
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
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>
          
          {members.length === 0 && filteredMembers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">Belum ada data anggota</p>
              <Link 
                href="/members/add" 
                className="mt-4 inline-block px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Tambah Anggota Pertama
              </Link>
            </div>
          )}
          
          {!loading && filteredMembers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kelamin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. Telepon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Bergabung
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {member.jenisKelamin === "laki-laki" ? "👨" : "👩"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.nama}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.nama}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.nik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {member.jenisKelamin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.noTelepon}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === "aktif"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {member.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.tanggalBergabung).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <Link 
                          href={`/members/${member.id}/edit`} 
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(member.id)}
                          className="text-rose-600 hover:text-rose-500"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Menampilkan {filteredMembers.length} dari {members.length} anggota
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}