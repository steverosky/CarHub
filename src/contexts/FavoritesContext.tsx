import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc, collection, query, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { Vehicle } from '../types';
import toast from 'react-hot-toast';

interface FavoritesContextType {
  favorites: Vehicle[];
  loading: boolean;
  favoritesCount: number;
  addToFavorites: (vehicle: Vehicle) => Promise<void>;
  removeFromFavorites: (vehicleId: string) => Promise<void>;
  isFavorite: (vehicleId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser?.email) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userFavoritesRef = collection(db, `users/${currentUser.email}/favorites`);
        const favoritesSnapshot = await getDocs(userFavoritesRef);
        
        const favoriteVehicles: Vehicle[] = [];
        for (const doc of favoritesSnapshot.docs) {
          const vehicleRef = doc.data().vehicleRef;
          const vehicleDoc = await getDoc(vehicleRef);
          if (vehicleDoc.exists()) {
            const data = vehicleDoc.data() as DocumentData;
            favoriteVehicles.push({ id: vehicleDoc.id, ...data } as Vehicle);
          }
        }
        
        setFavorites(favoriteVehicles);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const addToFavorites = async (vehicle: Vehicle) => {
    if (!currentUser?.email) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      const favoriteRef = doc(db, `users/${currentUser.email}/favorites/${vehicle.id}`);
      const vehicleRef = doc(db, 'vehicles', vehicle.id);
      await setDoc(favoriteRef, {
        vehicleRef,
        addedAt: new Date().toISOString()
      });
      setFavorites(prev => [...prev, vehicle]);
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
      throw error;
    }
  };

  const removeFromFavorites = async (vehicleId: string) => {
    if (!currentUser?.email) return;

    try {
      const favoriteRef = doc(db, `users/${currentUser.email}/favorites/${vehicleId}`);
      await deleteDoc(favoriteRef);
      setFavorites(prev => prev.filter(fav => fav.id !== vehicleId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
      throw error;
    }
  };

  const isFavorite = (vehicleId: string) => {
    return favorites.some(fav => fav.id === vehicleId);
  };

  const value = {
    favorites,
    loading,
    favoritesCount: favorites.length,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};