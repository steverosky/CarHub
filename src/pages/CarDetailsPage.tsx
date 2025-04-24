import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Vehicle, InsuranceOption } from '../types';
import { FiUsers, FiMapPin, FiStar, FiCheck, FiTool, FiDroplet, FiSettings } from 'react-icons/fi';
import ImageGallery from '../components/cars/ImageGallery';
import ReviewForm from '../components/cars/ReviewForm';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import BookingForm from '../components/booking/BookingForm';
import { useAuth } from '../contexts/AuthContext';

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [car, setCar] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceOption | null>(null);

  const fetchCar = useCallback(async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'vehicles', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCar({ id: docSnap.id, ...docSnap.data() } as Vehicle);
      }
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">Car Not Found</h1>
          <p className="text-secondary-600 mb-8">The car you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/cars')}
            className="btn btn-primary"
          >
            Back to Cars
          </button>
        </div>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const insuranceTotal = selectedInsurance ? selectedInsurance.pricePerDay * days : 0;
    return (days * car.ratePerDay) + insuranceTotal;
  };

  const handleBooking = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }

    if (!startDate || !endDate) {
      return;
    }

    try {
      // Create booking document
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userId: currentUser.id,
        vehicleId: car.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupLocation: car.location,
        dropoffLocation: car.location,
        totalPrice: calculateTotalPrice(),
        insurance: selectedInsurance,
        status: 'booked',
        createdAt: serverTimestamp()
      });

      // Update vehicle status
      await updateDoc(doc(db, 'vehicles', car.id), {
        availabilityStatus: 'rented'
      });

      // Navigate to confirmation page
      navigate(`/bookings/${bookingRef.id}/confirm`);
    } catch (error) {
      console.error('Error creating booking:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form - Left Column */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Book This Car</h2>
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="label">Pick-up Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="input w-full"
                    placeholderText="Select pick-up date"
                    minDate={new Date()}
                  />
                </div>
                <div>
                  <label className="label">Return Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="input w-full"
                    placeholderText="Select return date"
                    minDate={startDate || new Date()}
                  />
                </div>
              </div>

              {/* Insurance Options */}
              {car.insurance && (
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">Insurance Options</h3>
                  <div className="space-y-2">
                    {car.insurance.map((option) => (
                      <div
                        key={option.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedInsurance?.id === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedInsurance(option)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-secondary-900">{option.name}</span>
                          <span className="text-blue-600">${option.pricePerDay}/day</span>
                        </div>
                        <p className="text-sm text-secondary-600 mb-2">{option.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {option.coverage.map((item, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {startDate && endDate && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Car Rental:</span>
                    <span>${car.ratePerDay} × {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                  </div>
                  {selectedInsurance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-600">Insurance ({selectedInsurance.name}):</span>
                      <span>${selectedInsurance.pricePerDay} × {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-secondary-200">
                    <span className="font-medium text-secondary-900">Total Price:</span>
                    <span className="text-xl font-bold text-primary-600">
                      ${calculateTotalPrice()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!startDate || !endDate}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Car Details - Right Column */}
        <div className="lg:col-span-2">
          {/* Car Images */}
          <ImageGallery images={car.images} alt={`${car.make} ${car.model}`} />

          {/* Car Details */}
          <div className="space-y-6 mt-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                {car.make} {car.model}
              </h1>
              <p className="text-secondary-600 mt-2">{car.year}</p>
            </div>

            <div className="flex items-center space-x-4">
              {car.rating && (
                <div className="flex items-center text-secondary-600">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span>{car.rating}</span>
                </div>
              )}
              <div className="flex items-center text-secondary-600">
                <FiUsers className="mr-1" />
                <span>{car.seats} seats</span>
              </div>
              <div className="flex items-center text-secondary-600">
                <FiMapPin className="mr-1" />
                <span>{car.location}</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-primary-600">
              ${car.ratePerDay} <span className="text-sm text-secondary-500">per day</span>
            </div>

            {/* Specifications */}
            {car.specifications && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-secondary-900 mb-3">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {car.specifications.engine && (
                    <div className="flex items-center text-secondary-600">
                      <FiTool className="mr-2" />
                      <div>
                        <p className="text-sm font-medium">Engine</p>
                        <p>{car.specifications.engine}</p>
                      </div>
                    </div>
                  )}
                  {car.specifications.horsepower && (
                    <div className="flex items-center text-secondary-600">
                      <FiSettings className="mr-2" />
                      <div>
                        <p className="text-sm font-medium">Horsepower</p>
                        <p>{car.specifications.horsepower} hp</p>
                      </div>
                    </div>
                  )}
                  {car.specifications.acceleration && (
                    <div className="flex items-center text-secondary-600">
                      <span className="mr-2">⚡</span>
                      <div>
                        <p className="text-sm font-medium">Acceleration</p>
                        <p>{car.specifications.acceleration}</p>
                      </div>
                    </div>
                  )}
                  {car.specifications.fuelEfficiency && (
                    <div className="flex items-center text-secondary-600">
                      <FiDroplet className="mr-2" />
                      <div>
                        <p className="text-sm font-medium">Fuel Efficiency</p>
                        <p>{car.specifications.fuelEfficiency}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-secondary-900">Features</h2>
              <div className="grid grid-cols-2 gap-4">
                {car.features?.map((feature, index) => (
                  <div key={index} className="flex items-center text-secondary-600">
                    <FiCheck className="text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            {car.colors && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-3">Available Colors</h2>
                <div className="flex gap-4">
                  {car.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span 
                        className="w-8 h-8 rounded-full border border-gray-200 mb-1"
                        style={{ backgroundColor: color.toLowerCase().replace(' ', '') }}
                      />
                      <span className="text-sm text-secondary-600">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-2">Description</h2>
              <p className="text-secondary-600">{car.description}</p>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary-900">Reviews</h2>
                {car.rating && (
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="font-medium">{car.rating}</span>
                    <span className="text-secondary-600 ml-1">
                      ({car.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-secondary-900 mb-4">Write a Review</h3>
                <ReviewForm 
                  carId={car.id} 
                  onReviewSubmitted={() => {
                    // Refresh the car data to show the new review
                    fetchCar();
                  }} 
                />
              </div>

              {/* Review List */}
              {car.reviews && car.reviews.length > 0 ? (
                <div className="space-y-4">
                  {car.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-secondary-900">{review.userName}</span>
                          <div className="flex items-center ml-2">
                            <FiStar className="text-yellow-400" />
                            <span className="ml-1 text-secondary-600">{review.rating}</span>
                          </div>
                        </div>
                        <span className="text-sm text-secondary-500">{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-secondary-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-500 text-center py-4">
                  No reviews yet. Be the first to review this car!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;