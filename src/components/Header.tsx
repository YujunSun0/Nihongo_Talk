"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBell, FiUser } from "react-icons/fi";
import LoginModal from "@/components/LoginModal";

export default function Header() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  // TODO: 실제 로그인 상태는 추후 Supabase Auth 연동
  const isLoggedIn = false;

  const handleProfileClick = () => {
    if (isLoggedIn) {
      window.location.href = "/settings";
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <header className="w-full h-14 flex items-center px-8 bg-[#23262b] border-b border-[#35373b] z-50">
      {/* 로고 */}
      <Link href="/" className="text-2xl font-bold text-yellow-400 tracking-wide mr-8 select-none" style={{fontFamily:'serif'}}>NihongoTalk</Link>
      {/* 우측 아이콘 */}
      <div className="ml-auto flex items-center gap-6">
        {/* 알림 */}
        <button className="relative text-2xl text-white hover:text-yellow-400 transition">
          <FiBell />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#23262b]" />
        </button>
        {/* 프로필 */}
        <button className="text-2xl text-white hover:text-yellow-400 transition" onClick={handleProfileClick}>
          <FiUser />
        </button>
      </div>
      {/* 로그인 모달 */}
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
} 