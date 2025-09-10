// frontend/src/App
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import MajestyRoute from './components/MajestyRoute';
import Layout from './components/Layout';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import { Toaster } from 'react-hot-toast';
import './utils/consoleErrorFixer'; // Import error fixer utility

/* Owners */
import AdminDashboard from "./pages/AdminDashboard";
import MajestyLogin from "./pages/MajestyLogin";
import AdminUsers from "./pages/admin/Users";
import AdminArtists from "./pages/admin/Artists";
import AdminOrganisers from "./pages/admin/Organisers";
import AdminVenues from "./pages/admin/Venues";
import AdminEvents from "./pages/admin/Events";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminPaidFeatures from "./pages/admin/PaidFeatures";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserCreateEvent from "./pages/Dashboard/CreateEvent";
import UserEditEvent from "./pages/Dashboard/EditEvent";

/* Public Pages */
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PublicVenues from "./pages/Venues";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

/* Artists */
import ArtistDashboard from "./pages/Artists/Dashboard";
import ArtistRegistration from "./pages/Artists/ArtistRegistration";
import PublicArtists from "./pages/Artists";
import ShowArtist from "./pages/Public/ShowArtist";

/* Organisers */
import OrganiserDashboard from "./pages/Organiser/OrganiserDashboard.jsx";
import OrganisationProfile from "./pages/Organiser/Dashboard/OrganisationProfile";
import NewOrganiserVenue from "./pages/Organiser/Dashboard/Venues/NewOrganiserVenue";
import OrganiserVenues from "./pages/Organiser/Dashboard/Venues/Venues";

/* Events */
import PublicEvents from "./pages/Events";
import EventRegistration from "./pages/Events/Registration";
import ViewEvents from "./pages/Events/ViewEvents";
import ShowEvent from "./pages/Public/ShowEvent";
import CreateEvent from "./pages/Organiser/CreateEvent";

/* Venues */
import ViewVenue from "./pages/Venue/ViewVenue";
import NewVenue from "./pages/Venue/NewVenue";
/* Organiser Venues */
import EditVenue from "./pages/Organiser/Dashboard/Venues/EditVenue";
import GalleryTest from "./components/GalleryTest";
import RatingDemo from "./pages/RatingDemo";

function App() {
  return (
    <>
      <GoogleMapsProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><AboutUs /></Layout>} />
          <Route path="/artists" element={<Layout><PublicArtists /></Layout>} />
          <Route path="/Artists/:artist_id" element={<Layout><ShowArtist /></Layout>} />
          <Route path="/artist-registration" element={<Layout><ArtistRegistration /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/events" element={<Layout><PublicEvents /></Layout>} />
          <Route path="/venues" element={<Layout><PublicVenues /></Layout>} />
          <Route path="/venue/:id" element={<Layout><ViewVenue /></Layout>} />
          <Route path="/Event/Registration" element={<Layout><EventRegistration /></Layout>} />
          <Route path="/events/:id" element={<Layout><ShowEvent /></Layout>} />
          <Route path="/events/" element={<Layout><ViewEvents /></Layout>} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Artist Routes */}
          <Route path="/artists/dashboard" element={<PrivateRoute requiredRole="artist"><Layout><ArtistDashboard /></Layout></PrivateRoute>} />
          <Route path="/artists/dashboard/events/new" element={<PrivateRoute requiredRole="artist"><Layout><CreateEvent /></Layout></PrivateRoute>} />
          <Route path="/artists/dashboard/event/:id" element={<PrivateRoute requiredRole="artist"><Layout><ShowEvent /></Layout></PrivateRoute>} />
          <Route path="/artists/dashboard/venue/new" element={<PrivateRoute requiredRole="artist"><Layout><NewVenue /></Layout></PrivateRoute>} />
          <Route path="/artists/dashboard/venue/:id" element={<PrivateRoute requiredRole="artist"><Layout><ViewVenue /></Layout></PrivateRoute>} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          {/* User Dashboard Routes */}
          <Route path="/user/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
          <Route path="/user/dashboard/create-event" element={<PrivateRoute><Layout><UserCreateEvent /></Layout></PrivateRoute>} />
          <Route path="/user/dashboard/event/:id" element={<PrivateRoute><Layout><ShowEvent /></Layout></PrivateRoute>} />
          <Route path="/user/dashboard/edit-event/:id" element={<PrivateRoute><Layout><UserEditEvent /></Layout></PrivateRoute>} />
          <Route path="/majesty-login" element={<MajestyLogin />} />
          <Route path="/admin" element={<MajestyRoute><AdminDashboard /></MajestyRoute>} />
          <Route path="/admin/users" element={<MajestyRoute><AdminUsers /></MajestyRoute>} />
          <Route path="/admin/artists" element={<MajestyRoute><AdminArtists /></MajestyRoute>} />
          <Route path="/admin/organisers" element={<MajestyRoute><AdminOrganisers /></MajestyRoute>} />
          <Route path="/admin/venues" element={<MajestyRoute><AdminVenues /></MajestyRoute>} />
          <Route path="/admin/events" element={<MajestyRoute><AdminEvents /></MajestyRoute>} />
          <Route path="/admin/analytics" element={<MajestyRoute><AdminAnalytics /></MajestyRoute>} />
          <Route path="/admin/paid-features" element={<MajestyRoute><AdminPaidFeatures /></MajestyRoute>} />
          <Route path="/organiser/dashboard" element={<PrivateRoute requiredRole="organiser"><Layout><OrganiserDashboard /></Layout></PrivateRoute>} />
          <Route path="/organiser/dashboard/profile" element={<PrivateRoute requiredRole="organiser"><Layout><OrganisationProfile /></Layout></PrivateRoute>} />

          <Route path="/organiser/dashboard/venues" element={<PrivateRoute requiredRole="organiser"><Layout><OrganiserVenues /></Layout></PrivateRoute>} />
          <Route path="/organiser/dashboard/venues/:id" element={<PrivateRoute requiredRole="organiser"><Layout><ViewVenue /></Layout></PrivateRoute>} />
          <Route path="/organiser/dashboard/venues/edit/:id" element={<PrivateRoute requiredRole="organiser"><Layout><EditVenue /></Layout></PrivateRoute>} />
          <Route path="/organiser/dashboard/venues/new" element={<PrivateRoute requiredRole="organiser"><Layout><NewOrganiserVenue /></Layout></PrivateRoute>} />
          <Route path="/organiser/dashboard/events/new" element={<PrivateRoute requiredRole="organiser"><Layout><CreateEvent /></Layout></PrivateRoute>} />
          <Route path="/organisers/dashboard/event/:id" element={<PrivateRoute requiredRole="organiser"><Layout><ShowEvent /></Layout></PrivateRoute>} />
          <Route path="/organiser/dashboard/event/edit/:id" element={<PrivateRoute requiredRole="organiser"><Layout><CreateEvent /></Layout></PrivateRoute>} />
          <Route path="/organiser/profile/" element={<PrivateRoute requiredRole="organiser"><Layout><ShowEvent /></Layout></PrivateRoute>} />
          
          {/* Test Routes */}
          <Route path="/gallery-test" element={<Layout><GalleryTest /></Layout>} />
          <Route path="/rating-demo" element={<Layout><RatingDemo /></Layout>} />
        </Routes>
      </GoogleMapsProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;