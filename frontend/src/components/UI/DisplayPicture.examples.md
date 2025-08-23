# DisplayPicture Component Usage Guide

## Overview
The `DisplayPicture` component is a reusable component for displaying images with consistent styling, fallback states, and customizable options.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `imagePath` | string | - | Path to the image (relative or absolute URL) |
| `alt` | string | 'Image' | Alt text for the image |
| `fallbackIcon` | Component | PhotoIcon | Icon to show when no image is available |
| `fallbackText` | string | 'No Image' | Text to show when no image is available |
| `className` | string | '' | Additional CSS classes for the image |
| `containerClassName` | string | '' | Additional CSS classes for the container |
| `size` | string | 'medium' | Size preset: 'small', 'medium', 'large', 'custom' |
| `onClick` | function | - | Click handler for the image |
| `showOverlay` | boolean | false | Show gradient overlay |
| `overlayText` | string | - | Text to display in overlay |
| `id` | string | - | HTML id attribute |

## Size Presets

- `small`: 64x64px (w-16 h-16)
- `medium`: 192x192px (w-48 h-48) 
- `large`: 256x256px (w-64 h-64)
- `custom`: No size constraints (use containerClassName)

## Usage Examples

### 1. Basic Usage (Venue Main Picture)
```jsx
import DisplayPicture from '../../components/UI/DisplayPicture';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

<DisplayPicture
  imagePath={venue?.main_picture}
  alt={venue?.name || 'Venue'}
  fallbackIcon={BuildingOfficeIcon}
  fallbackText="No venue photo"
  size="medium"
  id="venue-main-picture"
  showOverlay={true}
/>
```

### 2. Event Poster
```jsx
import DisplayPicture from '../../components/UI/DisplayPicture';
import { PhotoIcon } from '@heroicons/react/24/outline';

<DisplayPicture
  imagePath={event?.poster}
  alt={event?.name || 'Event'}
  fallbackIcon={PhotoIcon}
  fallbackText="No event poster"
  size="large"
  id="event-poster"
  showOverlay={true}
  overlayText="Event Poster"
/>
```

### 3. Small Thumbnail
```jsx
<DisplayPicture
  imagePath={artist?.profile_picture}
  alt={artist?.name || 'Artist'}
  size="small"
  id="artist-thumbnail"
/>
```

### 4. Custom Size with Click Handler
```jsx
<DisplayPicture
  imagePath={image.path}
  alt={image.description}
  size="custom"
  containerClassName="w-32 h-24"
  onClick={() => openImageModal(image)}
  id="gallery-image"
/>
```

### 5. With Overlay Text
```jsx
<DisplayPicture
  imagePath={venue?.main_picture}
  alt={venue?.name}
  size="medium"
  showOverlay={true}
  overlayText="Featured Venue"
  id="featured-venue"
/>
```

## Features

- **Automatic URL handling**: Handles both relative and absolute URLs
- **Error handling**: Graceful fallback when images fail to load
- **Consistent styling**: Purple theme with rounded corners and shadows
- **Responsive**: Works with different screen sizes
- **Accessible**: Proper alt text and semantic HTML
- **Customizable**: Extensive prop options for different use cases

## Image Path Handling

The component automatically handles different image path formats:

- **Full URLs**: `https://example.com/image.jpg` (used as-is)
- **Relative paths**: `/artists/1/profile.jpg` (prepends API_BASE_URL)
- **File paths**: `profile.jpg` (prepends API_BASE_URL/)

## Styling

Default styling includes:
- Rounded corners (rounded-xl)
- Purple border (border-2 border-purple-100)
- Shadow (shadow-lg)
- Object cover for proper image scaling
- Gradient fallback background
