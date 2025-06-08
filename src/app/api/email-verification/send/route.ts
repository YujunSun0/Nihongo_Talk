import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import nodemailer from "nodemailer"; // 실제 발송시 주석 해제

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ ok: false, error: "이메일이 필요합니다." }, { status: 400 });

  // 인증번호 6자리 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 5); // 5분 유효

  // DB 저장
  const { error } = await supabase.from("email_verifications").insert({
    email,
    code,
    expires_at: expires.toISOString(),
  });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  // 이메일 발송 (nodemailer 등 실제 구현 필요)
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({
  //   to: email,
  //   subject: "NihongoTalk 인증번호",
  //   text: `인증번호: ${code}`
  // });
  // 실제 서비스에서는 위 주석 해제 및 환경변수로 SMTP 설정 필요

  // 개발용: 콘솔에 인증번호 출력
  console.log(`[이메일 인증] ${email} → 인증번호: ${code}`);

  return NextResponse.json({ ok: true });
} 