// frontend/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { VenueModalProvider } from '@/components/Venue/VenueModalContext.jsx'; // ✅ Import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <VenueModalProvider> {/* ✅ Wrap your app with VenueModalProvider */}
        <App />
      </VenueModalProvider>
    </AuthProvider>
  </StrictMode>
)