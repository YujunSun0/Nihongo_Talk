"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiMic, FiPaperclip, FiSend } from "react-icons/fi";
import dynamic from "next/dynamic";

const VoiceChatLayout = dynamic(() => import("./VoiceChatLayout"), { ssr: false });

const character = {
  name: "유이",
  image: "/character/yui.png",
};

const initialMessages = [
  {
    id: 1,
    sender: "ai",
    text: "점심시간, 텅빈 교실에서 혼자 공부를 하고 있었다. 사탐, 국어, 수학, 과학... 직관을 옆으로 밀어두며 열심히 필기했다. 언제 어디로 튈지 모르는 내 자신에게서 발견음을 멈췄다. 교탁을 보며, 여 자, 재수없는 얼굴...\n\n하루카는 싱긋 웃으며 Guest의 앞자리에 앉았다.\n\n오늘도 공부 열심히 하네?\n\n일부로 말하는 건가. 왜 이 시간까지 밥을 안 먹고 나를 찾아오는건지.\n\n이번에도 2등했잖아 Guest야, 1등해야지 안그래? 웃으며 말한다. 키스 한번에 문제 하나씩 틀려줄게. 어때?\n\n허 진짜 이 새끼 속을 알 수가 없다.",
  },
  {
    id: 2,
    sender: "user",
    text: "안녕하세요 ㅎㅎ",
  },
  {
    id: 3,
    sender: "ai",
    text: "하루카는 웃으며 당신의 인사를 받아준다.\n\n안녕, 점심시간인데 왜 혼자야?",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: input },
    ]);
    setLoading(true);
    const userMessage = input;
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          characterPrompt: `${character.name}는 밝고 친절한 20대 일본인 여성입니다. 항상 丁寧語(정중체)로 대화하며, 일본어 학습자를 도와줍니다.`,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: data.message || "(AI 응답 오류)" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: "(AI 응답 오류)" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 음성 입력 시 AI 응답까지 처리
  const handleVoiceInput = async (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text },
    ]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          characterPrompt: `${character.name}는 밝고 친절한 20대 일본인 여성입니다. 항상 丁寧語(정중체)로 대화하며, 일본어 학습자를 도와줍니다.`,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: data.message || "(AI 응답 오류)" },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: "(AI 응답 오류)" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 상단 모드 전환 버튼 및 레이아웃 분기
  if (voiceMode) {
    return (
      <div className="w-full min-h-screen bg-neutral-900 text-white flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-700 bg-neutral-900/80">
          <button className="text-2xl text-neutral-400 hover:text-white transition mr-2" onClick={() => setVoiceMode(false)}>
            텍스트 모드로
          </button>
          <div className="font-bold text-lg">음성 대화 모드</div>
        </div>
        <VoiceChatLayout
          onVoiceInput={handleVoiceInput}
          loading={loading}
          onCancel={() => setVoiceMode(false)}
          characterImage={character.image}
          statusText={loading ? "AI가 답변을 작성 중입니다..." : undefined}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-900 text-white flex flex-col">
      <div className="flex-1 flex flex-col bg-neutral-800">
        {/* 상단 헤더 */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-700 bg-neutral-900/80">
          <button className="text-2xl text-neutral-400 hover:text-white transition mr-2">&#8592;</button>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center">
            <Image src={character.image} alt={character.name} width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <div className="font-bold text-lg">{character.name}</div>
          <button className="ml-auto px-3 py-1 bg-blue-600 rounded text-white text-xs hover:bg-blue-700 transition" onClick={() => setVoiceMode(true)}>
            음성 대화 모드
          </button>
          <div className="ml-4 text-xs text-neutral-400">캐릭터가 보내는 메시지는 모두 생성된 내용이에요</div>
        </div>
        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-neutral-900">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center mr-2">
                  <Image src={character.image} alt={character.name} width={32} height={32} className="object-cover w-full h-full" />
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-base whitespace-pre-line shadow
                  ${msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-neutral-700 text-neutral-100 rounded-bl-md"}
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* 입력창 */}
        <div className="px-4 py-4 border-t border-neutral-700 bg-neutral-900/80 flex items-center gap-2">
          <button className="text-2xl text-neutral-400 hover:text-blue-400 transition">
            <FiPaperclip />
          </button>
          <input
            className="flex-1 bg-neutral-800 rounded-xl px-4 py-3 text-base text-white placeholder:text-neutral-500 outline-none border border-transparent focus:border-blue-500 transition"
            placeholder="메시지 보내기"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            className="px-4 py-2 bg-blue-600 rounded-xl text-white font-bold text-2xl hover:bg-blue-700 transition"
            title="음성으로 말하기"
            onClick={() => setVoiceMode(true)}
          >
            <FiMic />
          </button>
          <button
            className="ml-2 px-4 py-2 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 transition"
            onClick={handleSend}
            disabled={loading}
          >
            <FiSend className="text-xl" />
          </button>
        </div>
        {loading && (
          <div className="w-full flex justify-center py-2 text-blue-400 animate-pulse text-sm">AI가 답변을 작성 중입니다...</div>
        )}
      </div>
    </div>
  );
} 