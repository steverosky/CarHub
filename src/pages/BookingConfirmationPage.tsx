import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';

interface BookingDetails {
  car: {
    make: string;
    model: string;
    images: string[];
  };
  dates: {
    start: Date;
    end: Date;
  };
  totalPrice: number;
  location: string;
}

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state as BookingDetails;

  if (!bookingDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">No Booking Found</h1>
          <p className="text-secondary-600 mb-8">Please make a booking first.</p>
          <button
            onClick={() => navigate('/cars')}
            className="btn btn-primary"
          >
            Browse Cars
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="card p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-secondary-600">
            Your booking has been successfully confirmed. We've sent the details to your email.
          </p>
        </div>

        <div className="space-y-6">
          {/* Car Details */}
          <div className="flex items-center space-x-4">
            <img
              src={bookingDetails.car.images?.[0]}
              alt={`${bookingDetails.car.make} ${bookingDetails.car.model}`}
              className="w-full h-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">
                {bookingDetails.car.make} {bookingDetails.car.model}
              </h2>
              <p className="text-secondary-600">Vehicle Details</p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-center text-secondary-600">
              <FiCalendar className="text-primary-600 mr-2" />
              <span>
                {bookingDetails.dates.start.toLocaleDateString()} -{' '}
                {bookingDetails.dates.end.toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center text-secondary-600">
              <FiMapPin className="text-primary-600 mr-2" />
              <span>Pick-up Location: {bookingDetails.location}</span>
            </div>

            <div className="flex items-center text-secondary-600">
              <FiDollarSign className="text-primary-600 mr-2" />
              <span>Total Price: ${bookingDetails.totalPrice}</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-primary-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Next Steps
            </h3>
            <ul className="list-disc list-inside text-secondary-600 space-y-2">
              <li>Check your email for the booking confirmation</li>
              <li>Bring your driver's license and payment method when picking up the car</li>
              <li>Review our rental policies and terms</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={() => navigate('/cars')}
              className="btn btn-secondary flex-1"
            >
              Browse More Cars
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="btn btn-primary flex-1"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage; 