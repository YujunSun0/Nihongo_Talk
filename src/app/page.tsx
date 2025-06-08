"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "AI 일본어 회화 파트너",
    desc: "실제 일본인처럼 자연스러운 대화, 맞춤형 캐릭터와 실전 연습",
  },
  {
    title: "음성 입력/출력 지원",
    desc: "마이크로 말하고, AI가 일본어로 답변을 들려줍니다.",
  },
  {
    title: "상황별 시나리오",
    desc: "카페 주문, 공항 체크인 등 다양한 실전 상황 제공",
  },
  {
    title: "즉각적 피드백",
    desc: "내 일본어 표현에 대한 AI 피드백과 추천 표현 제공",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // SplitType으로 타이틀, 슬로건을 단어별로 분리
    if (titleRef.current) {
      const splitTitle = new SplitType(titleRef.current, {
        types: "words",
        tagName: "span",
      });
      gsap.from(splitTitle.words, {
        y: "100%",
        opacity: 0,
        duration: 0.5,
        ease: "circ.out",
        stagger: 0.08,
        delay: 0.1,
      });
    }
    if (descRef.current) {
      const splitDesc = new SplitType(descRef.current, {
        types: "words",
        tagName: "span",
      });
      gsap.from(splitDesc.words, {
        y: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "circ.out",
        stagger: 0.06,
        delay: 0.5,
      });
    }
    // 버튼은 기존처럼 페이드업
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 1.1 }
      );
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen w-full">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="flex flex-col items-center justify-center min-h-[60vh] py-24 px-4 text-center"
      >
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight split-hero-title"
        >
          NihongoTalk
        </h1>
        <p
          ref={descRef}
          className="text-lg sm:text-2xl text-gray-900 mb-8 max-w-xl split-hero-desc"
        >
          AI 일본어 회화 파트너와 실전처럼 대화하며<br />
          나만의 캐릭터와 함께 자연스럽게 일본어를 연습하세요!
        </p>
        <Link
          ref={btnRef}
          href="/survey"
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition inline-block"
        >
          지금 시작하기
        </Link>
      </section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto py-20 px-4 grid grid-cols-1 sm:grid-cols-2 gap-10"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow p-8 flex flex-col items-center text-center border border-blue-100"
          >
            <div className="text-xl font-bold mb-2 text-blue-700">{f.title}</div>
            <div className="text-gray-900 text-base">{f.desc}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto py-20 px-4 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">서비스 소개</h2>
        <p className="text-gray-700 text-lg mb-4">
          NihongoTalk은 일본어 학습자를 위한 AI 기반 회화 연습 플랫폼입니다.<br />
          설문을 통해 나만의 AI 캐릭터를 추천받고, 다양한 상황에서 음성으로 대화하며 실전 감각을 키울 수 있습니다.
        </p>
        <p className="text-gray-900 text-base">
          Web Speech API, GPT-4, TTS 등 최신 기술을 활용하여<br />
          실제 일본인과 대화하는 듯한 몰입감을 제공합니다.
        </p>
      </motion.section>

      {/* Tech/Partner Section (예시) */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto py-16 px-4 text-center"
      >
        <h3 className="text-xl font-bold mb-6">사용 기술</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-900 font-medium">Next.js</span>
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-900 font-medium">TypeScript</span>
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-900 font-medium">TailwindCSS</span>
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-900 font-medium">Zustand</span>
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-900 font-medium">OpenAI GPT-4</span>
          <span className="bg-gray-100 px-4 py-2 rounded-full text-gray-900 font-medium">Web Speech API</span>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 text-center bg-gradient-to-r from-blue-100 to-blue-200"
      >
        <h2 className="text-2xl font-bold mb-16 text-gray-900">지금 바로 AI 일본어 회화 연습을 시작해보세요!</h2>
        <Link
          href="/survey"
          className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition"
        >
          무료로 시작하기
        </Link>
      </motion.section>
    </div>
  );
}
