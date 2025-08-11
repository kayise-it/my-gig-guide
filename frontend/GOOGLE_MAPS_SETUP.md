# Google Maps Integration Setup

## Current Status
✅ Google Maps component created and integrated
🔧 **Action Required:** Add your Google Maps API key

## Steps to Enable Google Maps

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Maps Embed API" and "Maps JavaScript API"
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Update the Component
In `frontend/src/components/GoogleMapComponent.jsx`, replace:
```javascript
const getGoogleMapsEmbedUrl = (address) => {
    if (!address) return null;
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}&zoom=15&maptype=roadmap`;
};
```

With your actual API key:
```javascript
const getGoogleMapsEmbedUrl = (address) => {
    if (!address) return null;
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_ACTUAL_API_KEY&q=${encodedAddress}&zoom=15&maptype=roadmap`;
};
```

### 3. Uncomment the Iframe
In the same component, uncomment this section:
```javascript
<iframe
    src={embedUrl}
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title={`Map showing ${venue.name}`}
></iframe>
```

And remove the placeholder div.

### 4. Environment Variables (Recommended)
For better security, use environment variables:

1. Add to `.env`:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

2. Update the component:
```javascript
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

## Current Features
- 🎨 Beautiful styled placeholder with animated pin
- 📍 Venue information display
- 🗺️ Grid background with corner decorations
- 🔗 "Get Directions" button (opens Google Maps)
- 📱 Responsive design
- 🎯 Ready for API integration

## Security Notes
- Always restrict your API key to specific domains
- Monitor API usage to avoid unexpected charges
- Consider using environment variables for the API key
