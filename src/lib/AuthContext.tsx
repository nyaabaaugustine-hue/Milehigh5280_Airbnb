'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  nationality?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  wishlist: string[];
  bookingHistory: BookingRecord[];
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingRecord {
  id: string;
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  date: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'milehigh_user';
const WISHLIST_KEY = 'milehigh_wishlist';
const BOOKINGS_KEY = 'milehigh_bookings';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bookingHistory, setBookingHistory] = useState<BookingRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch {
        localStorage.removeItem(WISHLIST_KEY);
      }
    }
    const storedBookings = localStorage.getItem(BOOKINGS_KEY);
    if (storedBookings) {
      try {
        setBookingHistory(JSON.parse(storedBookings));
      } catch {
        localStorage.removeItem(BOOKINGS_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      firstName: email.split('@')[0],
      lastName: '',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setLoading(false);
    return true;
  };

  const addToWishlist = (propertyId: string) => {
    const updated = [...wishlist, propertyId];
    setWishlist(updated);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  };

  const removeFromWishlist = (propertyId: string) => {
    const updated = wishlist.filter(id => id !== propertyId);
    setWishlist(updated);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  };

  const addBooking = (booking: BookingRecord) => {
    const updated = [booking, ...bookingHistory];
    setBookingHistory(updated);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateProfile,
      wishlist, addToWishlist, removeFromWishlist,
      bookingHistory,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
