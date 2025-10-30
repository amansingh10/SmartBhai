// 'use client'
// import ReactMarkdown from "react-markdown";
// import InfiniteScroll from "@/components/InfiniteScroll";
// import Navbar from "@/components/Navbar";
// import FlightCard from "@/components/FlightCard";
// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";
// import deafault from "../../data/deafult.json"; // keep this for now if you still want dummy flight data
// import default2 from "../../data/default2.json";
// import defaultall from "../../data/defaultall.json";
// import chatdata from "../../data/chatdata.json"; // 👈 add your JSON here
// import { Filter } from "lucide-react";

// export default function Home() {
//   // 🧠 Load messages from your JSON file instead of a hardcoded default
//   const [messages, setMessages] = useState([
//   {
//     role: "ai",
//     content: chatdata[0]?.content || "Hello! 👋",
//     flight_data: chatdata[0]?.flight_data || null,
//   },
// ]);
// const [chatIndex, setChatIndex] = useState(1);


//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [currentFlightData, setCurrentFlightData] = useState(null);
//   const [currentBookingOptions, setCurrentBookingOptions] = useState(null);
//   const [filteredFlights, setFilteredFlights] = useState([]);
//   const [selectedRange, setSelectedRange] = useState(null);
//   const [showFilter, setShowFilter] = useState(false);
//   const [selectedAirlines, setSelectedAirlines] = useState([]);
//   const [selectedFlights, setSelectedFlights] = useState([]);
//   const [showDateFilter, setShowDateFilter] = useState(false);
//   const [tripType, setTripType] = useState("oneway");
//   const [departureDate, setDepartureDate] = useState("");
//   const [returnDate, setReturnDate] = useState("");
//   const [selectedDeal, setSelectedDeal] = useState(null);
//   const [dealMessages, setDealMessages] = useState([]);
//   const [showNoBudgetOption, setShowNoBudgetOption] = useState(false);
//   const [maxPrice, setMaxPrice] = useState(""); // this will track your max price




//   // 🧭 Automatically scroll down on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, currentFlightData]);

//   // 🛫 Extract flight data automatically if present in chat history
//   useEffect(() => {
//     const flightsFromChat = chatdata.find(
//       (msg) => msg.flight_data && msg.flight_data.length > 0
//     );
//     if (flightsFromChat) {
//       setCurrentFlightData(flightsFromChat.flight_data);
//     }
//   }, []);

//   const handleDealClick = (deal) => {
//     setSelectedDeal(deal);
//     setDealMessages([
//       {
//         role: "ai",
//         content: `💬 Welcome! Let's explore this deal from **${deal.platform}** for ₹${deal.price}.  
// Here are some ways you can save more:
// - 💳 Credit Card Offers  
// - 🏦 Debit Card Offers  
// - 🌐 Net Banking Discounts  
// - 🎟️ Coupon Codes  
// Ask me anything related to this deal!`,
//       },
//     ]);
//   };

//   const toggleAirlineSelection = (airline) => {
//     setSelectedAirlines((prev) =>
//       prev.includes(airline)
//         ? prev.filter((a) => a !== airline)
//         : [...prev, airline]
//     );
//   };

//   const toggleFlightSelection = (flightName) => {
//     setSelectedFlights((prev) =>
//       prev.includes(flightName)
//         ? prev.filter((f) => f !== flightName)
//         : [...prev, flightName]
//     );
//   };

//   const filterFlights = (range, airlines = [], flights = [], maxPrice = null) => {
//   if (!Array.isArray(currentFlightData) || currentFlightData.length === 0) {
//     console.warn("⚠️ No flight data available to filter yet.");
//     return;
//   }

//   let filtered = [...currentFlightData];

//    if (maxPrice !== null) {
//     filtered = filtered.filter((flightGroup) => {
//       const price = flightGroup.flight_data[0]?.price; // assuming price exists here
//       return price <= maxPrice;
//     });
//   }

