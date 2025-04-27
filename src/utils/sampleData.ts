import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Vehicle, InsuranceOption } from '../types';

// Common insurance options for all vehicles
const insuranceOptions: InsuranceOption[] = [
  {
    id: 'basic',
    name: 'Basic Coverage',
    description: 'Essential protection for your rental',
    coverage: ['Collision Damage', 'Third Party Liability', 'Theft Protection'],
    pricePerDay: 15
  },
  {
    id: 'premium',
    name: 'Premium Coverage',
    description: 'Comprehensive protection with zero deductible',
    coverage: ['All Basic Coverage', 'Personal Accident Insurance', 'Personal Effects Coverage', 'Zero Deductible'],
    pricePerDay: 25
  }
];

export const initializeDatabase = async () => {
  try {
    console.log('Checking if sample data needs to be created...');
    
    // Check if data already exists
    const checkDoc = await getDoc(doc(db, 'meta', 'initialized'));
    if (checkDoc.exists()) {
      console.log('Database already initialized, skipping sample data creation.');
      return;
    }
    
    console.log('Creating sample data...');
    
    // Create sample vehicles
    const sampleVehicles: Vehicle[] = [
      {
        id: 'car1',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        type: 'Sedan',
        ratePerDay: 65,
        images: [
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'New York',
        description: 'The Toyota Camry is a comfortable and reliable sedan, perfect for city driving and family trips. Features excellent fuel economy and all modern amenities.',
        features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'USB Ports', 'Apple CarPlay'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.5,
        reviews: [
          {
            id: 'review1',
            userId: 'user1',
            userName: 'John D.',
            rating: 5,
            comment: 'Excellent car, very comfortable and fuel efficient.',
            date: '2025-03-15'
          }
        ],
        colors: ['Midnight Black', 'Pearl White', 'Celestial Silver'],
        mileage: 15000,
        insurance: insuranceOptions,
        amenities: ['USB Charging', 'Bluetooth Audio', 'Smart Key System'],
        specifications: {
          engine: '2.5L 4-Cylinder',
          horsepower: 203,
          acceleration: '0-60 mph in 7.5s',
          fuelEfficiency: '28 city / 39 highway'
        }
      },
      {
        id: 'car2',
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        type: 'SUV',
        ratePerDay: 80,
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Los Angeles',
        description: 'The Honda CR-V offers spacious interiors and a smooth ride. Perfect for family vacations and outdoor adventures with plenty of cargo space.',
        features: ['Navigation', 'Sunroof', 'Leather Seats', 'Heated Seats', 'Hands-free Liftgate'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.5,
        reviews: [
          {
            id: 'review2',
            userId: 'user2',
            userName: 'Sarah M.',
            rating: 4,
            comment: 'Great family car with plenty of space.',
            date: '2025-03-18'
          }
        ],
        colors: ['Crystal Black', 'Platinum White', 'Sonic Gray'],
        mileage: 20000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Wireless Charging', 'Apple CarPlay'],
        specifications: {
          engine: '1.5L Turbo',
          horsepower: 190,
          acceleration: '0-60 mph in 7.5s',
          fuelEfficiency: '28 city / 34 highway'
        }
      },
      {
        id: 'car3',
        make: 'Tesla',
        model: 'Model 3',
        year: 2022,
        type: 'Sedan',
        ratePerDay: 120,
        images: [
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'San Francisco',
        description: 'Experience the future of driving with the Tesla Model 3. Features autopilot, zero emissions, and incredible acceleration in a sleek, modern package.',
        features: ['Autopilot', 'Electric', 'Touch Screen', 'Premium Sound', 'Long Range Battery'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Electric',
        rating: 4.7,
        reviews: [
          {
            id: 'review3',
            userId: 'user3',
            userName: 'Emily R.',
            rating: 5,
            comment: 'A dream car that exceeds all expectations. Pure driving pleasure.',
            date: '2025-03-20'
          }
        ],
        colors: ['GT Silver', 'Guards Red', 'Racing Yellow'],
        mileage: 5000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Bose Surround Sound', 'Apple CarPlay'],
        specifications: {
          engine: '3.0L Twin-Turbo Flat-Six',
          horsepower: 379,
          acceleration: '0-60 mph in 4.0s',
          fuelEfficiency: '18 city / 24 highway'
        }
      },
      {
        id: 'car4',
        make: 'BMW',
        model: 'X5',
        year: 2021,
        type: 'SUV',
        ratePerDay: 150,
        images: [
          'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1549399542-7e8f2e928464?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Chicago',
        description: 'The BMW X5 combines luxury and performance in a robust SUV. Enjoy premium features, superior handling, and a spacious interior.',
        features: ['Leather Interior', 'Panoramic Sunroof', 'Premium Sound System', 'Heated/Cooled Seats', 'Advanced Driver Assistance'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.8,
        reviews: [
          {
            id: 'review4',
            userId: 'user4',
            userName: 'Daniel T.',
            rating: 5,
            comment: 'Pure luxury and comfort. The perfect executive car.',
            date: '2025-03-22'
          }
        ],
        colors: ['Obsidian Black', 'Polar White', 'Selenite Gray'],
        mileage: 18000,
        insurance: insuranceOptions,
        amenities: ['Heated/Cooled Seats', 'Premium Audio', 'Wireless Charging'],
        specifications: {
          engine: '2.0L Turbo',
          horsepower: 255,
          acceleration: '0-60 mph in 6.0s',
          fuelEfficiency: '23 city / 31 highway'
        }
      },
      {
        id: 'car5',
        make: 'Chevrolet',
        model: 'Corvette',
        year: 2022,
        type: 'Coupe',
        ratePerDay: 200,
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Miami',
        description: 'Experience the thrill of driving the iconic Chevrolet Corvette. This American sports car delivers exhilarating performance and head-turning style.',
        features: ['Bose Premium Audio', 'Performance Exhaust', 'Leather GT Seats', 'Head-Up Display', 'Track Mode'],
        seats: 2,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.8,
        reviews: [
          {
            id: 'review5',
            userId: 'user5',
            userName: 'Mike T.',
            rating: 5,
            comment: 'Incredible performance and handling. A true American sports car.',
            date: '2025-03-22'
          }
        ],
        colors: ['Arctic White', 'Black', 'Rapid Blue'],
        mileage: 10000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Premium Audio', 'Performance Data Recorder'],
        specifications: {
          engine: '6.2L V8',
          horsepower: 495,
          acceleration: '0-60 mph in 2.9s',
          fuelEfficiency: '15 city / 27 highway'
        }
      },
      {
        id: 'car6',
        make: 'Ford',
        model: 'Mustang Convertible',
        year: 2021,
        type: 'Convertible',
        ratePerDay: 130,
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Las Vegas',
        description: 'Feel the wind in your hair with the Ford Mustang Convertible. Combining classic American muscle car performance with open-air freedom.',
        features: ['Convertible Top', 'SYNC Infotainment', 'Premium Audio', 'Backup Camera', 'Performance Package'],
        seats: 4,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.7,
        reviews: [
          {
            id: 'review6',
            userId: 'user6',
            userName: 'Lisa P.',
            rating: 5,
            comment: 'Perfect for cruising the strip with the top down!',
            date: '2025-03-25'
          }
        ],
        colors: ['Race Red', 'Oxford White', 'Shadow Black'],
        mileage: 15000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Premium Audio', 'Convertible Top'],
        specifications: {
          engine: '2.3L EcoBoost',
          horsepower: 310,
          acceleration: '0-60 mph in 5.2s',
          fuelEfficiency: '21 city / 32 highway'
        }
      },
      {
        id: 'car7',
        make: 'Jeep',
        model: 'Wrangler',
        year: 2022,
        type: 'SUV',
        ratePerDay: 95,
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Denver',
        description: 'Take on any terrain with the Jeep Wrangler. Built for adventure with its rugged design, removable top, and exceptional off-road capabilities.',
        features: ['4x4', 'Removable Top', 'Off-Road Tires', 'Trail Rated', 'Touchscreen Display'],
        seats: 5,
        transmission: 'manual',
        fuelType: 'Petrol',
        rating: 4.6,
        reviews: [
          {
            id: 'review7',
            userId: 'user7',
            userName: 'Tom R.',
            rating: 5,
            comment: 'The ultimate off-road vehicle. Handles mountain trails with ease.',
            date: '2025-03-28'
          }
        ],
        colors: ['Sting-Gray', 'Bright White', 'Firecracker Red'],
        mileage: 12000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Premium Audio', 'Removable Top'],
        specifications: {
          engine: '3.6L V6',
          horsepower: 285,
          acceleration: '0-60 mph in 7.5s',
          fuelEfficiency: '17 city / 23 highway'
        }
      },
      {
        id: 'car8',
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2021,
        type: 'Sedan',
        ratePerDay: 160,
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Seattle',
        description: 'Experience luxury and prestige with the Mercedes-Benz E-Class. This elegant sedan combines sophisticated design, cutting-edge technology, and exceptional comfort.',
        features: ['MBUX Infotainment', 'Leather Interior', 'Driver Assistance Package', 'Burmester Sound System', 'Ambient Lighting'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.8,
        reviews: [
          {
            id: 'review8',
            userId: 'user8',
            userName: 'Emma S.',
            rating: 5,
            comment: 'Pure luxury and comfort. The perfect executive car.',
            date: '2025-03-30'
          }
        ],
        colors: ['Obsidian Black', 'Polar White', 'Selenite Gray'],
        mileage: 18000,
        insurance: insuranceOptions,
        amenities: ['Heated/Cooled Seats', 'Premium Audio', 'Wireless Charging'],
        specifications: {
          engine: '2.0L Turbo',
          horsepower: 255,
          acceleration: '0-60 mph in 6.0s',
          fuelEfficiency: '23 city / 31 highway'
        }
      },
      {
        id: 'car9',
        make: 'Porsche',
        model: '911 Carrera',
        year: 2023,
        type: 'Coupe',
        ratePerDay: 350,
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Los Angeles',
        description: 'Experience the pinnacle of sports car engineering with the iconic Porsche 911 Carrera. Combines stunning performance with everyday usability.',
        features: ['Sport Chrono Package', 'PDK Transmission', 'PASM Sport Suspension', 'Sport Exhaust System'],
        seats: 4,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.9,
        reviews: [
          {
            id: 'review9',
            userId: 'user5',
            userName: 'Michael R.',
            rating: 5,
            comment: 'A dream car that exceeds all expectations. Pure driving pleasure.',
            date: '2025-04-01'
          }
        ],
        colors: ['GT Silver', 'Guards Red', 'Racing Yellow'],
        mileage: 5000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Bose Surround Sound', 'Apple CarPlay'],
        specifications: {
          engine: '3.0L Twin-Turbo Flat-Six',
          horsepower: 379,
          acceleration: '0-60 mph in 4.0s',
          fuelEfficiency: '18 city / 24 highway'
        }
      },
      {
        id: 'car10',
        make: 'Range Rover',
        model: 'Sport',
        year: 2023,
        type: 'SUV',
        ratePerDay: 250,
        images: [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1606664515946-2106d53a5c8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Miami',
        description: 'Luxury meets capability in the Range Rover Sport. Perfect for both urban adventures and off-road excursions.',
        features: ['Terrain Response 2', 'Air Suspension', 'Panoramic Roof', 'Meridian Sound System'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.7,
        reviews: [
          {
            id: 'review10',
            userId: 'user6',
            userName: 'Sarah L.',
            rating: 5,
            comment: 'The perfect blend of luxury and capability. Handled everything perfectly.',
            date: '2025-03-28'
          }
        ],
        colors: ['Santorini Black', 'Fuji White', 'Byron Blue'],
        mileage: 8000,
        insurance: insuranceOptions,
        amenities: ['Heated/Cooled Seats', 'Wireless Charging', 'Head-Up Display'],
        specifications: {
          engine: '3.0L I6 MHEV',
          horsepower: 355,
          acceleration: '0-60 mph in 5.9s',
          fuelEfficiency: '19 city / 26 highway'
        }
      },
      {
        id: 'car11',
        make: 'Audi',
        model: 'A4',
        year: 2023,
        type: 'Sedan',
        ratePerDay: 110,
        images: [
          'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Boston',
        description: 'The Audi A4 combines luxury and performance in a sophisticated package. Features advanced technology and premium comfort.',
        features: ['Virtual Cockpit', 'MMI Navigation', 'Leather Seats', 'Bose Sound System', 'Driver Assistance'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.6,
        reviews: [
          {
            id: 'review11',
            userId: 'user7',
            userName: 'David K.',
            rating: 5,
            comment: 'Luxurious and sporty at the same time. Perfect for business trips.',
            date: '2025-03-20'
          }
        ],
        colors: ['Daytona Gray', 'Glacier White', 'Navarra Blue'],
        mileage: 12000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Wireless Charging', 'Apple CarPlay'],
        specifications: {
          engine: '2.0L TFSI',
          horsepower: 261,
          acceleration: '0-60 mph in 5.2s',
          fuelEfficiency: '24 city / 31 highway'
        }
      },
      {
        id: 'car12',
        make: 'Volkswagen',
        model: 'ID.4',
        year: 2023,
        type: 'SUV',
        ratePerDay: 95,
        images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Portland',
        description: 'The Volkswagen ID.4 is a fully electric SUV that offers impressive range and modern technology in a spacious package.',
        features: ['Electric Drive', 'Panoramic Roof', 'Digital Cockpit', 'Wireless Charging', 'Driver Assistance'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Electric',
        rating: 4.7,
        reviews: [
          {
            id: 'review12',
            userId: 'user8',
            userName: 'Emma S.',
            rating: 5,
            comment: 'Great electric SUV with plenty of space and impressive range.',
            date: '2025-03-25'
          }
        ],
        colors: ['Moonstone Gray', 'Pure White', 'Kings Red'],
        mileage: 8000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Wireless Charging', 'Apple CarPlay'],
        specifications: {
          engine: 'Electric Motor',
          horsepower: 201,
          acceleration: '0-60 mph in 7.5s',
          fuelEfficiency: '260 miles range'
        }
      },
      {
        id: 'car13',
        make: 'Subaru',
        model: 'Outback',
        year: 2023,
        type: 'SUV',
        ratePerDay: 85,
        images: [
          'https://images.unsplash.com/photo-1563720223185-11968770400b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1540679321839-8b77f970e2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Seattle',
        description: 'The Subaru Outback is a rugged yet comfortable SUV perfect for outdoor adventures and daily commuting.',
        features: ['All-Wheel Drive', 'EyeSight Safety', 'X-Mode', 'Roof Rails', 'Driver Assistance'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.5,
        reviews: [
          {
            id: 'review13',
            userId: 'user9',
            userName: 'James W.',
            rating: 4,
            comment: 'Great for outdoor activities and bad weather conditions.',
            date: '2025-03-30'
          }
        ],
        colors: ['Magnetite Gray', 'Crystal White', 'Autumn Green'],
        mileage: 10000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Roof Rails', 'All-Weather Mats'],
        specifications: {
          engine: '2.5L Boxer',
          horsepower: 182,
          acceleration: '0-60 mph in 8.5s',
          fuelEfficiency: '26 city / 33 highway'
        }
      },
      {
        id: 'car14',
        make: 'Lexus',
        model: 'RX 350',
        year: 2023,
        type: 'SUV',
        ratePerDay: 140,
        images: [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1606664515946-2106d53a5c8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Dallas',
        description: 'The Lexus RX 350 offers luxury, comfort, and reliability in a premium SUV package.',
        features: ['Luxury Interior', 'Mark Levinson Audio', 'Panoramic Roof', 'Heated/Cooled Seats', 'Safety System+'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Petrol',
        rating: 4.8,
        reviews: [
          {
            id: 'review14',
            userId: 'user10',
            userName: 'Sophia L.',
            rating: 5,
            comment: 'Luxurious and comfortable ride with excellent safety features.',
            date: '2025-04-05'
          }
        ],
        colors: ['Atomic Silver', 'Eminent White', 'Nori Green'],
        mileage: 15000,
        insurance: insuranceOptions,
        amenities: ['Heated/Cooled Seats', 'Premium Audio', 'Wireless Charging'],
        specifications: {
          engine: '3.5L V6',
          horsepower: 295,
          acceleration: '0-60 mph in 7.7s',
          fuelEfficiency: '20 city / 27 highway'
        }
      },
      {
        id: 'car15',
        make: 'Mazda',
        model: 'MX-5 Miata',
        year: 2023,
        type: 'Convertible',
        ratePerDay: 120,
        images: [
          'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1533567555600-549c6afeb781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'San Diego',
        description: 'The Mazda MX-5 Miata is a fun-to-drive convertible that offers pure driving pleasure and excellent handling.',
        features: ['Convertible Top', 'Bose Audio', 'Heated Seats', 'Blind Spot Monitoring', 'Rear Cross Traffic Alert'],
        seats: 2,
        transmission: 'manual',
        fuelType: 'Petrol',
        rating: 4.9,
        reviews: [
          {
            id: 'review15',
            userId: 'user11',
            userName: 'Alex R.',
            rating: 5,
            comment: 'Incredibly fun to drive! Perfect for coastal roads.',
            date: '2025-04-10'
          }
        ],
        colors: ['Soul Red Crystal', 'Machine Gray', 'Snowflake White'],
        mileage: 5000,
        insurance: insuranceOptions,
        amenities: ['Heated Seats', 'Premium Audio', 'Convertible Top'],
        specifications: {
          engine: '2.0L Skyactiv-G',
          horsepower: 181,
          acceleration: '0-60 mph in 6.5s',
          fuelEfficiency: '26 city / 34 highway'
        }
      }
    ];
    
    // Create vehicles in Firestore
    for (const vehicle of sampleVehicles) {
      await setDoc(doc(db, 'vehicles', vehicle.id), vehicle);
      console.log(`Created vehicle: ${vehicle.make} ${vehicle.model}`);
    }
    
    // Mark database as initialized
    await setDoc(doc(db, 'meta', 'initialized'), {
      initialized: true,
      timestamp: new Date().toISOString()
    });
    
    console.log('Sample data created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};