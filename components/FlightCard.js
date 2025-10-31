// 'use client';
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
// import deals from "../app/data/deals.json";

// export default function FlightCard({ flightData, bookingOptions }) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [currentDiscount, setCurrentDiscount] = useState(0);
//   const [offers, setOffers] = useState([]);
//   const [minPrice, setMinPrice] = useState(0);
//   const [minAvailablePrice, setMinAvailablePrice] = useState(0);
//   const [maxAvailablePrice, setMaxAvailablePrice] = useState(0);
//   const [showPriceFilter, setShowPriceFilter] = useState(false);
//   const [activeChat, setActiveChat] = useState(null);
//   const [currentOfferIndexMap, setCurrentOfferIndexMap] = useState({});
//   const [sortOrder, setSortOrder] = useState("asc");
  
//   const [chatMessages, setChatMessages] = useState({});
//   const [chatInput, setChatInput] = useState({});

//   if (!flightData || flightData.length === 0) return null;
//   const flight = flightData[0];
//   if (!flight || typeof flight !== 'object') return null;

//   const departureAirport = flight.departure_airport || {};
//   const arrivalAirport = flight.arrival_airport || {};

//   const formatTime = (timeString) => {
//     try {
//       const date = new Date(timeString);
//       return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
//     } catch {
//       return timeString;
//     }
//   };

//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   const formatPrice = (price) =>
//     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

//   const fetchLatestDeals = async () => {
//     try {
//       const data = deals;
//       const platforms = bookingOptions?.map(opt => opt.together?.book_with?.toLowerCase()) || [];
//       const filteredDeals = data.deals.filter((deal) => {
//         const airlineMatch = deal.airline?.toLowerCase() === flight.airline?.toLowerCase();
//         const flightNumberMatch = deal.flight_number?.toLowerCase() === flight.flight_number?.toLowerCase();
//         const platformMatch = platforms.includes(deal.platform?.toLowerCase());
//         return airlineMatch || flightNumberMatch || platformMatch;
//       });
//       setOffers(filteredDeals);
//     } catch (err) {
//       console.error("Error loading deals:", err);
//     }
//   };

//    const handleBookNow = async (booking, index) => {
//     setActiveChat(activeChat === index ? null : index);
//     await fetchLatestDeals();
//     // Initialize chat messages when opening
//     if (!chatMessages[index]) {
//       setChatMessages(prev => ({
//         ...prev,
//         [index]: [
//           { from: 'agent', text: `👋 Hi! I’m ${booking.book_with}. How can I help you today?` },
//           { from: 'agent', text: "We currently have great offers on flight bookings!" }
//         ]
//       }));
//     }
//   };

//   const dummyReplies = [
//     "🎁 You can use coupon **FLYHIGH500** for ₹500 off!",
//     "💳 HDFC Bank users get 10% instant discount up to ₹1200.",
//     "🎉 Special festive deal: 15% off on all domestic flights!",
//     "💰 Apply code **GOHOLIDAY** to save ₹750 on this booking.",
//     "🔥 Limited-time offer: Flat ₹1000 cashback on ICICI cards!"
//   ];

//   const handleSendMessage = (index) => {
//     const text = chatInput[index]?.trim();
//     if (!text) return;

//     // Add user message
//     setChatMessages(prev => ({
//       ...prev,
//       [index]: [...(prev[index] || []), { from: 'user', text }]
//     }));
//     setChatInput(prev => ({ ...prev, [index]: '' }));

//     // Auto agent reply
//     setTimeout(() => {
//       const randomReply = dummyReplies[Math.floor(Math.random() * dummyReplies.length)];
//       setChatMessages(prev => ({
//         ...prev,
//         [index]: [...(prev[index] || []), { from: 'agent', text: randomReply }]
//       }));
//     }, 800);
//   };


//   // 🟢 Initialize min/max prices
//   useEffect(() => {
//     if (bookingOptions?.length) {
//       const prices = bookingOptions.map((opt) => opt.together?.price || 0);
//       const minP = Math.min(...prices);
//       const maxP = Math.max(...prices);
//       setMinAvailablePrice(minP);
//       setMaxAvailablePrice(maxP);
//       setMinPrice(minP);
//     }
//   }, [bookingOptions]);

//   // 🔁 Auto-slide offers every 3s globally
//   useEffect(() => {
//     if (!offers.length) return;
//     const interval = setInterval(() => {
//       setCurrentDiscount((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [offers]);

//   // 🟢 Auto-slide per platform offers (safe hook handling)
//   useEffect(() => {
//     const intervals = Object.entries(currentOfferIndexMap).map(([platform, index]) => {
//       const platformOffers = offers.filter(o => o.platform?.toLowerCase() === platform.toLowerCase());
//       if (platformOffers.length > 0) {
//         const interval = setInterval(() => {
//           setCurrentOfferIndexMap(prev => ({
//             ...prev,
//             [platform]: (prev[platform] + 1) % platformOffers.length,
//           }));
//         }, 3000);
//         return () => clearInterval(interval);
//       }
//     });
//     return () => intervals.forEach(clear => clear && clear());
//   }, [offers]);