//     // 🕒 Time filter
//     if (range) {
//       filtered = filtered.filter((flightGroup) => {
//         const depTime = new Date(flightGroup.flight_data[0]?.departure_airport?.time);
//         const hours = depTime.getHours();
//         switch (range) {
//           case "morning": return hours >= 9 && hours < 12;
//           case "afternoon": return hours >= 12 && hours < 15;
//           case "evening": return hours >= 15 && hours < 18;
//           case "night": return hours >= 18 && hours < 21;
//           default: return true;
//         }
//       });
//     }

//     // ✈️ Airline filter
//     if (airlines.length > 0) {
//       filtered = filtered.filter((flightGroup) =>
//         airlines.includes(flightGroup.flight_data[0]?.airline)
//       );
//     }

//     // 🔢 Flight number filter
//     if (flights.length > 0) {
//       filtered = filtered.filter((flightGroup) =>
//         flights.includes(flightGroup.flight_data[0]?.flight_number)
//       );
//     }

//     // 📅 Date filter
//     if (departureDate) {
//       filtered = filtered.filter((flightGroup) => {
//         const depDate = new Date(flightGroup.flight_data[0]?.departure_airport?.time)
//           .toISOString()
//           .split("T")[0];
//         return depDate === departureDate;
//       });
//     }

//     if (tripType === "roundtrip" && returnDate) {
//       filtered = filtered.filter((flightGroup) => {
//         const retDate = new Date(flightGroup.flight_data[0]?.return_airport?.time)
//           .toISOString()
//           .split("T")[0];
//         return retDate === returnDate;
//       });
//     }

//     setFilteredFlights(filtered);
//   };

// async function sendMessage() {
//   if (!input.trim()) return;

//   const userMessage = { role: "human", content: input };
//   setMessages((prev) => [...prev, userMessage]);
//   const userInput = input; // preserve before clearing
//   setInput("");
//   setLoading(true);

//   setTimeout(() => {
//     const lowerInput = userInput.toLowerCase();

    

//     // 3) If user entered a date -> show next chatdata prompt (e.g., "What is your maximum price?")

// // 1️⃣ Check for date first
// if (/\d{4}-\d{2}-\d{2}/.test(userInput)) {
//   const confirmMessage = chatdata[3]; // your budget message
//   setMessages((prev) => [
//     ...prev,
//     {
//       role: "ai",
//       content: confirmMessage.content,
//       flight_data: confirmMessage.flight_data || null,
//     },
//   ]);
//   setChatIndex((prev) => prev + 1);
//   setLoading(false);
//   return;
// }
// // 1) NO-BUDGET / NO-LIMIT
//     if (lowerInput.includes("no budget") || lowerInput.includes("no limit") || lowerInput.includes("unlimited")) {
//       const data = defaultall;
//       setMessages((prev) => [
//         ...prev,
//         { role: "ai", content: data.content || "Showing all available flights ✈️" },
//       ]);
//       if (data.flight_data?.length) {
//         setCurrentFlightData(data.flight_data);
//         setCurrentBookingOptions(data.booking_options);
//         setFilteredFlights(data.flight_data);
//       }
//       setLoading(false);
//       return;
//     }

//     // 2) If user typed a numeric budget (e.g., 7000)
//     const budgetMatch = lowerInput.match(/\d+/);
//     if (budgetMatch) {
//       const budgetValue = parseInt(budgetMatch[0], 10);
//       let dataToShow = default2;
//       if (budgetValue === 7000) dataToShow = deafault;

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: dataToShow.content || `Here are flight options under ₹${budgetValue} ✈️`,
//         },
//       ]);
//       if (dataToShow.flight_data?.length) {
//         setCurrentFlightData(dataToShow.flight_data);
//         setCurrentBookingOptions(dataToShow.booking_options);
//         setFilteredFlights(dataToShow.flight_data);
//       }
//       setLoading(false);
//       return;
//     }

