import { useState } from "react";
import Image from "next/image";
import { FiMic, FiX } from "react-icons/fi";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceChatLayoutProps {
  onVoiceInput: (text: string) => void;
  loading: boolean;
  onCancel: () => void;
  characterImage: string;
  statusText?: string;
}

export default function VoiceChatLayout({ onVoiceInput, loading, onCancel, characterImage, statusText }: VoiceChatLayoutProps) {
  const { listening, start, stop } = useSpeechRecognition((text) => {
    onVoiceInput(text);
    stop();
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-neutral-900">
      {/* 중앙 원 + 이미지 + 애니메이션 */}
      <div className="relative flex items-center justify-center mb-12">
        {/* 물결 애니메이션 */}
        {listening && (
          <span className="absolute w-72 h-72 rounded-full border-8 border-blue-300 animate-wave z-0" style={{filter:'blur(2px)'}}></span>
        )}
        <div className="w-56 h-56 rounded-full flex items-center justify-center bg-white overflow-hidden z-10 shadow-xl">
          <Image src={characterImage} alt="캐릭터" width={220} height={220} className="rounded-full object-cover" />
        </div>
      </div>
      {/* 상태 텍스트 */}
      <div className="mb-8 text-blue-200 text-sm flex items-center gap-1">
        {statusText ? statusText : (listening ? "음성 인식 중..." : "마이크를 눌러 시작")}
      </div>
      {/* 하단 버튼 */}
      <div className="flex gap-8">
        <button
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-3xl text-white hover:bg-blue-600 transition"
          onClick={listening ? stop : start}
          aria-label="음성 입력"
        >
          <FiMic />
        </button>
        <button
          className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-3xl text-white hover:bg-red-600 transition"
          onClick={onCancel}
          aria-label="취소"
        >
          <FiX />
        </button>
      </div>
      {/* 커스텀 wave 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0.2; }
        }
        .animate-wave {
          animation: wave 1.6s infinite cubic-bezier(0.4,0.2,0.6,0.8);
        }
      `}</style>
    </div>
  );
} 