'use client'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import deals from "../app/data/deals.json";


export default function FlightCard({ flightData, bookingOptions }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(0);
  const [offers, setOffers] = useState([]); // 🟢 fetched deals from backend
  

  if (!flightData || flightData.length === 0) {
    return null;
  }

  const flight = flightData[0];

  if (!flight || typeof flight !== 'object') {
    console.error('Invalid flight data:', flight);
    return null;
  }

  const departureAirport = flight.departure_airport || {};
  const arrivalAirport = flight.arrival_airport || {};

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      return timeString;
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // 🟢 Fetch latest deals from backend
  // const fetchLatestDeals = async () => {
  //   try {
  //     const res = await fetch('http://localhost:8000/get_latest_deals');
  //     const data = await res.json();
  //     setOffers(data.deals || []);
  //   } catch (err) {
  //     console.error('Error fetching deals:', err);
  //   }
  // };
 const fetchLatestDeals = async () => {
  try {
    const data = deals;

    // 🟡 Extract all platform names from booking options (e.g. MakeMyTrip, EaseMyTrip)
    const platforms =
      bookingOptions?.map((option) => option.together?.book_with?.toLowerCase()) || [];

    // ✅ Filter deals based on airline, flight number, OR platform match
    const filteredDeals = data.deals.filter((deal) => {
      const airlineMatch =
        deal.airline?.toLowerCase() === flight.airline?.toLowerCase();

      const flightNumberMatch =
        deal.flight_number?.toLowerCase() === flight.flight_number?.toLowerCase();

      const platformMatch = platforms.includes(deal.platform?.toLowerCase());

      return airlineMatch || flightNumberMatch || platformMatch;
    });

    setOffers(filteredDeals);
  } catch (err) {
    console.error("Error loading deals:", err);
  }
};



  // 🟢 Book Now button handler
  const handleBookNow = async (booking) => {
    if (booking.booking_request?.url) {
      window.open(booking.booking_request.url, '_blank');
    }
    await fetchLatestDeals();
  };

  // 🟢 Fetch deals when component mounts
  useEffect(() => {
    fetchLatestDeals();
  }, []);

  // 🔁 Auto-slide deals every 3 seconds
  useEffect(() => {
    if (!offers || offers.length === 0) return;
    const interval = setInterval(() => {
      setCurrentDiscount((prev) =>
        prev === offers.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [offers]);

  // ✅ Clickable dots
  const handleDotClick = (index) => {
    setCurrentDiscount(index);
  };

  const [sortOrder, setSortOrder] = useState("asc");

const sortedBookings = [...(bookingOptions || [])].sort((a, b) => {
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
              <Image 
                src={flight.airline_logo} 
                alt={flight.airline || 'Airline'}
                width={40}
                height={40}
                className="rounded"
              />
            )}
            <div>
              <CardTitle className="text-lg font-semibold">{flight.airline || 'Unknown Airline'}</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {flight.flight_number || 'N/A'} • {flight.airplane || 'Unknown Aircraft'}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-semibold">{flight.duration ? formatDuration(flight.duration) : 'N/A'}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{departureAirport.time ? formatTime(departureAirport.time) : 'N/A'}</div>
            <div className="text-sm font-semibold">{departureAirport.id || 'N/A'}</div>
            <div className="text-xs text-gray-500">{departureAirport.name || 'Unknown Airport'}</div>
          </div>
          
          <div className="flex-1 mx-4">
            <div className="relative">
              <div className="h-0.5 bg-gray-300"></div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                ✈️
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{arrivalAirport.time ? formatTime(arrivalAirport.time) : 'N/A'}</div>
            <div className="text-sm font-semibold">{arrivalAirport.id || 'N/A'}</div>
            <div className="text-xs text-gray-500">{arrivalAirport.name || 'Unknown Airport'}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Class:</span> {flight.travel_class || 'N/A'}
          </div>
          <div>
            <span className="text-gray-500">Legroom:</span> {flight.legroom || 'N/A'}
          </div>
        </div>

       {offers && offers.length > 0 ? (
  <>
    {/* ✅ Matching Deals Slider */}
    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-3 text-sm overflow-hidden relative">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          width: `${offers.length * 100}%`,
          transform: `translateX(-${currentDiscount * (100 / offers.length)}%)`,
        }}
      >
        {offers.map((offer, index) => (
      <div
        key={index}
        className="flex-shrink-0 w-full flex items-center justify-between px-4"
        style={{ flex: `0 0 ${100 / offers.length}%` }}
      >
        {/* 🔸 Left Half: Coupon + Offer Text */}
        <div className="w-1/2 text-left">
          <strong className="text-yellow-700">{offer.coupon_code}:</strong>
          <span className="text-gray-700 ml-1">{offer.offer}</span>
        </div>

        {/* 🔸 Right Half: View Button */}
        <div className="w-1/2 text-right">
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-3 rounded-md"
          >
            View Offer
          </a>
        </div>
      </div>
    ))}
  </div>
</div>

    {/* ✅ Clickable Dots */}
   {/* ✅ Fixed 3 Dots Indicator */}
<div className="flex justify-center mt-2 space-x-2">
  {Array.from({ length: 3 }).map((_, i) => {
    // Calculate what "page" of offers the current discount belongs to
    const totalPages = Math.ceil(offers.length / 3);
    const currentPage = Math.floor(currentDiscount / 3);
    const isActive = i === currentPage % totalPages;

    return (
      <button
        key={i}
        onClick={() => handleDotClick(i * 3)} // jump to that group of 3
        className={`h-2.5 w-2.5 rounded-full transition-all ${
          isActive
            ? 'bg-yellow-600 scale-125'
            : 'bg-yellow-300 hover:bg-yellow-400'
        }`}
      />
    );
  })}
</div>

  </>
) : (
  // ✅ Fallback when no deals match
  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-center text-gray-600">
    No exclusive deals available for this flight at the moment.
  </div>
)}



        {flight.extensions && flight.extensions.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 space-y-1">
              {flight.extensions.map((extension, index) => (
                <div key={index}>• {extension}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
            !bookingOptions || !Array.isArray(bookingOptions) || bookingOptions.length === 0
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={!bookingOptions || !Array.isArray(bookingOptions) || bookingOptions.length === 0}
        >
          {isExpanded ? 'Hide Booking Options' : `GET DEALS ${bookingOptions && Array.isArray(bookingOptions) ? `(${bookingOptions.length})` : '(0)'}`}
        </button>
      </CardFooter>

      {/* ✅ Deals Section */}
      {isExpanded && (
  <div className="border-t bg-gray-50 p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-lg">Available Deals</h3>

      {/* 🟢 Sort Icon Button */}
      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h8m-8 6h12"
          />
        </svg>
        Sort by Price ({sortOrder === "asc" ? "Low → High" : "High → Low"})
      </button>
    </div>

    {bookingOptions?.length ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedBookings.map((option, index) => {
          const booking = option.together || {};
          return (
            <Card
              key={index}
              className="bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                {booking.airline_logos?.[0] && (
                  <Image
                    src={booking.airline_logos[0]}
                    alt={booking.book_with || "Partner"}
                    width={60}
                    height={60}
                    className="rounded mb-2"
                  />
                )}
                <div className="font-semibold text-base">
                  {booking.book_with || "Unknown Partner"}
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {booking.marketed_as
                    ? booking.marketed_as.join(", ")
                    : "Standard Fare"}
                </div>
                <div className="text-green-600 text-lg font-bold mb-2">
                  {booking.price ? formatPrice(booking.price) : "Price N/A"}
                </div>
                <button
                  onClick={() => handleBookNow(booking)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1.5 px-4 rounded-md"
                >
                  Book Now
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-6 text-gray-500">
        No booking options available.
      </div>
    )}
  </div>
)}

    </Card>
  );
}
