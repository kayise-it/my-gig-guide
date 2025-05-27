// frontend/src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

/* Owners */
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard/Dashboard";

/* Public Pages */
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Venues from "./pages/Venues";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

/* Artists */
import ArtistDashboard from "./pages/Artists/dashboard";
import ArtistRegistration from "./pages/Artists/ArtistRegistration.jsx";
import Artists from "./pages/Artists.jsx";
import ShowArtist from "./pages/Public/ShowArtist";

/* Organisers */
import OrganiserDashboard from "./pages/Organiser/Dashboard.jsx";
import OrganisationProfile from "./pages/Organiser/Dashboard/OrganisationProfile";
import NewOrganiserVenue from "./pages/Organiser/Dashboard/Venues/NewOrganiserVenue";

/* Events */
import Events from "./pages/Events.jsx";
import EventRegistration from "./pages/Events/Registration.jsx";
import ViewEvents from "./pages/Events/ViewEvents.jsx";
import ViewEvent from "./pages/Events/ViewEvent.jsx";
import ShowEvent from "./pages/Public/ShowEvent.jsx";
import CreateEvent from "./pages/Organiser/CreateEvent";

/* Venues */
import ViewVenue from "./pages/Venue/ViewVenue";
import NewVenue from "./pages/Venue/NewVenue";

function App() {
  return (
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
        <Route path="/Event/Registration" element={<Layout><EventRegistration /></Layout>} />
        <Route path="/events/:id" element={<Layout><ShowEvent /></Layout>} />
        <Route path="/events/" element={<Layout><ViewEvents /></Layout>} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Artist Routes */}
        <Route path="/artists/dashboard" element={<PrivateRoute requiredRole="artist"><Layout><ArtistDashboard /></Layout></PrivateRoute>} />
        <Route path="/artists/dashboard/events/new" element={<PrivateRoute requiredRole="artist"><Layout><CreateEvent /></Layout></PrivateRoute>} />
        <Route path="/artists/dashboard/event/:id" element={<PrivateRoute requiredRole="artist"><Layout><ViewEvent /></Layout></PrivateRoute>} />
        <Route path="/artists/dashboard/venue/new" element={<PrivateRoute requiredRole="artist"><Layout><NewVenue /></Layout></PrivateRoute>} />
        <Route path="/artists/dashboard/venue/:id" element={<PrivateRoute requiredRole="artist"><Layout><ViewVenue /></Layout></PrivateRoute>} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><Layout><AdminDashboard /></Layout></PrivateRoute>} />
        <Route path="/organiser/dashboard" element={<PrivateRoute requiredRole="organiser"><Layout><OrganiserDashboard /></Layout></PrivateRoute>} />
        <Route path="/organiser/dashboard/profile" element={<PrivateRoute requiredRole="organiser"><Layout><OrganisationProfile /></Layout></PrivateRoute>} />

        <Route path="/organiser/dashboard/venues/new" element={<PrivateRoute requiredRole="organiser"><Layout><NewOrganiserVenue /></Layout></PrivateRoute>} />
        <Route path="/organiser/dashboard/events/new" element={<PrivateRoute requiredRole="organiser"><Layout><CreateEvent /></Layout></PrivateRoute>} />
        <Route path="/organiser/dashboard/event/:id" element={<PrivateRoute requiredRole="organiser"><Layout><ViewEvent /></Layout></PrivateRoute>} />
        <Route path="/organiser/dashboard/event/edit/:id" element={<PrivateRoute requiredRole="organiser"><Layout><CreateEvent /></Layout></PrivateRoute>} />
        <Route path="/organiser/profile/" element={<PrivateRoute requiredRole="organiser"><Layout><ViewEvent /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;