//     // 4) General progression: use next chatdata message if available
//     const nextAI = chatdata[chatIndex];
//     if (nextAI) {
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: nextAI.content,
//           flight_data: nextAI.flight_data || null,
//         },
//       ]);
//       if (nextAI.flight_data) {
//         setCurrentFlightData(nextAI.flight_data);
//         setCurrentBookingOptions(nextAI.booking_options);
//         setFilteredFlights(nextAI.flight_data);
//       }
//       setChatIndex((prev) => prev + 1);
//     } else {
//       // fallback
//       const data = deafault;
//       setMessages((prev) => [
//         ...prev,
//         { role: "ai", content: data.content || "Here are your flight options ✈️" },
//       ]);
//       if (data.flight_data?.length) {
//         setCurrentFlightData(data.flight_data);
//         setCurrentBookingOptions(data.booking_options);
//         setFilteredFlights(data.flight_data);
//       }
//     }

//     setLoading(false);
//   }, 800);
// }


//   function handleTextareaChange(e) {
//     setInput(e.target.value);
//     const maxHeight = 200;
//     e.target.style.height = 'auto';
//     if (e.target.scrollHeight <= maxHeight) {
//       e.target.style.height = e.target.scrollHeight + 'px';
//       e.target.style.overflowY = 'hidden';
//     } else {
//       e.target.style.height = maxHeight + 'px';
//       e.target.style.overflowY = 'auto';
//     }
//   }

//   function sendDealMessage() {
//     if (!input.trim()) return;
//     const userMessage = { role: "human", content: input };
//     const newMessages = [...dealMessages, userMessage];
//     setDealMessages(newMessages);
//     setInput("");
//     setTimeout(() => {
//       setDealMessages((prev) => [
//         ...prev,
//         {
//           role: "ai",
//           content: `Here are more savings tips for ${selectedDeal.platform}! 💸`,
//         },
//       ]);
//     }, 800);
//   }

//   return (
//     <main className="flex flex-col h-[calc(100dvh-64px)] mx-1.5">
//     {selectedDeal ? (
//       // 🔹 Deal Chat UI
//       <div className="flex flex-col h-[calc(100dvh-64px)] p-4">
//         <button
//           className="text-sm text-blue-600 mb-3 hover:underline"
//           onClick={() => setSelectedDeal(null)}
//         >
//           ← Back to Flights
//         </button>

//         <h2 className="text-lg font-semibold mb-3">
//           💼 Chat about Deal: {selectedDeal.platform} — ₹{selectedDeal.price}
//         </h2>

//         <div className="flex-grow overflow-y-auto space-y-3">
//           {dealMessages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`px-4 py-2 rounded-2xl shadow-md max-w-full ${
//                   msg.role === "human"
//                     ? "bg-[#44403C] text-white rounded-br-none"
//                     : "bg-white text-black rounded-bl-none md:w-[70%]"
//                 }`}
//               >
//                 <ReactMarkdown>{msg.content}</ReactMarkdown>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex gap-2 mt-4">
//           <textarea
//             className="bg-white p-3 rounded-3xl w-full placeholder:text-black/70 focus:outline-none resize-none min-h-[48px]"
//             placeholder="Ask about this deal..."
//             rows="1"
//             value={input}
//             onChange={handleTextareaChange}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 sendDealMessage();
//               }
//             }}
//           />
//           <button
//             className="bg-[#4C8829] rounded-full p-3"
//             onClick={sendDealMessage}
//           >
//             <Image src="/icons/submit.svg" width={30} height={30} alt="submit" />
//           </button>
//         </div>
//       </div>
//     ) : (
//       <div className="flex-grow overflow-y-auto">
//         <Navbar />
//         <InfiniteScroll/>
//         <div className="flex flex-col mx-auto p-4">
//           {/* Messages */}
//           <div className="flex-1 space-y-4 mb-4">
//             {messages.map((msg, idx) => (
//               <div key={idx}>
//                 <div
//                   className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`px-4 py-2 rounded-2xl shadow-md max-w-full break-words ${
//                       msg.role === "human"
//                         ? "bg-[#44403C] text-white rounded-br-none"
//                         : "bg-white text-black rounded-bl-none md:w-[70%]"
//                     }`}
//                   >
//                     <ReactMarkdown>{msg.content}</ReactMarkdown>
//                   </div>
//                 </div>
//                  {/* Calendar for date input */}
//     {msg.role === "ai" && msg.content.toLowerCase().includes("departure date") && (
//       <div className="flex justify-start mt-1">
//         <label className="flex items-center gap-2 cursor-pointer text-gray-700">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 text-[#4C8829]"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//           <input
//             type="date"
//             className="border rounded-md p-1 text-sm"
//             onChange={(e) => setInput(e.target.value)}
//           />
//         </label>
//       </div>
//     )}
//               </div>
//             ))}

