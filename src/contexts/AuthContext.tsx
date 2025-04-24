import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, AuthContextType } from '../types';
import { FirebaseError } from 'firebase/app';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState<{
    login: boolean;
    register: boolean;
    logout: boolean;
    resetPassword: boolean;
    updateProfile: boolean;
  }>({
    login: false,
    register: false,
    logout: false,
    resetPassword: false,
    updateProfile: false
  });

  const handleError = (err: unknown, operation: string) => {
    const errorMessage = err instanceof Error 
      ? err.message 
      : err instanceof FirebaseError 
        ? err.message 
        : `An error occurred during ${operation}`;
    
    console.error(`Error during ${operation}:`, err);
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setOperationLoading(prev => ({ ...prev, register: true }));
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await firebaseUpdateProfile(firebaseUser, { displayName: name });
      
      const userData: Omit<User, '_firebaseUser'> = {
        id: firebaseUser.uid,
        name,
        email,
        role: 'customer'
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      setCurrentUser({
        ...userData,
        _firebaseUser: firebaseUser
      });
    } catch (err) {
      handleError(err, 'registration');
    } finally {
      setOperationLoading(prev => ({ ...prev, register: false }));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setOperationLoading(prev => ({ ...prev, login: true }));
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleError(err, 'login');
    } finally {
      setOperationLoading(prev => ({ ...prev, login: false }));
    }
  };

  const logout = async () => {
    try {
      setOperationLoading(prev => ({ ...prev, logout: true }));
      setError(null);
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      handleError(err, 'logout');
    } finally {
      setOperationLoading(prev => ({ ...prev, logout: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setOperationLoading(prev => ({ ...prev, resetPassword: true }));
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleError(err, 'password reset');
    } finally {
      setOperationLoading(prev => ({ ...prev, resetPassword: false }));
    }
  };
  
  const updateProfile = async (displayName: string) => {
    try {
      setOperationLoading(prev => ({ ...prev, updateProfile: true }));
      setError(null);
      
      if (!currentUser?._firebaseUser) {
        throw new Error('No authenticated user found');
      }

      await firebaseUpdateProfile(currentUser._firebaseUser, { displayName });
      
      const updatedUser = {
        ...currentUser,
        name: displayName
      };

      await setDoc(doc(db, 'users', currentUser.id), updatedUser, { merge: true });
      setCurrentUser(updatedUser);
    } catch (err) {
      handleError(err, 'profile update');
    } finally {
      setOperationLoading(prev => ({ ...prev, updateProfile: false }));
    }
  };

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, '_firebaseUser'>;
            if (mounted) {
              setCurrentUser({
                ...userData,
                _firebaseUser: firebaseUser
              });
            }
          } else {
            const newUser: Omit<User, '_firebaseUser'> = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'customer'
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            
            if (mounted) {
              setCurrentUser({
                ...newUser,
                _firebaseUser: firebaseUser
              });
            }
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          if (mounted) {
            setCurrentUser(null);
            setError('Failed to load user data');
          }
        }
      } else {
        if (mounted) {
          setCurrentUser(null);
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    operationLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;