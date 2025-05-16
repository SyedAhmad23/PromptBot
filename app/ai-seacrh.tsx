"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
import Image from "next/image";
export default function AiSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userMessage = searchParams.get("message") || "";
  const [messages, setMessages] = useState<
    { type: "bot" | "user"; text: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userMessage) {
      const fetchResponse = async () => {
        setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
        setLoading(true);

        try {
          const res = await fetch(
            `/api/gemini?message=${encodeURIComponent(userMessage)}`
          );
          const data = await res.text();

          setMessages((prev) => [
            ...prev,
            { type: "bot", text: data || "Sorry, no response generated." },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            { type: "bot", text: "Something went wrong. Please try again." },
          ]);
        } finally {
          setLoading(false);
        }

        router.push("/", { scroll: false });
      };

      fetchResponse();
    }
  }, [userMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClear = () => {
    setMessages([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const url = new URL(window.location.href);
    url.searchParams.set("message", inputValue.trim());
    router.push(url.toString());
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-gray-300 text-white flex justify-center items-start">
      <div className="w-full max-w-screen-md bg-gray-800 flex flex-col overflow-hidden h-[100vh] mx-auto shadow-lg rounded">
        <div className="w-full bg-gray-700 text-white text-xl font-semibold px-6 py-4 flex justify-between items-center">
          <span className="inline-flex items-center gap-2">
            <Image src="/pb.png" alt="PromptBot Logo" width={40} height={40} />
            PromptBot
          </span>

          <button
            onClick={handleClear}
            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-2"
          >
            <FiTrash2 className="text-white" />
            Clear Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-900">
          {messages.length === 0 && !loading ? (
            <p className="text-gray-400 text-center">Ask me anything...</p>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] px-4 py-3 rounded-xl shadow whitespace-pre-wrap ${
                    msg.type === "bot"
                      ? "bg-gray-700 text-white"
                      : "bg-blue-500 text-white ml-auto"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
              {loading && (
                <div className="max-w-[100%] px-4 py-3 rounded-xl shadow bg-gray-600 text-gray-300 ml-auto italic select-none">
                  Loading...
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t bg-gray-700 px-4 py-3 flex items-center gap-3"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            name="message"
            type="text"
            placeholder="Ask something..."
            className="flex-1 px-4 py-2 text-sm bg-gray-600 text-white border border-gray-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition duration-200 text-sm"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