//             {/* Loader */}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="px-4 py-2 rounded-2xl bg-white text-black animate-pulse">
//                   ✈️ Finding the best flight offers...
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

// {/* <div className="relative inline-block mb-5">
//   <button
//     className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-700"
//     onClick={() => setShowDateFilter((prev) => !prev)}
//   >
//     <Filter className="w-4 h-4" />
//     <span>Trip Date Filter</span>
//   </button>

//   {showDateFilter && (
//     <div className="absolute z-10 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
//       <h3 className="text-sm font-semibold text-gray-700 mb-2">Trip Type</h3>
//       <div className="flex gap-3 mb-3">
//         <button
//           onClick={() => setTripType("oneway")}
//           className={`px-3 py-1.5 rounded-md border ${
//             tripType === "oneway" ? "bg-[#4C8829] text-white" : "text-gray-700"
//           }`}
//         >
//           One Way
//         </button>
//         <button
//           onClick={() => setTripType("roundtrip")}
//           className={`px-3 py-1.5 rounded-md border ${
//             tripType === "roundtrip" ? "bg-[#4C8829] text-white" : "text-gray-700"
//           }`}
//         >
//           Round Trip
//         </button>
//       </div>

//       <h3 className="text-sm font-semibold text-gray-700 mb-2">Departure Date</h3>
//       <input
//         type="date"
//         value={departureDate}
//         onChange={(e) => setDepartureDate(e.target.value)}
//         className="w-full border rounded-md p-2 mb-3"
//       />

//       {tripType === "roundtrip" && (
//         <>
//           <h3 className="text-sm font-semibold text-gray-700 mb-2">Return Date</h3>
//           <input
//             type="date"
//             value={returnDate}
//             onChange={(e) => setReturnDate(e.target.value)}
//             className="w-full border rounded-md p-2 mb-3"
//           />
//         </>
//       )}

//       <div className="flex justify-between">
//         <button
//           onClick={() => {
//             setTripType("oneway");
//             setDepartureDate("");
//             setReturnDate("");
//             setShowDateFilter(false);
//           }}
//           className="text-blue-600 text-sm hover:underline"
//         >
//           Clear
//         </button>

//         <button
//   onClick={() => {
//     if (!currentFlightData || currentFlightData.length === 0) {
//       alert("⚠️ Please search flights first before applying date filters.");
//       return;
//     }
//     filterFlights(selectedRange, selectedAirlines, selectedFlights);
//     setShowDateFilter(false);
//   }}
//   className="bg-[#4C8829] text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#3e6f22]"
// >
//   Apply
// </button>

//       </div>
//     </div>
//   )}
// </div> */}



//           {/* ✅ Flight Section */}
//           {currentFlightData && currentFlightData.length > 0 && (
//             <div className="w-full max-w-5xl mx-auto px-4 mt-4">

//               {/* 🕘 Time Filter Dropdown */}
// {/* 🕘 Time & Flight Name Filter Dropdown */}

// <div className="relative inline-block mb-5">
//   <button
//     className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 text-gray-700"
//     onClick={() => setShowFilter((prev) => !prev)}
//   >
//     <Filter className="w-4 h-4" />
//     <span>Filter</span>
//   </button>

//   {showFilter && (
//     <div className="absolute z-10 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">

//        <h3 className="text-sm font-semibold text-gray-700 mb-2">🛫 Flight Name</h3>
// <div className="max-h-40 overflow-y-auto text-sm flex flex-col gap-1 mb-3">
//   {Array.from(new Set(currentFlightData.map((f) => f.flight_data[0]?.airline))).map((airline, idx) => (
//   <label key={`${airline}-${idx}`} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded-md cursor-pointer">
//     <input
//       type="checkbox"
//       checked={selectedAirlines.includes(airline)}
//       onChange={() => toggleAirlineSelection(airline)}
//       className="accent-[#4C8829]"
//     />
//     {airline}
//   </label>
// ))}


