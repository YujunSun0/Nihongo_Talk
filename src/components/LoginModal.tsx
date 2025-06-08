import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type EmailMode = "login" | "signup" | "reset";

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [emailMode, setEmailMode] = useState<false | EmailMode>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  if (!open) return null;

  // 소셜 로그인 연동 함수(실제 구현은 추후)
  const onKakaoLogin = () => {
    // TODO: Supabase 카카오 로그인 연동
    alert("카카오 로그인 연동 예정");
  };
  const onGoogleLogin = () => {
    // TODO: Supabase 구글 로그인 연동
    alert("구글 로그인 연동 예정");
  };

  // 이메일 로그인
  const handleLogin = async () => {
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setMessage("로그인 성공! 잠시 후 이동합니다.");
    setLoading(false);
  };
  // 이메일 회원가입
  const handleSignup = async () => {
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage("인증 메일이 발송되었습니다. 메일을 확인해 주세요.");
    setLoading(false);
  };
  // 비밀번호 재설정
  const handleReset = async () => {
    setLoading(true); setError(""); setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage("비밀번호 재설정 메일이 발송되었습니다.");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 전체 배경: 블러 효과만 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg -z-10" />
      {/* 카드 - 배경 이미지로 꽉 차게 */}
      <div className="relative w-full max-w-lg mx-auto rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-end min-h-[540px]" style={{aspectRatio:'4/5'}}>
        <Image src="/login/login_background.webp" alt="카드배경" fill className="object-cover absolute inset-0 -z-10" />
        <button className="absolute top-4 right-4 text-2xl text-white/80 hover:text-white transition z-10" onClick={onClose}>×</button>
        <div className="flex flex-col justify-end h-full w-full p-8 pb-7">
          {!emailMode ? (
            <>
              <div className="mb-8">
                <div className="text-2xl font-bold text-white mb-2 drop-shadow-lg">NihongoTalk</div>
                <div className="text-lg text-white font-semibold drop-shadow-lg">5초만에 로그인 후 AI 캐릭터와 대화를 시작해보세요.</div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#FEE500] text-black font-bold text-base hover:bg-yellow-300 transition shadow" onClick={onKakaoLogin}>
                  <Image src="/login/kakao.png" alt="카카오" width={24} height={24} />
                  카카오로 시작하기
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded bg-black/60 text-white font-bold text-base hover:bg-black/80 transition shadow" onClick={onGoogleLogin}>
                  <Image src="/login/google.png" alt="구글" width={24} height={24} />
                  Google로 시작하기
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded bg-white/90 text-black font-bold text-base hover:bg-white transition shadow" onClick={() => setEmailMode("login")}>
                  <Image src="/login/email.png" alt="이메일" width={24} height={24} />
                  이메일로 시작하기
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <div className="w-full max-w-xs mx-auto flex flex-col gap-4">
                <div className="text-xl text-white font-bold mb-2 text-center">
                  {emailMode === "login" && "이메일 로그인"}
                  {emailMode === "signup" && "회원가입"}
                  {emailMode === "reset" && "비밀번호 재설정"}
                </div>
                <input
                  type="email"
                  className="w-full rounded-lg px-4 py-3 bg-white/90 text-black placeholder:text-gray-400 outline-none border border-gray-200 focus:border-yellow-400 transition"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
                {emailMode !== "reset" && (
                  <input
                    type="password"
                    className="w-full rounded-lg px-4 py-3 bg-white/90 text-black placeholder:text-gray-400 outline-none border border-gray-200 focus:border-yellow-400 transition"
                    placeholder="비밀번호"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                  />
                )}
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                {message && <div className="text-green-300 text-sm text-center">{message}</div>}
                <div className="flex flex-col gap-2 mt-2">
                  {emailMode === "login" && (
                    <>
                      <button className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition" onClick={handleLogin} disabled={loading}>로그인</button>
                      <button className="w-full py-3 rounded-lg bg-neutral-800/80 text-white font-bold hover:bg-neutral-700 transition" onClick={() => { router.push("/signup"); onClose(); }} disabled={loading}>회원가입</button>
                      <button className="w-full py-2 text-xs text-gray-300 hover:underline" onClick={() => setEmailMode("reset")} disabled={loading}>비밀번호를 잊으셨나요?</button>
                    </>
                  )}
                  {emailMode === "signup" && (
                    <>
                      <button className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition" onClick={handleSignup} disabled={loading}>회원가입</button>
                      <button className="w-full py-3 rounded-lg bg-neutral-800/80 text-white font-bold hover:bg-neutral-700 transition" onClick={() => setEmailMode("login")} disabled={loading}>로그인으로 돌아가기</button>
                    </>
                  )}
                  {emailMode === "reset" && (
                    <>
                      <button className="w-full py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition" onClick={handleReset} disabled={loading}>비밀번호 재설정 메일 발송</button>
                      <button className="w-full py-3 rounded-lg bg-neutral-800/80 text-white font-bold hover:bg-neutral-700 transition" onClick={() => setEmailMode("login")} disabled={loading}>로그인으로 돌아가기</button>
                    </>
                  )}
                  <button className="w-full py-2 text-xs text-gray-300 hover:underline mt-2" onClick={() => setEmailMode(false)} disabled={loading}>뒤로가기</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 