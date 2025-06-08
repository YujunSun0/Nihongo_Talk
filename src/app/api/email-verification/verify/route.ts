import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ ok: false, error: "이메일/코드 필요" }, { status: 400 });

  // DB에서 인증번호 확인
  const { data, error } = await supabase
    .from("email_verifications")
    .select("id, expires_at, verified")
    .eq("email", email)
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return NextResponse.json({ ok: false, error: "인증번호가 올바르지 않거나 만료되었습니다." }, { status: 400 });
  if (data.verified) return NextResponse.json({ ok: false, error: "이미 인증된 코드입니다." }, { status: 400 });
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ ok: false, error: "인증번호가 만료되었습니다." }, { status: 400 });

  // 인증 성공 처리
  await supabase.from("email_verifications").update({ verified: true }).eq("id", data.id);

  return NextResponse.json({ ok: true });
} 