// </div>
//       <h3 className="text-sm font-semibold text-gray-700 mb-2">🕒 Time Range</h3>
//       <div className="flex flex-col text-sm text-gray-700 mb-3">
//         {[
//           { key: "morning", label: "🌅 Morning (9 AM - 12 PM)" },
//           { key: "afternoon", label: "☀️ Afternoon (12 PM - 3 PM)" },
//           { key: "evening", label: "🌇 Evening (3 PM - 6 PM)" },
//           { key: "night", label: "🌙 Night (6 PM - 9 PM)" },
//         ].map((item) => (
//           <button
//             key={item.key}
//             onClick={() => setSelectedRange(item.key)}
//             className={`px-3 py-1.5 text-left rounded-md hover:bg-gray-100 ${
//               selectedRange === item.key ? "bg-[#4C8829]/10 text-[#4C8829]" : ""
//             }`}
//           >
//             {item.label}
//           </button>
//         ))}
//       </div>

     


//       <div className="flex justify-between mt-3">
//         <button
//           onClick={() => {
//             setSelectedRange(null);
//             setSelectedAirlines([]);
//             setSelectedFlights([]); // make sure selectedFlights is cleared
//             filterFlights(null, [], []); // pass empty array for flights
//             setShowFilter(false);
//           }}
//           className="text-blue-600 text-sm hover:underline"
//         >
//           Clear Filter
//         </button>
//        <button
//   onClick={() => {
//     filterFlights(selectedRange, selectedAirlines, selectedFlights);
//     setShowFilter(false);
//   }}
//   className="bg-[#4C8829] text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#3e6f22]"
// >
//   Apply
// </button>

//       </div>
//     </div>
//   )}
// </div>


//               <h2 className="text-lg font-semibold text-gray-800 mb-3">
//                 Showing {filteredFlights.length} Flights
//               </h2>

//               {/* ✈️ Flight Cards */}
//               {filteredFlights.map((flightGroup, index) => (
//                 <FlightCard
//                   key={index}
//                   flightData={flightGroup.flight_data}
//                   bookingOptions={flightGroup.booking_options}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//        )}
//       {/* Input Box */}
//       <div className="flex gap-2 py-3 items-end">
//         <textarea 
//           className="bg-white p-3 rounded-3xl w-full placeholder:text-black/70 placeholder:font-bold focus:outline-none resize-none min-h-[48px] scrollbar-hide" 
//           placeholder="Ask me anything!"
//           rows="1"
//           value={input}
//           onChange={handleTextareaChange}
//            onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault();  
//               sendMessage();       
//             }
//           }}
//         />
//         <button className="bg-[#4C8829] rounded-full p-3 flex-shrink-0" onClick={sendMessage}>
//           <Image src='/icons/submit.svg' width={30} height={30} alt="submit" />
//         </button>

//       </div>
    
//     {/* closes the else */}
    
//     </main>
//   );
// }





// 'use client'
// import ReactMarkdown from "react-markdown";
// import InfiniteScroll from "@/components/InfiniteScroll";
// import Navbar from "@/components/Navbar"
// import FlightCard from "@/components/FlightCard";
// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState([
//     {
//       role: "ai",
//       content:
//         "👋 Hi! I’m your Flight Coupon Assistant. I can help you find the best flight offers, discounts, and deals. Ask me anything about flight coupons!",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//   const [currentFlightData, setCurrentFlightData] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [currentBookingOptions, setCurrentBookingOptions] = useState(null);

//   // Auto-scroll to bottom when new message arrives or flight data changes
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, currentFlightData]);

