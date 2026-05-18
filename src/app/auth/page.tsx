import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        // Redirect to dashboard after successful login
        router.push("/dashboard");
      } else {
        // For registration, we'll just login since we're using mock data
        await login(email, password);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-indigo-800">
            KSP Mulia Dana Sejahtera
          </h2>
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700">
            ← Kembali ke Beranda
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center text-indigo-800 mb-6">
              {isLogin ? "Masuk ke Akun Anda" : "Buat Akun Baru"}
            </h1>
            
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 mb-6" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all ${
                  loading
                    ? "cursor-not-allowed animate-pulse"
                    : ""
                }`}
              >
                {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
              </button>
              
              <div className="text-center text-sm mt-4">
                {isLogin ? (
                  <>
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Daftar sekarang
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Masuk
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          Dengan mendaftar, Anda menyetujui <a href="#" className="text-indigo-600 hover:text-indigo-500">Syarat & Ketentuan</a> dan{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">Kebijakan Privasi</a>
        </p>
      </div>
    </div>
  );
}