import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  _firebaseUser?: FirebaseUser;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'SUV' | 'Sedan' | 'Coupe' | 'Truck' | 'Van' | 'Convertible';
  ratePerDay: number;
  images: string[];
  availabilityStatus: 'available' | 'maintenance' | 'rented';
  location: string;
  description?: string;
  features?: string[];
  seats?: number;
  transmission?: 'automatic' | 'manual';
  fuelType?: string;
  // New fields
  rating?: number;
  reviews?: Review[];
  colors?: string[];
  mileage?: number;
  insurance?: InsuranceOption[];
  amenities?: string[];
  specifications?: {
    engine?: string;
    horsepower?: number;
    acceleration?: string;
    fuelEfficiency?: string;
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface InsuranceOption {
  id: string;
  name: string;
  description: string;
  coverage: string[];
  pricePerDay: number;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'booked' | 'cancelled' | 'completed';
  pickupLocation: string;
  dropoffLocation: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  paymentDate: string;
  method: 'credit_card' | 'debit_card' | 'paypal';
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  operationLoading: {
    login: boolean;
    register: boolean;
    logout: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
  };
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (displayName: string) => Promise<void>;
}