//   // Show date picker only when last AI message asks for date
//   useEffect(() => {
//     const lastAIMessage = messages[messages.length - 1];
//     if (lastAIMessage?.role === "ai") {
//       const dateKeywords = [
//         "what date",
//         "departure date",
//         "travel date",
//         "when are you traveling"
//       ];
//       const shouldShow = dateKeywords.some(keyword =>
//         lastAIMessage.content.toLowerCase().includes(keyword)
//       );
//       setShowDatePicker(shouldShow);
//     } else {
//       setShowDatePicker(false);
//     }
//   }, [messages]);

//   // Regular send message (via textarea)
//   async function sendMessage() {
//     if (!input.trim()) return;

//     const userMessage = { role: "human", content: input };
//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);
//     setInput("");
//     await sendMessageAutomatically(newMessages);
//   }

//   // Auto-send function used for date picker or normal messages
//   async function sendMessageAutomatically(newMessages) {
//     setLoading(true);
//     try {
//       const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ chat_history: newMessages }),
//       });
//       const data = await res.json();

//       if (data.flight_data && data.flight_data.length > 0) {
//         setCurrentFlightData(data.flight_data);
//         setCurrentBookingOptions(data.booking_options);
//       } else {
//         setCurrentFlightData(null);
//         setCurrentBookingOptions(null);
//       }

//       setMessages([...newMessages, { role: "ai", content: data.content }]);
//     } catch (error) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "ai", content: "⚠️ Error connecting to server." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Handle textarea resizing
//   function handleTextareaChange(e) {
//     setInput(e.target.value);
//     const maxHeight = 200;
//     e.target.style.height = 'auto';
//     if (e.target.scrollHeight <= maxHeight) {
//       e.target.style.height = e.target.scrollHeight + 'px';
//       e.target.style.overflowY = 'hidden';
//     } else {
//       e.target.style.height = maxHeight + 'px';
//       e.target.style.overflowY = 'auto';
//     }
//   }

//   return (
//     <main className="flex flex-col h-[calc(100dvh-64px)] mx-1.5">
//       <div className="flex-grow overflow-y-auto">
//         <Navbar />
//         <InfiniteScroll />
//         <div className="flex flex-col mx-auto p-4">
//           {/* Messages */}
//           <div className="flex-1 space-y-4 mb-4">
//             {messages.map((msg, idx) => (
//               <div key={idx}>
//                 <div className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}>
//                   <div className={`px-4 py-2 rounded-2xl shadow-md max-w-full break-words ${msg.role === "human"
//                     ? "bg-[#44403C] text-white rounded-br-none"
//                     : "bg-white text-black rounded-bl-none md:w-[70%]"
//                   }`}>
//                     <ReactMarkdown>{msg.content}</ReactMarkdown>