//   const filteredBookings = (bookingOptions || []).filter(
//     (b) => (b.together?.price || 0) >= minPrice
//   );

//   const sortedBookings = [...filteredBookings].sort((a, b) => {
//     const priceA = a.together?.price || 0;
//     const priceB = b.together?.price || 0;
//     return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
//   });

//   return (
//     <Card className="w-full max-w-2xl mx-auto mb-4 shadow-lg">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             {flight.airline_logo && (
//               <Image src={flight.airline_logo} alt={flight.airline} width={40} height={40} className="rounded" />
//             )}
//             <div>
//               <CardTitle className="text-lg font-semibold">{flight.airline}</CardTitle>
//               <CardDescription className="text-sm text-gray-500">
//                 {flight.flight_number} • {flight.airplane}
//               </CardDescription>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-sm text-gray-500">Duration</div>
//             <div className="font-semibold">{formatDuration(flight.duration)}</div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pb-3">
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-center">
//             <div className="text-2xl font-bold">{formatTime(departureAirport.time)}</div>
//             <div className="text-sm font-semibold">{departureAirport.id}</div>
//             <div className="text-xs text-gray-500">{departureAirport.name}</div>
//           </div>
//           <div className="flex-1 mx-4 relative">
//             <div className="h-0.5 bg-gray-300"></div>
//             <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">✈️</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold">{formatTime(arrivalAirport.time)}</div>
//             <div className="text-sm font-semibold">{arrivalAirport.id}</div>
//             <div className="text-xs text-gray-500">{arrivalAirport.name}</div>
//           </div>
//         </div>

//         {flight.extensions?.length > 0 && (
//           <div className="mt-3 text-xs text-gray-500 space-y-1">
//             {flight.extensions.map((ext, i) => <div key={i}>• {ext}</div>)}
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="pt-3 border-t">
//         <button
//           onClick={() => setIsExpanded(!isExpanded)}
//           className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
//             !bookingOptions?.length
//               ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 text-white'
//           }`}
//           disabled={!bookingOptions?.length}
//         >
//           {isExpanded ? 'Hide Booking Options' : `GET DEALS (${bookingOptions?.length || 0})`}
//         </button>
//       </CardFooter>

//       {isExpanded && (
//         <div className="border-t bg-gray-50 p-4">
//           {/* Filters */}
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="font-semibold text-lg">Available Deals</h3>
//             {/* <button
//               onClick={() => setShowPriceFilter((p) => !p)}
//               className="flex items-center space-x-1 p-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
//             >
//               <span className="text-sm text-blue-600">💰 Min Price</span>
//             </button> */}
//             <button
//               onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
//               className="text-sm text-blue-600 hover:text-blue-800"
//             >
//               Sort by Price ({sortOrder === "asc" ? "Low → High" : "High → Low"})
//             </button>
//           </div>

//           {showPriceFilter && (
//             <div className="mb-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Min Price: ₹{minPrice.toLocaleString("en-IN")}
//               </label>
//               <input
//                 type="range"
//                 min={minAvailablePrice}
//                 max={maxAvailablePrice}
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(Number(e.target.value))}
//                 className="w-full accent-blue-600"
//               />
//             </div>
//           )}

//           {/* Booking Cards */}
//           {sortedBookings.map((option, index) => {
//             const booking = option.together || {};
//             const platform = booking.book_with?.toLowerCase();
//             const platformOffers = offers.filter(
//               (offer) => offer.platform?.toLowerCase() === platform
//             );

//             const currentIndex = currentOfferIndexMap[platform] || 0;
//             const currentOffer = platformOffers[currentIndex];

//             return (
//               <Card key={index} className="bg-white hover:shadow-md transition-shadow mb-3">
//                 <CardContent className="p-4 flex flex-col items-center text-center">
//                   <div className="flex items-center justify-between w-full">
//                     <div className="flex items-center space-x-3">
//                       {booking.airline_logos?.[0] && (
//                         <Image src={booking.airline_logos[0]} alt={booking.book_with} width={50} height={50} className="rounded" />
//                       )}
//                       <div className="text-left">
//                         <div className="font-semibold">{booking.book_with}</div>
//                         <div className="text-xs text-gray-500">
//                           {booking.marketed_as?.join(", ") || "Standard Fare"}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-green-600 text-lg font-bold">
//                       {booking.price ? formatPrice(booking.price) : "N/A"}
//                     </div>
//                   </div>

