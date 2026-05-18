"use client";

import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed left-4 top-4 z-50 p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        ☰
      </button>

      {/* Sidebar Backdrop (Mobile) */}
      {isOpen && typeof window !== 'undefined' && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        className={`w-64 bg-gray-800 text-white min-h-screen p-4 ${isOpen ? 'block' : 'hidden'} lg:block z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold">KSP Mulia</span>
          {!isOpen && (
            <button 
              onClick={() => setIsOpen(true)}
              className="text-white hover:text-gray-300"
            >
              ✕
            </button>
          )}
        </div>
        <nav className="space-y-2">
          <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">🏠</span>
            <span>Beranda</span>
          </Link>
          <Link href="/dashboard" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/transactions" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">💳</span>
            <span>Transaksi</span>
          </Link>
          <Link href="/savings" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">💰</span>
            <span>Simpanan</span>
          </Link>
          <Link href="/loans" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">🏦</span>
            <span>Pinjaman</span>
          </Link>
          <Link href="/members" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">👥</span>
            <span>Anggota</span>
          </Link>
          <Link href="/reports" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">📈</span>
            <span>Laporan</span>
          </Link>
          <Link href="/auth" className="flex items-center px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
            <span className="mr-3">🔐</span>
            <span>Otentikasi</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}