// frontend/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import API_BASE_URL, { APP_BASE_PATH } from './api/config'
import { AuthProvider } from './context/AuthContext';
import { VenueModalProvider } from '@/components/Venue/VenueModalContext.jsx'; // ✅ Import this
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <VenueModalProvider> {/* ✅ Wrap your app with VenueModalProvider */}
          <Router basename={APP_BASE_PATH}>
            <App />
          </Router>
        </VenueModalProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
)