//                   {platformOffers.length > 0 && currentOffer && (
//                     <div className="relative w-full mt-3 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-3">
//                       <div className="text-xs text-left min-h-[48px]">
//                         <strong className="text-yellow-700">{currentOffer.coupon_code}:</strong>{" "}
//                         <span className="text-gray-700">{currentOffer.offer}</span>
//                       </div>
//                       <div className="flex justify-center mt-2 space-x-1">
//                         {platformOffers.map((_, i) => (
//                           <button
//                             key={i}
//                             onClick={() =>
//                               setCurrentOfferIndexMap((prev) => ({ ...prev, [platform]: i }))
//                             }
//                             className={`w-2 h-2 rounded-full ${
//                               i === currentIndex ? "bg-yellow-600" : "bg-yellow-300"
//                             }`}
//                           ></button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <button
//                     onClick={() => handleBookNow(booking, index)}
//                     className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded-md"
//                   >
//                     {activeChat === index ? "Close Chat" : "Book Now"}
//                   </button>

//                  {activeChat === index && (
//   <div className="w-full mt-3 border-t pt-3 text-left">
//     <div className="text-sm font-semibold text-blue-600 mb-1">
//       💬 Chat with {booking.book_with || "Agent"}
//     </div>
//     <div className="bg-gray-100 rounded-md p-3 max-h-52 overflow-y-auto text-sm space-y-2">
//       {(chatMessages[index] || []).map((msg, i) => (
//         <div
//           key={i}
//           className={`p-2 rounded-md ${
//             msg.from === 'user'
//               ? 'bg-blue-200 text-right'
//               : 'bg-yellow-100 text-gray-800'
//           }`}
//         >
//           {msg.text}
//         </div>
//       ))}
//     </div>
//     <div className="flex mt-2 space-x-2">
//       <textarea
//         value={chatInput[index] || ''}
//         onChange={(e) =>
//           setChatInput((prev) => ({ ...prev, [index]: e.target.value }))
//         }
//         placeholder="Type your message..."
//         className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
//         rows={2}
//       ></textarea>
//       <button
//         onClick={() => handleSendMessage(index)}
//         className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-md h-fit"
//       >
//         Send
//       </button>
//     </div>
//   </div>
// )}

//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </Card>
//   );
// }








'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import deals from "../app/data/deals.json";

