import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function VoiceRecorder({ onText }: { onText: (text: string) => void }) {
  const { listening, start, stop } = useSpeechRecognition(onText);

  return (
    <div className="flex flex-col items-center">
      <button
        onMouseDown={start}
        onMouseUp={stop}
        className="relative w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center focus:outline-none"
        aria-label="음성 입력"
      >
        {/* 원 애니메이션 */}
        <span className={`absolute w-full h-full rounded-full border-4 border-blue-300 transition-opacity duration-300 ${listening ? "animate-pulse opacity-100" : "opacity-0"}`}></span>
        <svg width="40" height="40" fill="white"><circle cx="20" cy="20" r="16" /></svg>
      </button>
      {listening && <div className="mt-2 text-blue-500">음성 인식 중...</div>}
    </div>
  );
} 