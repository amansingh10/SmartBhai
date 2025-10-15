'use client'
import ReactMarkdown from "react-markdown";
import InfiniteScroll from "@/components/InfiniteScroll";
import Navbar from "@/components/Navbar"
import FlightCard from "@/components/FlightCard";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import deafault from "../../data/deafult.json";
import { Filter } from "lucide-react";
export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "👋 Hi! I’m your Flight Coupon Assistant. I can help you find the best flight offers, discounts, and deals. Ask me anything about flight coupons!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentFlightData, setCurrentFlightData] = useState(null);
  const [currentBookingOptions, setCurrentBookingOptions] = useState(null);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [selectedRange, setSelectedRange] = useState(null);
const [showFilter, setShowFilter] = useState(false);
const [selectedAirlines, setSelectedAirlines] = useState([]);
const [selectedFlights, setSelectedFlights] = useState([]);


  // Auto-scroll when messages or flights change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentFlightData]);

  useEffect(() => {
    if (currentFlightData && currentFlightData.length > 0) {
      setFilteredFlights(currentFlightData);
    }
  }, [currentFlightData]);

const toggleFlightSelection = (flightName) => {
  setSelectedFlights((prev) =>
    prev.includes(flightName)
      ? prev.filter((f) => f !== flightName)
      : [...prev, flightName]
  );
};

const filterFlights = (range, airlines, flights) => {
  let filtered = currentFlightData;

  // 🕒 Filter by time
  if (range) {
    filtered = filtered.filter((flightGroup) => {
      const depTime = new Date(flightGroup.flight_data[0]?.departure_airport?.time);
      const hours = depTime.getHours();
      switch (range) {
        case "morning": return hours >= 9 && hours < 12;
        case "afternoon": return hours >= 12 && hours < 15;
        case "evening": return hours >= 15 && hours < 18;
        case "night": return hours >= 18 && hours < 21;
        default: return true;
      }
    });
  }

  // Filter by airline
if (airlines.length > 0) {
  filtered = filtered.filter((flightGroup) =>
    airlines.includes(flightGroup.flight_data[0]?.airline)
  );
}

// Filter by flight number
if (flights.length > 0) {
  filtered = filtered.filter((flightGroup) =>
    flights.includes(flightGroup.flight_data[0]?.flight_number)
  );
}


  setFilteredFlights(filtered);
};

const toggleAirlineSelection = (airline) => {
  setSelectedAirlines((prev) =>
    prev.includes(airline)
      ? prev.filter((a) => a !== airline)
      : [...prev, airline]
  );
};


  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "human", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    
    // Reset textarea height
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '48px';
        textarea.style.overflowY = 'hidden';
      }
    }, 0);

    try {
      // const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ chat_history: newMessages }),
      // });
      // const data = await res.json();
      const data = deafault;
      console.log('Backend response:', data);
      
      if (data.flight_data && data.flight_data.length > 0) {
        console.log('Flight data structure:', data.flight_data[0]);
        setCurrentFlightData(data.flight_data);
        setCurrentBookingOptions(data.booking_options);
      } else {
        setCurrentFlightData(null);
        setCurrentBookingOptions(null);
      }
      
      setMessages([...newMessages, { 
        role: "ai", 
        content: data.content,
      }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false)
    }
  }

  function handleTextareaChange(e) {
    setInput(e.target.value);
    const maxHeight = 200;
    e.target.style.height = 'auto';
    
    if (e.target.scrollHeight <= maxHeight) {
      e.target.style.height = e.target.scrollHeight + 'px';
      e.target.style.overflowY = 'hidden';
    } else {
      e.target.style.height = maxHeight + 'px';
      e.target.style.overflowY = 'auto';
    }
  }

  return (
    <main className="flex flex-col h-[calc(100dvh-64px)] mx-1.5">
      <div className="flex-grow overflow-y-auto">
        <Navbar />
        <InfiniteScroll/>
        <div className="flex flex-col mx-auto p-4">
          {/* Messages */}
          <div className="flex-1 space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div
                  className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-md max-w-full break-words ${
                      msg.role === "human"
                        ? "bg-[#44403C] text-white rounded-br-none"
                        : "bg-white text-black rounded-bl-none md:w-[70%]"
                    }`}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Loader */}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-white text-black animate-pulse">
                  ✈️ Finding the best flight offers...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ✅ Flight Section */}
          {currentFlightData && currentFlightData.length > 0 && (
            <div className="w-full max-w-5xl mx-auto px-4 mt-4">

              {/* 🕘 Time Filter Dropdown */}
{/* 🕘 Time & Flight Name Filter Dropdown */}
<div className="relative inline-block mb-5">
  <button
    className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-700"
    onClick={() => setShowFilter((prev) => !prev)}
  >
    <Filter className="w-4 h-4" />
    <span>Filter</span>
  </button>

  {showFilter && (
    <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">🕒 Time Range</h3>
      <div className="flex flex-col text-sm text-gray-700 mb-3">
        {[
          { key: "morning", label: "🌅 Morning (9 AM - 12 PM)" },
          { key: "afternoon", label: "☀️ Afternoon (12 PM - 3 PM)" },
          { key: "evening", label: "🌇 Evening (3 PM - 6 PM)" },
          { key: "night", label: "🌙 Night (6 PM - 9 PM)" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setSelectedRange(item.key)}
            className={`px-3 py-1.5 text-left rounded-md hover:bg-gray-100 ${
              selectedRange === item.key ? "bg-[#4C8829]/10 text-[#4C8829]" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-2">🛫 Flight Name</h3>
<div className="max-h-40 overflow-y-auto text-sm flex flex-col gap-1 mb-3">
  {Array.from(new Set(currentFlightData.map((f) => f.flight_data[0]?.airline))).map((airline, idx) => (
  <label key={`${airline}-${idx}`} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-md cursor-pointer">
    <input
      type="checkbox"
      checked={selectedAirlines.includes(airline)}
      onChange={() => toggleAirlineSelection(airline)}
      className="accent-[#4C8829]"
    />
    {airline}
  </label>
))}


</div>


      <div className="flex justify-between mt-3">
        <button
          onClick={() => {
            setSelectedRange(null);
            setSelectedAirlines([]);
            filterFlights(null, []);
            setShowFilter(false);
          }}
          className="text-blue-600 text-sm hover:underline"
        >
          Clear Filter
        </button>
       <button
  onClick={() => {
    filterFlights(selectedRange, selectedAirlines, selectedFlights);
    setShowFilter(false);
  }}
  className="bg-[#4C8829] text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#3e6f22]"
>
  Apply
</button>

      </div>
    </div>
  )}
</div>


              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Showing {filteredFlights.length} Flights
              </h2>

              {/* ✈️ Flight Cards */}
              {filteredFlights.map((flightGroup, index) => (
                <FlightCard
                  key={index}
                  flightData={flightGroup.flight_data}
                  bookingOptions={flightGroup.booking_options}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Box */}
      <div className="flex gap-2 py-3 items-end">
        <textarea 
          className="bg-white p-3 rounded-3xl w-full placeholder:text-black/70 placeholder:font-bold focus:outline-none resize-none min-h-[48px] scrollbar-hide" 
          placeholder="Ask me anything!"
          rows="1"
          value={input}
          onChange={handleTextareaChange}
           onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();  
              sendMessage();       
            }
          }}
        />
        <button className="bg-[#4C8829] rounded-full p-3 flex-shrink-0" onClick={sendMessage}>
          <Image src='/icons/submit.svg' width={30} height={30} alt="submit" />
        </button>
      </div>
    </main>
  );
}
