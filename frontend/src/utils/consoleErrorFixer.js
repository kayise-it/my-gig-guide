// Utility to help identify and fix common console errors
export const consoleErrorFixer = {
  // Check for common localStorage issues
  checkLocalStorage: () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (user) {
        JSON.parse(user); // Test if valid JSON
      }
      
      return { valid: true, message: 'localStorage is working correctly' };
    } catch (error) {
      console.error('localStorage error detected:', error);
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { valid: false, message: 'localStorage had invalid data, cleared' };
    }
  },

  // Check for API connectivity
  checkAPI: async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      if (response.ok) {
        return { valid: true, message: 'API is accessible' };
      } else {
        return { valid: false, message: `API returned status: ${response.status}` };
      }
    } catch (error) {
      return { valid: false, message: `API connection failed: ${error.message}` };
    }
  },

  // Check for Google Maps API key
  checkGoogleMapsKey: () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
      return { valid: false, message: 'Google Maps API key not configured' };
    }
    return { valid: true, message: 'Google Maps API key is configured' };
  },

  // Run all checks
  runAllChecks: async () => {
    console.log('🔍 Running console error checks...');
    
    const results = {
      localStorage: consoleErrorFixer.checkLocalStorage(),
      api: await consoleErrorFixer.checkAPI(),
      googleMaps: consoleErrorFixer.checkGoogleMapsKey()
    };

    console.log('📊 Check Results:', results);
    
    const issues = Object.entries(results).filter(([key, result]) => !result.valid);
    
    if (issues.length > 0) {
      console.warn('⚠️ Issues found:', issues);
      console.log('💡 To fix these issues:');
      console.log('1. For localStorage: Clear browser data or refresh page');
      console.log('2. For API: Ensure backend is running on port 3001');
      console.log('3. For Google Maps: Add VITE_GOOGLE_MAPS_API_KEY to .env file');
    } else {
      console.log('✅ All checks passed!');
    }

    return results;
  }
};

// Auto-run checks in development
if (import.meta.env.MODE === 'development') {
  // Run checks after a short delay to ensure app is loaded
  setTimeout(() => {
    consoleErrorFixer.runAllChecks();
  }, 2000);
}

export default consoleErrorFixer;


