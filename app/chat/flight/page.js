'use client'
import InfiniteScroll from "@/components/InfiniteScroll";
import Navbar from "@/components/Navbar"
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "👋 Hi! I’m your Flight Coupon Assistant. I can help you find the best flight offers, discounts, and deals. Ask me anything about flight coupons!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "human", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true)

    try {
      const res = await fetch("http://13.235.99.198/chat", {
      // const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          chat_history: newMessages,
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "system", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false)
    }
  }


  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="flex flex-col h-[calc(100vh-64px)] mx-1.5">
      <div className="flex-grow overflow-y-auto">
        <Navbar />
        <InfiniteScroll/>
        <div className="flex flex-col mx-auto p-4">
          {/* Messages */}
          <div className="flex-1 space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow-md max-w-full ${msg.role === "human"
                    ? "bg-[#44403C] text-white rounded-br-none"
                    : "bg-white text-black rounded-bl-none md: w-[70%]"
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loader while waiting for AI response */}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-white text-black animate-pulse">
                  ✈️ Finding the best flight offers...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 py-3">
        <input className="bg-white p-3 rounded-full w-full placeholder:text-black/70 placeholder:font-bold focus: outline-none" placeholder="Ask me anything!" type="text"
          value={input}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)} />
        <button className="bg-[#4C8829] rounded-full p-3" onClick={sendMessage}>
          <Image src='/icons/submit.svg' width={30} height={30} alt="submit" />
        </button>
      </div>
    </main>
  );
}
