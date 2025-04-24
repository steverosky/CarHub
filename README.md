# CarHub - Car Rental Management System

CarHub is a web-based car rental management system built with React, TypeScript, Firebase, and Tailwind CSS. The application enables users to browse, rent, and manage vehicles online.

## Features

### Customer Features
- Browse available cars with filtering by type, price, and location
- View detailed car information
- Book cars with pickup and drop-off details
- Manage and view booking history
- User authentication (register, login, logout)

### Admin Features
- Dashboard with key metrics
- Manage vehicles (add, edit, delete)
- View and manage bookings
- User management

## Tech Stack

- **Frontend**: React, TypeScript, React Router
- **UI Components**: Tailwind CSS
- **State Management**: React Context API
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: React Icons

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
│   ├── admin/      # Admin related components
│   ├── auth/       # Authentication components
│   ├── booking/    # Booking related components
│   ├── cars/       # Car related components
│   └── layout/     # Layout components (Header, Footer)
├── contexts/       # React Context providers
├── firebase/       # Firebase configuration
├── hooks/          # Custom React hooks
├── pages/          # Application pages
│   └── admin/      # Admin pages
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Setup and Installation

### Prerequisites
- Node.js and npm installed
- Firebase account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/steverosky/CarHub.git
   cd CarHub
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Copy content from `.env.example` and update with your Firebase credentials

4. Start the development server
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication with Email/Password provider
3. Create a Firestore database with the following collections:
   - `users`
   - `vehicles`
   - `bookings`
4. Update security rules for Firestore and Storage
5. Copy your Firebase configuration to the `.env` file

## Production Build

To build the application for production:

```
npm run build
```

You can deploy the `build` folder to Firebase Hosting or any other hosting service.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Unsplash for car images
- React and Firebase teams for their excellent documentation
