import Header from './Header/Header';
import Footer from './Footer/Footer';
import VenueModal from '@/components/Venue/VenueModal'; // ✅ Added

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <VenueModal /> {/* ✅ This makes the modal work on any page */}
    </div>
  );
}