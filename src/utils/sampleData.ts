import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Vehicle } from '../types';

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
        fuelType: 'Gasoline'
      },
      {
        id: 'car2',
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        type: 'SUV',
        ratePerDay: 80,
        images: [
          'https://images.unsplash.com/photo-1568844293986-ca9c5c1bc2e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1550118089-0cbc1ec95a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Los Angeles',
        description: 'The Honda CR-V offers spacious interiors and a smooth ride. Perfect for family vacations and outdoor adventures with plenty of cargo space.',
        features: ['Navigation', 'Sunroof', 'Leather Seats', 'Heated Seats', 'Hands-free Liftgate'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Gasoline'
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
        fuelType: 'Electric'
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
        fuelType: 'Gasoline'
      },
      {
        id: 'car5',
        make: 'Chevrolet',
        model: 'Corvette',
        year: 2022,
        type: 'Coupe',
        ratePerDay: 200,
        images: [
          'https://images.unsplash.com/photo-1580941542790-0bca080e5add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1560156426-906d7f93afe2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Miami',
        description: 'Experience the thrill of driving the iconic Chevrolet Corvette. This American sports car delivers exhilarating performance and head-turning style.',
        features: ['Bose Premium Audio', 'Performance Exhaust', 'Leather GT Seats', 'Head-Up Display', 'Track Mode'],
        seats: 2,
        transmission: 'automatic',
        fuelType: 'Gasoline'
      },
      {
        id: 'car6',
        make: 'Ford',
        model: 'Mustang Convertible',
        year: 2021,
        type: 'Convertible',
        ratePerDay: 130,
        images: [
          'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1533567555600-549c6afeb781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Las Vegas',
        description: 'Feel the wind in your hair with the Ford Mustang Convertible. Combining classic American muscle car performance with open-air freedom.',
        features: ['Convertible Top', 'SYNC Infotainment', 'Premium Audio', 'Backup Camera', 'Performance Package'],
        seats: 4,
        transmission: 'automatic',
        fuelType: 'Gasoline'
      },
      {
        id: 'car7',
        make: 'Jeep',
        model: 'Wrangler',
        year: 2022,
        type: 'SUV',
        ratePerDay: 95,
        images: [
          'https://images.unsplash.com/photo-1563720223185-11968770400b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1540679321839-8b77f970e2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Denver',
        description: 'Take on any terrain with the Jeep Wrangler. Built for adventure with its rugged design, removable top, and exceptional off-road capabilities.',
        features: ['4x4', 'Removable Top', 'Off-Road Tires', 'Trail Rated', 'Touchscreen Display'],
        seats: 5,
        transmission: 'manual',
        fuelType: 'Gasoline'
      },
      {
        id: 'car8',
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2021,
        type: 'Sedan',
        ratePerDay: 160,
        images: [
          'https://images.unsplash.com/photo-1506610154363-2e1a8c573d2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
          'https://images.unsplash.com/photo-1549062573-edc78a53ffa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        ],
        availabilityStatus: 'available',
        location: 'Seattle',
        description: 'Experience luxury and prestige with the Mercedes-Benz E-Class. This elegant sedan combines sophisticated design, cutting-edge technology, and exceptional comfort.',
        features: ['MBUX Infotainment', 'Leather Interior', 'Driver Assistance Package', 'Burmester Sound System', 'Ambient Lighting'],
        seats: 5,
        transmission: 'automatic',
        fuelType: 'Gasoline'
      }
    ];

    // Add vehicles to Firestore
    for (const vehicle of sampleVehicles) {
      await setDoc(doc(db, 'vehicles', vehicle.id), vehicle);
    }

    // Mark database as initialized
    await setDoc(doc(db, 'meta', 'initialized'), {
      timestamp: new Date(),
      initialized: true
    });

    console.log('Sample data created successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}; 