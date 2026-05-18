import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-500 mb-6"></div>
        <h2 className="text-2xl font-bold text-indigo-800 mb-2">
          KSP Mulia Dana Sejahtera
        </h2>
        <p className="text-lg text-gray-600">
          Sedang memuat aplikasi...
        </p>
      </div>
    </div>
  );
}
