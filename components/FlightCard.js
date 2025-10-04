'use client'
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function FlightCard({ flightData, bookingOptions }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!flightData || flightData.length === 0) {
    return null;
  }

  const flight = flightData[0]; // Assuming we're showing the first flight

  // Validate flight data structure
  if (!flight || typeof flight !== 'object') {
    console.error('Invalid flight data:', flight);
    return null;
  }

  // Ensure airport data exists with fallbacks
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
          {isExpanded ? 'Hide Booking Options' : `Show Booking Options ${bookingOptions && Array.isArray(bookingOptions) ? `(${bookingOptions.length})` : '(0)'}`}
        </button>
      </CardFooter>

      {/* Expandable Booking Options */}
      {isExpanded && (
        <div className="border-t bg-gray-50">
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-3">Booking Options</h3>
            {bookingOptions && Array.isArray(bookingOptions) && bookingOptions.length > 0 ? (
              <div className="space-y-3">
                {bookingOptions.map((option, index) => {
                  const booking = option.together || {};
                  return (
                    <Card key={index} className="p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {booking.airline_logos && booking.airline_logos[0] && (
                            <Image 
                              src={booking.airline_logos[0]} 
                              alt={booking.book_with || 'Booking partner'}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                          )}
                          <div>
                            <div className="font-semibold">{booking.book_with || 'Unknown Partner'}</div>
                            <div className="text-sm text-gray-500">
                              {booking.marketed_as ? booking.marketed_as.join(', ') : 'N/A'}
                            </div>
                            {booking.baggage_prices && booking.baggage_prices.length > 0 && (
                              <div className="text-xs text-green-600">
                                {booking.baggage_prices.join(' • ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {booking.price ? formatPrice(booking.price) : 'Price N/A'}
                          </div>
                          <button 
                            onClick={() => {
                              if (booking.booking_request?.url) {
                                window.open(booking.booking_request.url, '_blank');
                              }
                            }}
                            className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded transition-colors duration-200"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No booking options available for this flight.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
