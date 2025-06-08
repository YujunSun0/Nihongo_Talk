type Props = { messages: string[] };

export default function ChatHistory({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
      {messages.map((msg, idx) => (
        <div key={idx} className="mb-2 p-3 rounded-lg bg-white dark:bg-gray-800 shadow">
          {msg}
        </div>
      ))}
    </div>
  );
} 