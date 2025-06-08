import { useState, useRef } from "react";

// 타입 선언 (크롬 전용)
type WebkitSpeechRecognition = typeof window extends { webkitSpeechRecognition: infer T } ? T : never;
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
  // SpeechRecognitionEvent 타입이 없을 경우 직접 정의
  interface SpeechRecognitionEvent extends Event {
    results: {
      [index: number]: {
        0: { transcript: string }
      }
    };
  }
}

export function useSpeechRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const start = () => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, start, stop };
}
