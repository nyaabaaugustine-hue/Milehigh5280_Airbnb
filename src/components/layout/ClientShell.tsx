'use client';

import { useState, createContext, useContext, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import BookingModal from '@/components/ui/BookingModal';
import PropertyModal from '@/components/ui/PropertyModal';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { Property } from '@/types';

interface BookingContextType {
  openBooking: () => void;
  closeBooking: () => void;
  viewProperty: (property: Property) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a ClientShell');
  return context;
};

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const openBooking  = useCallback(() => setBookingOpen(true),  []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const viewProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const handleBookFromModal = useCallback(() => {
    setSelectedProperty(null);
    setBookingOpen(true);
  }, []);

  const pathname = usePathname();
  const showFooter = !pathname?.startsWith('/admin') && !pathname?.startsWith('/login') && !pathname?.startsWith('/signup');

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking, viewProperty }}>
      <Navbar onBookNow={openBooking} />
      <main>{children}</main>
      <LanguageSwitcher />
      {showFooter && <Footer />}
      <BookingModal isOpen={bookingOpen} onClose={closeBooking} />
      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBook={handleBookFromModal}
      />
      <WhatsAppButton onBookNow={openBooking} />
    </BookingContext.Provider>
  );
}
