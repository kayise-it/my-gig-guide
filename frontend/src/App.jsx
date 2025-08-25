// frontend/src/App
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import './utils/consoleErrorFixer'; // Import error fixer utility

/* Owners */
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard/Dashboard";

/* Public Pages */
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Venues from "./pages/Venues";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

/* Artists */
import ArtistDashboard from "./pages/Artists/Dashboard";
import ArtistRegistration from "./pages/Artists/ArtistRegistration";
import Artists from "./pages/Artists";
import ShowArtist from "./pages/Public/ShowArtist";

/* Organisers */
import OrganiserDashboard from "./pages/Organiser/OrganiserDashboard.jsx";
import OrganisationProfile from "./pages/Organiser/Dashboard/OrganisationProfile";
import NewOrganiserVenue from "./pages/Organiser/Dashboard/Venues/NewOrganiserVenue";
import OrganiserVenues from "./pages/Organiser/Dashboard/Venues/Venues";

/* Events */
import Events from "./pages/Events";
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
    <GoogleMapsProvider>
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><AboutUs /></Layout>} />
        <Route path="/artists" element={<Layout><Artists /></Layout>} />
        <Route path="/Artists/:artist_id" element={<Layout><ShowArtist /></Layout>} />
        <Route path="/artist-registration" element={<Layout><ArtistRegistration /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/venues" element={<Layout><Venues /></Layout>} />
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
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><Layout><AdminDashboard /></Layout></PrivateRoute>} />
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
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;