export default function FlightCard({ flightData, bookingOptions }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(0);
  const [offers, setOffers] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [minAvailablePrice, setMinAvailablePrice] = useState(0);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(0);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [currentOfferIndexMap, setCurrentOfferIndexMap] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");
const [chatLoading, setChatLoading] = useState({});
const [chatMessages, setChatMessages] = useState({});
const [chatInput, setChatInput] = useState({});
const [showBankFilter, setShowBankFilter] = useState({});
const [selectedBanks, setSelectedBanks] = useState({});
const [showBankOptions, setShowBankOptions] = useState({});
const [showCardOptions, setShowCardOptions] = useState({});
const [selectedCardType, setSelectedCardType] = useState({});
const [showOfferTypeOptions, setShowOfferTypeOptions] = useState({});
const chatContainerRefs = useRef({});
// ✅ Auto-scroll useEffect
  useEffect(() => {
    if (activeChat !== null && chatContainerRefs.current[activeChat]) {
      const el = chatContainerRefs.current[activeChat];
      el.scrollTop = el.scrollHeight;
    }
  }, [chatMessages, activeChat]);

  if (!flightData || flightData.length === 0) return null;
  const flight = flightData[0];
  if (!flight || typeof flight !== 'object') return null;

  const departureAirport = flight.departure_airport || {};
  const arrivalAirport = flight.arrival_airport || {};

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return timeString;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

  const fetchLatestDeals = async () => {
    try {
      const data = deals;
      const platforms = bookingOptions?.map(opt => opt.together?.book_with?.toLowerCase()) || [];
      const filteredDeals = data.deals.filter((deal) => {
        const airlineMatch = deal.airline?.toLowerCase() === flight.airline?.toLowerCase();
        const flightNumberMatch = deal.flight_number?.toLowerCase() === flight.flight_number?.toLowerCase();
        const platformMatch = platforms.includes(deal.platform?.toLowerCase());
        return airlineMatch || flightNumberMatch || platformMatch;
      });
      setOffers(filteredDeals);
    } catch (err) {
      console.error("Error loading deals:", err);
    }
  };

  const handleBookNow = async (booking, index) => {
  if (activeChat === index) {
    // 👇 If chat is already open, close and reset it
    setActiveChat(null);
    setShowOfferTypeOptions(prev => {
  const updated = { ...prev };
  delete updated[index];
  return updated;
});

    setChatMessages(prev => {
      const updated = { ...prev };
      delete updated[index]; // clear that chat
      return updated;
    });
    setChatInput(prev => {
      const updated = { ...prev };
      delete updated[index]; // clear input
      return updated;
    });
    setShowBankOptions(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
    setShowCardOptions(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
    setSelectedCardType(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
    setSelectedBanks(prev => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
    return;
  }

  // 👇 Otherwise, open the chat fresh
  setActiveChat(index);
  await fetchLatestDeals();

  setChatMessages(prev => ({
    ...prev,
    [index]: [
      { from: 'agent', text: `👋 Hi! I’m ${booking.book_with}. How can I help you today?` },
      { from: 'agent', text: "We currently have great offers on flight bookings! How can I assist you?" }
    ]
  }));
};


  const handleSendMessage = async (index, booking) => {
  const text = chatInput[index]?.trim();
  if (!text) return;

  setChatMessages(prev => ({
    ...prev,
    [index]: [...(prev[index] || []), { from: 'user', text }]
  }));
  setChatInput(prev => ({ ...prev, [index]: '' }));
  setChatLoading(prev => ({ ...prev, [index]: true }));

  try {
// ✅ Detect "credit" input manually — no need to wait for backend
    if (text.toLowerCase().includes("credit")) {
      setChatMessages(prev => ({
        ...prev,
        [index]: [
          ...(prev[index] || []),
          {
            from: 'agent',
            text: "Perfect! You're using a credit card. Please select your bank below 👇",
          },
        ],
      }));
      setShowBankOptions(prev => ({ ...prev, [index]: true }));
      setChatLoading(prev => ({ ...prev, [index]: false }));
      return;
    }

    const chatHistory = (chatMessages[index] || []).map(msg => ({
      role: msg.from === 'user' ? 'human' : 'ai',
      content: msg.text
    }));

    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_history: [...chatHistory, { role: "human", content: text }]
      })
    });

    const data = await res.json();
    const replyText = data.content || "Got it!";


    setChatMessages(prev => ({
      ...prev,
      [index]: [...(prev[index] || []), { from: 'agent', text: replyText }]
    }));
    
// ✅ Auto-show card type checkboxes if AI mentions credit/debit or similar prompts
// ✅ Show Offer Type (General/Bank/Coupon) checkboxes when this message comes
// ✅ Show Offer Type (General/Bank/Coupon) checkboxes when AI asks about offer preferences
if (
  replyText.toLowerCase().includes("are you looking for general offers") ||
  replyText.toLowerCase().includes("are you looking for general flight offers") ||
  replyText.toLowerCase().includes("bank-specific offers") ||
  replyText.toLowerCase().includes("gift coupons") ||
  replyText.toLowerCase().includes("bank-specific deals")
) {
  setShowOfferTypeOptions(prev => ({ ...prev, [index]: true }));
}



if (
  replyText.toLowerCase().includes("credit card or debit card") ||
  replyText.toLowerCase().includes("which card type") ||
  (replyText.toLowerCase().includes("let me know") && replyText.includes("💳"))
) {
  setShowCardOptions(prev => ({ ...prev, [index]: true }));
}


// ✅ Show bank options immediately if AI message asks for bank
if (
  replyText.toLowerCase().includes("which bank are you interested in") ||
  replyText.toLowerCase().includes("select your bank") ||
  replyText.toLowerCase().includes("Which bank") 
) {
  setShowBankOptions(prev => ({ ...prev, [index]: true }));
}

  } catch (error) {
    console.error(error);
  } finally {
    setChatLoading(prev => ({ ...prev, [index]: false }));
  }
};


  useEffect(() => {
    if (bookingOptions?.length) {
      const prices = bookingOptions.map((opt) => opt.together?.price || 0);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      setMinAvailablePrice(minP);
      setMaxAvailablePrice(maxP);
      setMinPrice(minP);
    }
  }, [bookingOptions]);

  useEffect(() => {
    if (!offers.length) return;
    const interval = setInterval(() => {
      setCurrentDiscount((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [offers]);

  useEffect(() => {
    const intervals = Object.entries(currentOfferIndexMap).map(([platform, idx]) => {
      const platformOffers = offers.filter(o => o.platform?.toLowerCase() === platform.toLowerCase());
      if (platformOffers.length > 0) {
        const interval = setInterval(() => {
          setCurrentOfferIndexMap(prev => ({
            ...prev,
            [platform]: (prev[platform] + 1) % platformOffers.length,
          }));
        }, 3000);
        return () => clearInterval(interval);
      }
      return () => {};
    });
    return () => intervals.forEach(clr => clr && clr());
  }, [offers]);

  const filteredBookings = (bookingOptions || []).filter(
    (b) => (b.together?.price || 0) >= minPrice
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const priceA = a.together?.price || 0;
    const priceB = b.together?.price || 0;
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });

  
  return (
    <Card className="w-full max-w-2xl mx-auto mb-4 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {flight.airline_logo && (
              <Image src={flight.airline_logo} alt={flight.airline} width={40} height={40} className="rounded" />
            )}
            <div>
              <CardTitle className="text-lg font-semibold">{flight.airline}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {flight.flight_number} • {flight.airplane}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-semibold">{formatDuration(flight.duration)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatTime(departureAirport.time)}</div>
            <div className="text-sm font-semibold">{departureAirport.id}</div>
            <div className="text-xs text-gray-500">{departureAirport.name}</div>
          </div>
          <div className="flex-1 mx-4 relative">
            <div className="h-0.5 bg-gray-300"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">✈️</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatTime(arrivalAirport.time)}</div>
            <div className="text-sm font-semibold">{arrivalAirport.id}</div>
            <div className="text-xs text-gray-500">{arrivalAirport.name}</div>
          </div>
        </div>

        {flight.extensions?.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 space-y-1">
            {flight.extensions.map((ext, i) => <div key={i}>• {ext}</div>)}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
            !bookingOptions?.length
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={!bookingOptions?.length}
        >
          {isExpanded ? 'Hide Booking Options' : `GET DEALS (${bookingOptions?.length || 0})`}
        </button>
      </CardFooter>

      {isExpanded && (
        <div className="border-t bg-gray-50 p-4">
          {/* Filters */}
          <div className="flex items-center justify-between mb-3">
             <h3 className="font-semibold text-lg">Available Deals</h3>
            {/* <button
              onClick={() => setShowPriceFilter((p) => !p)}
              className="flex items-center space-x-1 p-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              <span className="text-sm text-blue-600">💰 Min Price</span>
            </button> */}
            <button
              onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Sort by Price ({sortOrder === "asc" ? "Low → High" : "High → Low"})
            </button>
          </div>

          {showPriceFilter && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price: ₹{minPrice.toLocaleString("en-IN")}
              </label>
              <input
                type="range"
                min={minAvailablePrice}
                max={maxAvailablePrice}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          )}

          {/* Booking Cards */}
          {sortedBookings.map((option, index) => {
            const booking = option.together || {};
            const platform = booking.book_with?.toLowerCase();
            const platformOffers = offers.filter(
              (offer) => offer.platform?.toLowerCase() === platform
            );

            const currentIndex = currentOfferIndexMap[platform] || 0;
            const currentOffer = platformOffers[currentIndex];

            return (
              <Card key={index} className="bg-white hover:shadow-md transition-shadow mb-3">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      {booking.airline_logos?.[0] && (
                        <Image src={booking.airline_logos[0]} alt={booking.book_with} width={50} height={50} className="rounded" />
                      )}
                      <div className="text-left">
                        <div className="font-semibold">{booking.book_with}</div>
                        <div className="text-xs text-gray-500">
                          {booking.marketed_as?.join(", ") || "Standard Fare"}
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 text-lg font-bold">
                      {booking.price ? formatPrice(booking.price) : "N/A"}
                    </div>
                  </div>

                  {platformOffers.length > 0 && currentOffer && (
                    <div className="relative w-full mt-3 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-3">
                      <div className="text-xs text-left min-h-[48px]">
                        <strong className="text-yellow-700">{currentOffer.coupon_code}:</strong>{" "}
                        <span className="text-gray-700">{currentOffer.offer}</span>
                      </div>
                      <div className="flex justify-center mt-2 space-x-1">
                        {platformOffers.map((_, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setCurrentOfferIndexMap((prev) => ({ ...prev, [platform]: i }))
                            }
                            className={`w-2 h-2 rounded-full ${
                              i === currentIndex ? "bg-yellow-600" : "bg-yellow-300"
                            }`}
                          ></button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleBookNow(booking, index)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded-md"
                  >
                    {activeChat === index ? "Close Chat" : "Book Now"}
                  </button>

                  {activeChat === index && (
                    <div className="w-full mt-3 border-t pt-3 text-left">
                      <div className="text-sm font-semibold text-blue-600 mb-1">
                        💬 Chat with {booking.book_with || "Agent"}
                      </div>

                       {/* ✅ Scrollable chat area with auto-scroll */}
                       <div
                  ref={(el) => (chatContainerRefs.current[index] = el)} // ✅ Attach ref
                  className="bg-gray-100 rounded-md p-3 max-h-52 overflow-y-auto text-sm space-y-2"
                >
                        {(chatMessages[index] || []).map((msg, i) => (
                          <div key={i}>
  {msg.isOfferCard ? (
    <div className="bg-green-50 border border-green-300 rounded-lg p-3 my-1 shadow-sm">
      <div className="text-sm text-gray-800 font-medium">{msg.text}</div>
    </div>
  ) : (
    <div
      className={`p-2 rounded-md ${
        git
          ? 'bg-blue-200 text-right'
          : 'bg-yellow-100 text-gray-800'
      }`}
    >
      {msg.text}
    </div>
  )}
</div>

                        ))}
                        {chatLoading[index] && (
                          <div className="p-2 italic text-gray-500">
                            Agent is typing...
                          </div>
                        )}
                      </div>
                      {showOfferTypeOptions[index] && (
  <div className="mt-3 bg-gray-50 border border-gray-300 rounded-md p-3">
    <p className="text-sm font-medium mb-2">🎯 What kind of offers would you like to explore?</p>
    <div className="flex flex-col gap-1 text-sm">
      {[
        { label: "General Flight Offers", value: "general" },
        { label: "Bank ", value: "bank" },
        { label: "Coupon Offers", value: "coupon" },
      ].map(({ label, value }) => (
        <label key={value} className="flex items-center gap-2">
          <input
            type="checkbox"
            onChange={() => {
  setChatMessages(prev => ({
    ...prev,
    [index]: [
      ...(prev[index] || []),
      { from: 'user', text: label },
    ],
  }));

  // Hide offer-type checkboxes
  setShowOfferTypeOptions(prev => ({ ...prev, [index]: false }));

  // ✅ Trigger backend properly
  fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_history: [
        ...(chatMessages[index] || []).map(msg => ({
          role: msg.from === 'user' ? 'human' : 'ai',
          content: msg.text,
        })),
        { role: 'human', content: `${label}` },
      ],
    }),
  })
    .then(res => res.json())
    .then(data => {
      const replyText = data.content || "Got it!";
      setChatMessages(prev => ({
        ...prev,
        [index]: [
          ...(prev[index] || []),
          { from: 'agent', text: replyText },
        ],
      }));

      // ✅ Automatically show bank selection UI if AI mentions "select bank"
      if (
        replyText.toLowerCase().includes("select your bank") ||
        replyText.toLowerCase().includes("which bank")
      ) {
        setShowBankOptions(prev => ({ ...prev, [index]: true }));
      }
    })
    .catch(err => console.error("Offer type fetch error:", err));
}}
          />
          {label}
        </label>
      ))}
    </div>
  </div>
)}

                      {showCardOptions[index] && (
  <div className="mt-3 bg-gray-50 border border-gray-300 rounded-md p-3">
    <p className="text-sm font-medium mb-2">💳 Choose Card Type:</p>
    <div className="flex flex-col gap-1 text-sm">
      {["Credit Card", "Debit Card"].map((type) => (
        <label key={type} className="flex items-center gap-2">
          <input
            type="radio"
            name={`cardType-${index}`}
            onChange={() => {
  setSelectedCardType(prev => ({ ...prev, [index]: type }));

  const selectedBank = selectedBanks[index] || "your bank";

  // 💬 Show final message only after both bank + card type selected
  setChatMessages(prev => ({
    ...prev,
    [index]: [
      ...(prev[index] || []),
      { from: 'user', text: type },
    ],
  }));

  setShowCardOptions(prev => ({ ...prev, [index]: false }));

  // ✅ Trigger backend response after card type is selected
  fetch(process.env.NEXT_PUBLIC_BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_history: [
        ...(chatMessages[index] || []).map(msg => ({
          role: msg.from === 'user' ? 'human' : 'ai',
          content: msg.text,
        })),
        { role: 'human', content: `${selectedBank} ${type} offers` },
      ],
    }),
  })
    .then(res => res.json())
    .then(data => {
      const replyText = data.content || "Here are the latest offers!";

// 🧠 Split offers if the AI response contains numbered or line-separated offers
const offersList = replyText.split(/\d+\.\s|\n+/).filter(Boolean);

setChatMessages(prev => {
  const updatedMessages = [...(prev[index] || [])];

  if (offersList.length > 1) {
    offersList.forEach(offer => {
      updatedMessages.push({
        from: 'agent',
        text: offer.trim(),
        isOfferCard: true, // 🪄 mark these messages for card styling
      });
    });
  } else {
    updatedMessages.push({ from: 'agent', text: replyText });
  }

  return { ...prev, [index]: updatedMessages };
});

    })
    .catch(err => console.error("Offer fetch error:", err));
}}

          />
          {type}
        </label>
      ))}
    </div>
  </div>
)}
                      {/* ✅ Show bank checkboxes if needed */}
{showBankOptions[index] && (
  <div className="mt-3 bg-gray-50 border border-gray-300 rounded-md p-3">
    {/* ✅ Show Credit/Debit Card checkboxes if needed */}


    <p className="text-sm font-medium mb-2">🏦 Select your bank:</p>
    <div className="flex flex-col gap-1 text-sm">
      {["HDFC", "ICICI", "SBI", "Axis", "Kotak"].map((bank) => (
  <label key={bank} className="flex items-center gap-2">
    <input
      type="checkbox"
      onChange={() => {
  setSelectedBanks(prev => ({
    ...prev,
    [index]: bank,
  }));

  // 💬 Add message for selected bank
  setChatMessages(prev => ({
    ...prev,
    [index]: [
      ...(prev[index] || []),
      { from: 'user', text: bank },
      { from: 'agent', text: `Nice choice! Do you want to see Credit or Debit card offers for ${bank}? 💳` },
    ],
  }));

  // ✅ Hide bank checkboxes & show card options next
  setShowBankOptions(prev => ({ ...prev, [index]: false }));
  setShowCardOptions(prev => ({ ...prev, [index]: true }));
}}

    />
    {bank} Bank
  </label>
))}

    </div>
  </div>
)}

                      {/* ✅ Textarea with Enter key send */}
                <div className="flex items-center gap-2">
                  <textarea
                    value={chatInput[index] || ''}
                    onChange={(e) =>
                      setChatInput((prev) => ({
                        ...prev,
                        [index]: e.target.value,
                      }))
                    }
                    placeholder="Type your message..."
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(index, booking);
                      }
                    }}
                  ></textarea>

                  <button
                    onClick={() => handleSendMessage(index, booking)}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Send
                  </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Card>
  );
}







// 'use client';
// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
// import deals from "../app/data/deals.json";

// export default function FlightCard({ flightData, bookingOptions }) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [currentDiscount, setCurrentDiscount] = useState(0);
//   const [offers, setOffers] = useState([]);
//   const [minPrice, setMinPrice] = useState(0);
//   const [minAvailablePrice, setMinAvailablePrice] = useState(0);
//   const [maxAvailablePrice, setMaxAvailablePrice] = useState(0);
//   const [showPriceFilter, setShowPriceFilter] = useState(false);
//   const [activeChat, setActiveChat] = useState(null);
//   const [currentOfferIndexMap, setCurrentOfferIndexMap] = useState({});
//   const [sortOrder, setSortOrder] = useState("asc");

//   if (!flightData || flightData.length === 0) return null;
//   const flight = flightData[0];
//   if (!flight || typeof flight !== 'object') return null;

//   const departureAirport = flight.departure_airport || {};
//   const arrivalAirport = flight.arrival_airport || {};

//   const formatTime = (timeString) => {
//     try {
//       const date = new Date(timeString);
//       return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
//     } catch {
//       return timeString;
//     }
//   };

//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   const formatPrice = (price) =>
//     new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);

//   const fetchLatestDeals = async () => {
//     try {
//       const data = deals;
//       const platforms = bookingOptions?.map(opt => opt.together?.book_with?.toLowerCase()) || [];
//       const filteredDeals = data.deals.filter((deal) => {
//         const airlineMatch = deal.airline?.toLowerCase() === flight.airline?.toLowerCase();
//         const flightNumberMatch = deal.flight_number?.toLowerCase() === flight.flight_number?.toLowerCase();
//         const platformMatch = platforms.includes(deal.platform?.toLowerCase());
//         return airlineMatch || flightNumberMatch || platformMatch;
//       });
//       setOffers(filteredDeals);
//     } catch (err) {
//       console.error("Error loading deals:", err);
//     }
//   };

//   const handleBookNow = async (booking, index) => {
//     setActiveChat(activeChat === index ? null : index);
//     await fetchLatestDeals();
//   };

//   // 🟢 Initialize min/max prices
//   useEffect(() => {
//     if (bookingOptions?.length) {
//       const prices = bookingOptions.map((opt) => opt.together?.price || 0);
//       const minP = Math.min(...prices);
//       const maxP = Math.max(...prices);
//       setMinAvailablePrice(minP);
//       setMaxAvailablePrice(maxP);
//       setMinPrice(minP);
//     }
//   }, [bookingOptions]);

//   // 🔁 Auto-slide offers every 3s globally
//   useEffect(() => {
//     if (!offers.length) return;
//     const interval = setInterval(() => {
//       setCurrentDiscount((prev) => (prev === offers.length - 1 ? 0 : prev + 1));
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [offers]);

//   // 🟢 Auto-slide per platform offers (safe hook handling)
//   useEffect(() => {
//     const intervals = Object.entries(currentOfferIndexMap).map(([platform, index]) => {
//       const platformOffers = offers.filter(o => o.platform?.toLowerCase() === platform.toLowerCase());
//       if (platformOffers.length > 0) {
//         const interval = setInterval(() => {
//           setCurrentOfferIndexMap(prev => ({
//             ...prev,
//             [platform]: (prev[platform] + 1) % platformOffers.length,
//           }));
//         }, 3000);
//         return () => clearInterval(interval);
//       }
//     });
//     return () => intervals.forEach(clear => clear && clear());
//   }, [offers]);

//   const filteredBookings = (bookingOptions || []).filter(
//     (b) => (b.together?.price || 0) >= minPrice
//   );

//   const sortedBookings = [...filteredBookings].sort((a, b) => {
//     const priceA = a.together?.price || 0;
//     const priceB = b.together?.price || 0;
//     return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
//   });

//   return (
//     <Card className="w-full max-w-2xl mx-auto mb-4 shadow-lg">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             {flight.airline_logo && (
//               <Image src={flight.airline_logo} alt={flight.airline} width={40} height={40} className="rounded" />
//             )}
//             <div>
//               <CardTitle className="text-lg font-semibold">{flight.airline}</CardTitle>
//               <CardDescription className="text-sm text-gray-500">
//                 {flight.flight_number} • {flight.airplane}
//               </CardDescription>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-sm text-gray-500">Duration</div>
//             <div className="font-semibold">{formatDuration(flight.duration)}</div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent className="pb-3">
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-center">
//             <div className="text-2xl font-bold">{formatTime(departureAirport.time)}</div>
//             <div className="text-sm font-semibold">{departureAirport.id}</div>
//             <div className="text-xs text-gray-500">{departureAirport.name}</div>
//           </div>
//           <div className="flex-1 mx-4 relative">
//             <div className="h-0.5 bg-gray-300"></div>
//             <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">✈️</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold">{formatTime(arrivalAirport.time)}</div>
//             <div className="text-sm font-semibold">{arrivalAirport.id}</div>
//             <div className="text-xs text-gray-500">{arrivalAirport.name}</div>
//           </div>
//         </div>

//         {flight.extensions?.length > 0 && (
//           <div className="mt-3 text-xs text-gray-500 space-y-1">
//             {flight.extensions.map((ext, i) => <div key={i}>• {ext}</div>)}
//           </div>
//         )}
//       </CardContent>

//       <CardFooter className="pt-3 border-t">
//         <button
//           onClick={() => setIsExpanded(!isExpanded)}
//           className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors ${
//             !bookingOptions?.length
//               ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700 text-white'
//           }`}
//           disabled={!bookingOptions?.length}
//         >
//           {isExpanded ? 'Hide Booking Options' : `GET DEALS (${bookingOptions?.length || 0})`}
//         </button>
//       </CardFooter>

//       {isExpanded && (
//         <div className="border-t bg-gray-50 p-4">
//           {/* Filters */}
//           <div className="flex items-center justify-between mb-3">
//              <h3 className="font-semibold text-lg">Available Deals</h3>
//             {/* <button
//               onClick={() => setShowPriceFilter((p) => !p)}
//               className="flex items-center space-x-1 p-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
//             >
//               <span className="text-sm text-blue-600">💰 Min Price</span>
//             </button> */}
//             <button
//               onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
//               className="text-sm text-blue-600 hover:text-blue-800"
//             >
//               Sort by Price ({sortOrder === "asc" ? "Low → High" : "High → Low"})
//             </button>
//           </div>

//           {showPriceFilter && (
//             <div className="mb-3">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Min Price: ₹{minPrice.toLocaleString("en-IN")}
//               </label>
//               <input
//                 type="range"
//                 min={minAvailablePrice}
//                 max={maxAvailablePrice}
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(Number(e.target.value))}
//                 className="w-full accent-blue-600"
//               />
//             </div>
//           )}

//           {/* Booking Cards */}
//           {sortedBookings.map((option, index) => {
//             const booking = option.together || {};
//             const platform = booking.book_with?.toLowerCase();
//             const platformOffers = offers.filter(
//               (offer) => offer.platform?.toLowerCase() === platform
//             );

//             const currentIndex = currentOfferIndexMap[platform] || 0;
//             const currentOffer = platformOffers[currentIndex];

//             return (
//               <Card key={index} className="bg-white hover:shadow-md transition-shadow mb-3">
//                 <CardContent className="p-4 flex flex-col items-center text-center">
//                   <div className="flex items-center justify-between w-full">
//                     <div className="flex items-center space-x-3">
//                       {booking.airline_logos?.[0] && (
//                         <Image src={booking.airline_logos[0]} alt={booking.book_with} width={50} height={50} className="rounded" />
//                       )}
//                       <div className="text-left">
//                         <div className="font-semibold">{booking.book_with}</div>
//                         <div className="text-xs text-gray-500">
//                           {booking.marketed_as?.join(", ") || "Standard Fare"}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-green-600 text-lg font-bold">
//                       {booking.price ? formatPrice(booking.price) : "N/A"}
//                     </div>
//                   </div>

//                   {platformOffers.length > 0 && currentOffer && (
//                     <div className="relative w-full mt-3 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-3">
//                       <div className="text-xs text-left min-h-[48px]">
//                         <strong className="text-yellow-700">{currentOffer.coupon_code}:</strong>{" "}
//                         <span className="text-gray-700">{currentOffer.offer}</span>
//                       </div>
//                       <div className="flex justify-center mt-2 space-x-1">
//                         {platformOffers.map((_, i) => (
//                           <button
//                             key={i}
//                             onClick={() =>
//                               setCurrentOfferIndexMap((prev) => ({ ...prev, [platform]: i }))
//                             }
//                             className={`w-2 h-2 rounded-full ${
//                               i === currentIndex ? "bg-yellow-600" : "bg-yellow-300"
//                             }`}
//                           ></button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <button
//                     onClick={() => handleBookNow(booking, index)}
//                     className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded-md"
//                   >
//                     {activeChat === index ? "Close Chat" : "Book Now"}
//                   </button>

//                   {activeChat === index && (
//                     <div className="w-full mt-3 border-t pt-3 text-left">
//                       <div className="text-sm font-semibold text-blue-600 mb-1">
//                         💬 Chat with {booking.book_with || "Agent"}
//                       </div>
//                       <div className="bg-gray-100 rounded-md p-3 max-h-40 overflow-y-auto text-sm">
//                         <p className="text-gray-800 mb-2">
//                           👋 Hi! I'm {booking.book_with}. How can I help you?
//                         </p>
//                         <textarea
//                           placeholder="Type your message..."
//                           className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
//                           rows={2}
//                         ></textarea>
//                         <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded-md">
//                           Send
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//     </Card>
//   );
// }