//                     {/* Inline date picker inside last AI message */}
//                     {msg.role === "ai" && idx === messages.length - 1 && showDatePicker && (
//                       <input
//                         type="date"
//                         className="border rounded p-2 mt-2 w-full"
//                         value={selectedDate}
//                         onChange={(e) => {
//                           const date = e.target.value;
//                           setSelectedDate(date);
//                           setShowDatePicker(false);
//                           // Send date automatically as human message
//                           const userMessage = { role: "human", content: date };
//                           const newMessages = [...messages, userMessage];
//                           setMessages(newMessages);
//                           sendMessageAutomatically(newMessages);
//                         }}
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {loading && (
//               <div className="flex justify-start">
//                 <div className="px-4 py-2 rounded-2xl bg-white text-black animate-pulse">
//                   ✈️ Finding the best flight offers...
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* FlightCards */}
//           {currentFlightData && currentFlightData.length > 0 && (
//             <div className="mt-4 space-y-4">
//               {currentFlightData.map((flightGroup, index) => (
//                 <FlightCard
//                   key={index}
//                   flightData={flightGroup.flight_data}
//                   bookingOptions={flightGroup.booking_options}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Input area for normal typing */}
//       <div className="flex gap-2 py-3 items-end">
//         <textarea
//           className="bg-white p-3 rounded-3xl w-full placeholder:text-black/70 placeholder:font-bold focus:outline-none resize-none min-h-[48px] scrollbar-hide"
//           placeholder="Ask me anything!"
//           rows="1"
//           value={input}
//           onChange={handleTextareaChange}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
//         />

//         <button className="bg-[#4C8829] rounded-full p-3 flex-shrink-0" onClick={sendMessage}>
//           <Image src='/icons/submit.svg' width={30} height={30} alt="submit" />
//         </button>
//       </div>
//     </main>
//   );
// }

'use client'
import ReactMarkdown from "react-markdown";
import InfiniteScroll from "@/components/InfiniteScroll";
import Navbar from "@/components/Navbar";
import FlightCard from "@/components/FlightCard";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";

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

  // Dynamic UI states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAirlineFilter, setShowAirlineFilter] = useState(false);
  const [showPriceSlider, setShowPriceSlider] = useState(false);

  // Filters
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [maxBudget, setMaxBudget] = useState(10000);
  const [minBudget, setMinBudget] = useState(1000);

  const availableAirlines = [
    "No Preference",
    "Air India",
    "Vistara",
    "SpiceJet",
    "Akasa Air",
    "Go First",
    "IndiGo",
  ];

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentFlightData]);

  // Detect AI prompt cues for filters
  useEffect(() => {
    const lastAIMessage = messages[messages.length - 1];
    if (!lastAIMessage || lastAIMessage.role !== "ai") return;

    const content = lastAIMessage.content?.toLowerCase() || "";
    const showDate = /(what|which).*date|departure date|travel date|when.*travel/.test(content);
    const showAirline = /(preferred airline|specific airline|all available option|any airline|no prefrence)/.test(content);
    const showPrice = /(maximum budget|budget in inr|price range|max price|budget for this flight)/.test(content);

    setShowDatePicker(showDate);
    setShowAirlineFilter(showAirline);
    setShowPriceSlider(showPrice);
  }, [messages]);

  // --- User message send ---
  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: "human", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    await sendMessageAutomatically(newMessages);
  }

  // --- Message handler (main backend + frontend filters) ---
  async function sendMessageAutomatically(newMessages) {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_history: newMessages }),
      });
      const data = await res.json();

      let filteredFlights = data.flight_data || [];

      // 1️⃣ IndiGo frontend filter
      if (selectedAirlines.includes("IndiGo")) {
        filteredFlights = filteredFlights.filter(flightGroup =>
          flightGroup.flight_data?.some(
            flight =>
              flight.airline?.toLowerCase().includes("indigo") ||
              flight.airline_code?.toLowerCase() === "6e"
          )
        );
      }

      // 2️⃣ Min budget airline-matched filter
      if (minBudget > 0) {
        filteredFlights = filteredFlights.filter(flightGroup => {
          return flightGroup.flight_data?.some(flight => {
            const airlineName = flight.airline?.trim().toLowerCase();
            if (!airlineName) return false;

            const ownBooking = flightGroup.booking_options?.find(opt =>
              opt.together?.book_with?.trim().toLowerCase() === airlineName
            );

            if (!ownBooking || !ownBooking.together?.price) return false;
            const price = Number(ownBooking.together.price);
            return price >= minBudget;
          });
        });
      }

      // 3️⃣ Update state
      if (filteredFlights.length > 0) {
        setCurrentFlightData(filteredFlights);
        setCurrentBookingOptions(data.booking_options);
      } else {
        setCurrentFlightData(null);
        setCurrentBookingOptions(null);
      }

      setMessages([...newMessages, { role: "ai", content: data.content }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: "ai", content: "⚠️ Error connecting to server." }]);
    } finally {
      setLoading(false);
    }
  }

  // --- Helpers ---
  function handleTextareaChange(e) {
    setInput(e.target.value);
    const maxHeight = 200;
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
    e.target.style.overflowY = e.target.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }

  function handleAirlineChange(airline) {
    setSelectedAirlines(prev =>
      prev.includes(airline)
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  }

  function sendFilterResponse(response) {
    const userMessage = { role: "human", content: response };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setShowDatePicker(false);
    setShowAirlineFilter(false);
    setShowPriceSlider(false);
    sendMessageAutomatically(newMessages);
  }

  const handleClearChat = () => {
    setMessages([
      {
        role: "ai",
        content:
          "👋 Hi! I’m your Flight Coupon Assistant. I can help you find the best flight offers, discounts, and deals. Ask me anything about flight coupons!",
      },
    ]);
    setCurrentFlightData(null);
    setCurrentBookingOptions(null);
    setSelectedDate("");
    setSelectedAirlines([]);
    setMaxBudget(10000);
    setMinBudget(1000);
  };

  // --- UI ---
  return (
    <main className="flex flex-col h-[calc(100dvh-64px)] mx-1.5">
      <Header onClearChat={handleClearChat} />
      <div className="flex-grow overflow-y-auto">
        <Navbar />
        <InfiniteScroll />

        <div className="flex flex-col mx-auto p-4">
          <div className="flex-1 space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx}>
                <div className={`flex ${msg.role === "human" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-md max-w-full break-words ${
                      msg.role === "human"
                        ? "bg-[#44403C] text-white rounded-br-none"
                        : "bg-white text-black rounded-bl-none md:w-[70%]"
                    }`}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>

                    {/* === DATE PICKER === */}
                    {msg.role === "ai" && idx === messages.length - 1 && showDatePicker && (
                      <input
                        type="date"
                        className="border rounded p-2 mt-2 w-full"
                        value={selectedDate}
                        onChange={(e) => {
                          const date = e.target.value;
                          setSelectedDate(date);
                          sendFilterResponse(`My travel date is ${date}`);
                        }}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    )}

                    {/* === AIRLINE FILTER === */}
                    {msg.role === "ai" && idx === messages.length - 1 && showAirlineFilter && (
                      <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                        <h3 className="font-semibold mb-2">✈️ Select Preferred Airlines:</h3>
                        {availableAirlines.map((airline) => (
                          <label key={airline} className="block text-sm">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={selectedAirlines.includes(airline)}
                              onChange={() => handleAirlineChange(airline)}
                            />
                            {airline}
                          </label>
                        ))}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => sendFilterResponse(`I prefer ${selectedAirlines.join(", ")}`)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                            disabled={selectedAirlines.length === 0}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => sendFilterResponse("no preference")}
                            className="text-blue-600 underline"
                          >
                            no preference
                          </button>
                        </div>
                      </div>
                    )}

                    {/* === BUDGET RANGE === */}
                    {msg.role === "ai" && idx === messages.length - 1 && showPriceSlider && (
                      <div className="mt-3 border rounded-lg p-3 bg-gray-50">
                        <h3 className="font-semibold mb-2">💰 Set your budget range (INR):</h3>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm">Minimum Budget: ₹{minBudget}</label>
                          <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="500"
                            value={minBudget}
                            onChange={(e) => setMinBudget(Number(e.target.value))}
                            className="w-full accent-green-700"
                          />
                          <label className="text-sm mt-2">Maximum Budget: ₹{maxBudget}</label>
                          <input
                            type="range"
                            min="5000"
                            max="50000"
                            step="500"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(Number(e.target.value))}
                            className="w-full accent-green-700"
                          />
                        </div>
                        <p className="mt-2 font-bold text-center">
                          Range: ₹{minBudget} - ₹{maxBudget}
                        </p>
                        <button
                          onClick={() =>
                            sendFilterResponse(
                              `My budget range is between ₹${minBudget} and ₹${maxBudget}`
                            )
                          }
                          className="mt-3 bg-green-600 text-white px-3 py-1 rounded w-full"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-white text-black animate-pulse">
                  ✈️ Finding the best flight offers...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* === FLIGHT RESULTS === */}
          {currentFlightData && currentFlightData.length > 0 && (
            <div className="mt-4 space-y-4">
              {currentFlightData.map((flightGroup, index) => (
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

      {/* === INPUT AREA === */}
      <div className="flex gap-2 py-3 items-end">
        <textarea
          className="bg-white p-3 rounded-3xl w-full placeholder:text-black/70 placeholder:font-bold focus:outline-none resize-none min-h-[48px] scrollbar-hide"
          placeholder="Ask me anything!"
          rows="1"
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
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