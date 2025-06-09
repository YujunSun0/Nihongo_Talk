"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const surveyItems = [
  {
    key: "language",
    label: "학습 언어를 선택해 주세요.",
    options: ["일본어", "영어"],
  },
  {
    key: "gender",
    label: "AI 대화상대의 성별은?",
    options: ["남성", "여성", "상관없음"],
  },
  {
    key: "age",
    label: "AI 대화상대의 연령대는?",
    options: ["10대", "20대", "30대", "40대 이상"],
  },
  {
    key: "style",
    label: "어떤 말투 스타일을 원하시나요?",
    options: [
      "부드럽고 어른스러운 말투",
      "활발하고 친근한 말투",
      "쿨하고 직설적인 말투",
      "귀엽고 발랄한 말투",
      "밝고 상냥한 말투",
      "조용하고 신중한 말투",
      "차분하고 논리적인 말투",
      "유머러스하고 자유로운 말투",
      "도도하고 세련된 말투",
      "장난기 많고 명랑한 말투"
    ],
  },
  {
    key: "purpose",
    label: "일본어를 배우는 목적은 무엇인가요?",
    options: ["여행 회화", "JLPT", "비즈니스 회화", "친구 사귀기"],
  },
];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const total = surveyItems.length;
  const current = surveyItems[step];
  const router = useRouter();

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [current.key]: option }));
    if (step < total - 1) {
      setTimeout(() => setStep((s) => s + 1), 250);
    } else {
      // 설문 결과를 쿼리스트링으로 전달하며 캐릭터 추천 화면으로 이동
      const result = { ...answers, [current.key]: option };
      const params = new URLSearchParams(result).toString();
      router.push(`/character?${params}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* 진행도 바 */}
      <div className="w-full max-w-md h-2 bg-gray-100 rounded-full mt-8 mb-10">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>
      {/* 질문 카드 */}
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-white rounded-3xl shadow-2xl px-10 py-14 flex flex-col items-center mb-10 border-2 border-blue-200 relative
                       max-h-[500px] overflow-y-auto"
          >
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 text-center leading-snug">
              {current.label}
            </div>
            <div className="flex flex-col gap-4 w-full">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="w-full py-4 text-lg font-semibold rounded-xl border border-gray-200 bg-gray-50 hover:bg-blue-50 active:bg-blue-100 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                  style={{ minHeight: 56 }}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* 하단 여백 */}
      <div className="h-10" />
    </main>
  );
} 