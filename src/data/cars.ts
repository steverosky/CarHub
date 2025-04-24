export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: 'Sedan' | 'SUV' | 'Sports' | 'Luxury' | 'Electric' | 'Van';
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: number;
  pricePerDay: number;
  rating: number;
  imageUrl: string;
  features: string[];
  description: string;
  location: string;
  availability: boolean;
}

export const cars: Car[] = [
  {
    id: '1',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    type: 'Electric',
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 150,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Autopilot', '360° Camera', 'Premium Sound System', 'Wireless Charging', 'Panoramic Roof'],
    description: 'Experience the future of driving with the Tesla Model S. This all-electric luxury sedan offers incredible performance, cutting-edge technology, and zero emissions.',
    location: 'New York',
    availability: true
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X5',
    year: 2023,
    type: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 7,
    pricePerDay: 120,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Adaptive Cruise Control', 'Heated Seats', 'Premium Package', 'Navigation System', 'Parking Assistant'],
    description: 'The BMW X5 combines luxury, performance, and versatility in a premium SUV package. Perfect for both city driving and weekend adventures.',
    location: 'Los Angeles',
    availability: true
  },
  {
    id: '3',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    type: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 100,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['MBUX Infotainment', 'Ambient Lighting', 'Premium Sound', 'Driver Assistance', 'Keyless Go'],
    description: 'The Mercedes-Benz C-Class offers a perfect blend of luxury and performance. Experience premium comfort and advanced technology in this elegant sedan.',
    location: 'Chicago',
    availability: true
  },
  {
    id: '4',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2023,
    type: 'Sports',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 4,
    pricePerDay: 250,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Sports Chrono Package', 'Premium Sound', 'Performance Tires', 'Sport Exhaust', 'PDK Transmission'],
    description: 'The iconic Porsche 911 Carrera delivers exhilarating performance and timeless design. Experience the thrill of driving a true sports car.',
    location: 'Miami',
    availability: true
  },
  {
    id: '5',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    type: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    pricePerDay: 80,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Safety Sense', 'Apple CarPlay', 'Android Auto', 'All-Wheel Drive', 'Power Liftgate'],
    description: 'The Toyota RAV4 Hybrid combines efficiency with versatility. Perfect for families and outdoor enthusiasts.',
    location: 'Seattle',
    availability: true
  },
  {
    id: '6',
    make: 'Honda',
    model: 'Odyssey',
    year: 2023,
    type: 'Van',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 8,
    pricePerDay: 90,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Magic Slide Seats', 'Honda Sensing', 'CabinWatch', 'CabinTalk', 'Power Sliding Doors'],
    description: 'The Honda Odyssey is the perfect family van with innovative features and comfortable seating for up to 8 passengers.',
    location: 'Boston',
    availability: true
  },
  {
    id: '7',
    make: 'Audi',
    model: 'e-tron',
    year: 2023,
    type: 'Electric',
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    pricePerDay: 130,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Virtual Cockpit', 'MMI Touch', 'Quattro AWD', 'Premium Sound', 'Wireless Charging'],
    description: 'The Audi e-tron combines luxury with electric performance. Experience the future of premium electric SUVs.',
    location: 'San Francisco',
    availability: true
  },
  {
    id: '8',
    make: 'Lexus',
    model: 'RX',
    year: 2023,
    type: 'Luxury',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    pricePerDay: 110,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    features: ['Lexus Safety System+', 'Premium Sound', 'Heated Seats', 'Navigation', 'Panoramic Roof'],
    description: 'The Lexus RX offers luxury, comfort, and reliability in a stylish SUV package.',
    location: 'Dallas',
    availability: true
  }
]; 