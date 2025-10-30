"use client";
import Image from "next/image";

export default function Header({ onClearChat }) {
  return (
    <div className="flex justify-between items-center p-4 bg-[#F7F1ED]">
      {/* --- Left Section --- */}
      <div className="flex gap-3.5 items-center text-2xl font-semibold">
        <Image src="/icons/menu.svg" width={25} height={25} alt="menu" />
        <div>Smartbhai</div>
      </div>

      {/* --- Right Section: Clear Chat Button --- */}
      <button
        onClick={onClearChat}
        className="text-sm bg-[#0f4ed8] text-white px-3 py-1.5 rounded-full hover:bg-green-700 transition"
      >
        Clear Chat
      </button>
    </div>
  );
}
