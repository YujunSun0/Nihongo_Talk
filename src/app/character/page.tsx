"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function CharacterPage() {
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((v, k) => (obj[k] = v));
    return obj;
  }, [searchParams]);
  const router = useRouter();

  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("characters").select("*");
      if (error) setError(error.message);
      else setCharacters(data || []);
      setLoading(false);
    })();
  }, []);

  function getRecommendedCharacter(params: Record<string, string>) {
    const found = characters.find(
      (c) => c.gender === params.gender && c.age === params.age && c.style === params.style
    );
    return (
      found || characters[0] || {
        name: "유이",
        desc: "대학생, 활발하고 상냥한 성격",
        gender: params.gender,
        age: params.age,
        style: params.style,
        mbti: "ENFJ",
        emoji: "🌸",
        image: "yui.png",
      }
    );
  }

  if (loading) return <main className="flex items-center justify-center min-h-screen">로딩 중...</main>;
  if (error) return <main className="flex items-center justify-center min-h-screen text-red-500">{error}</main>;

  const character = getRecommendedCharacter(params);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="bg-white rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center mb-10 border-2 border-blue-200 relative"
        >
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg select-none">
            {character.emoji}
          </div>
          <div className="w-36 h-36 rounded-full flex items-center justify-center mb-4 bg-gradient-to-tr from-pink-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500 p-1 shadow-lg">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={`/character/${character.image}`}
                alt={character.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
          <div className="text-3xl font-extrabold mb-2 text-blue-700 mt-2">{character.name}</div>
          <div className="text-lg text-gray-900 mb-4 text-center">{character.desc}</div>
          <div className="flex gap-3 text-base text-gray-700 mb-2">
            <span>성별: {character.gender}</span>
            <span>연령대: {character.age}</span>
            <span>말투: {character.style}</span>
          </div>
          <div className="text-sm text-blue-500 font-bold mb-2">MBTI: {character.mbti}</div>
        </motion.div>
        <button
          className="w-full py-4 text-lg font-semibold rounded-xl border border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-700 transition mb-4 shadow"
          onClick={() => router.push("/chat")}
        >
          이 캐릭터로 대화 시작하기
        </button>
        <button
          className="w-full py-3 text-base rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 transition shadow"
          onClick={() => router.push("/survey")}
        >
          다시 설문하기
        </button>
      </div>
    </main>
  );
} 