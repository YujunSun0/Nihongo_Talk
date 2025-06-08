"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 1단계: 이메일 인증번호 발송
  const handleSendEmail = async () => {
    setLoading(true); setError(""); setMessage("");
    const res = await postJson("/api/email-verification/send", { email });
    if (!res.ok) setError(res.error || "인증번호 발송 실패");
    else {
      setMessage("인증번호가 이메일로 발송되었습니다.");
      setStep(2);
    }
    setLoading(false);
  };
  // 2단계: 인증번호 검증
  const handleVerifyCode = async () => {
    setLoading(true); setError(""); setMessage("");
    const res = await postJson("/api/email-verification/verify", { email, code });
    if (!res.ok) setError(res.error || "인증 실패");
    else {
      setMessage("이메일 인증 성공!");
      setStep(3);
    }
    setLoading(false);
  };
  // 3단계: 비밀번호 입력(조건 체크)
  const handlePasswordNext = () => {
    setError("");
    if (password.length < 8) setError("비밀번호는 8자 이상이어야 합니다.");
    else setStep(4);
  };
  // 4단계: 이름/닉네임 입력 및 회원가입
  const handleSignup = async () => {
    setLoading(true); setError(""); setMessage("");
    // Supabase 회원가입
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // 프로필 저장
    await supabase.from("profiles").upsert({
      id: data.user?.id,
      email,
      name,
      nickname,
    });
    setMessage("회원가입이 완료되었습니다! 메일 인증 후 로그인해 주세요.");
    setLoading(false);
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-[#23262b] flex flex-col">
      <header className="h-16 flex items-center px-8 border-b border-[#35373b]">
        <button className="text-xl text-white mr-4" onClick={() => setStep(step === 1 ? 1 : step - 1)}>←</button>
        <span className="text-white font-bold text-lg">회원가입</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-start pt-24">
        <div className="w-full max-w-lg px-8">
          {step === 1 && (
            <>
              <div className="text-2xl font-bold text-white mb-2">정말 반가워요!</div>
              <div className="text-lg text-white mb-8">이메일 주소를 입력해주세요</div>
              <div className="mb-6">
                <label className="block text-yellow-400 font-bold mb-1">이메일</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b-2 border-yellow-400 text-white px-2 py-3 text-lg focus:outline-none placeholder:text-gray-400"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
              {message && <div className="text-green-300 text-sm mb-2">{message}</div>}
              <button
                className="px-6 py-2 rounded bg-neutral-700 text-white font-bold hover:bg-yellow-400 hover:text-black transition float-right"
                onClick={handleSendEmail}
                disabled={loading || !email}
              >
                인증 메일 발송
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="text-2xl font-bold text-white mb-2">이메일로 전송된 인증번호를 입력해주세요</div>
              <div className="mb-6">
                <label className="block text-yellow-400 font-bold mb-1">인증번호</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b-2 border-yellow-400 text-white px-2 py-3 text-lg focus:outline-none placeholder:text-gray-400"
                  placeholder="6자리 숫자"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
              {message && <div className="text-green-300 text-sm mb-2">{message}</div>}
              <button
                className="px-6 py-2 rounded bg-neutral-700 text-white font-bold hover:bg-yellow-400 hover:text-black transition float-right"
                onClick={handleVerifyCode}
                disabled={loading || !code}
              >
                인증번호 확인
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <div className="text-2xl font-bold text-white mb-2">비밀번호를 입력해주세요</div>
              <div className="mb-6">
                <label className="block text-yellow-400 font-bold mb-1">비밀번호</label>
                <input
                  type="password"
                  className="w-full bg-transparent border-b-2 border-yellow-400 text-white px-2 py-3 text-lg focus:outline-none placeholder:text-gray-400"
                  placeholder="영문, 숫자 포함 8자 이상"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
              <button
                className="px-6 py-2 rounded bg-neutral-700 text-white font-bold hover:bg-yellow-400 hover:text-black transition float-right"
                onClick={handlePasswordNext}
                disabled={loading || !password}
              >
                다음
              </button>
            </>
          )}
          {step === 4 && (
            <>
              <div className="text-2xl font-bold text-white mb-2">캐릭터가 당신을 어떻게 부르길 원하나요?</div>
              <div className="mb-6">
                <label className="block text-yellow-400 font-bold mb-1">이름</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b-2 border-yellow-400 text-white px-2 py-3 text-lg focus:outline-none placeholder:text-gray-400"
                  placeholder="이름"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="mb-6">
                <label className="block text-yellow-400 font-bold mb-1">닉네임</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b-2 border-yellow-400 text-white px-2 py-3 text-lg focus:outline-none placeholder:text-gray-400"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
              <button
                className="px-6 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition float-right"
                onClick={handleSignup}
                disabled={loading || !name || !nickname}
              >
                회원가입
              </button>
            </>
          )}
          {step === 5 && (
            <div className="text-2xl font-bold text-green-300 mt-16 text-center">회원가입이 완료되었습니다!<br/>메일 인증 후 로그인해 주세요.</div>
          )}
        </div>
      </main>
    </div>
  );
} 