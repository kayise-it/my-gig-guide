# DynamicBreadcrumb Component Usage Examples

## Overview
The DynamicBreadcrumb component is a highly flexible breadcrumb system that can automatically generate breadcrumbs from the URL or use custom breadcrumb data. It supports multiple visual variants and follows your 60-30-10 design system.

## Basic Usage

### 1. Auto-Generated Breadcrumbs
```jsx
import DynamicBreadcrumb from '../../components/UI/DynamicBreadcrumb';

// Automatically generates breadcrumbs from current URL path
<DynamicBreadcrumb />
```

### 2. Custom Breadcrumbs
```jsx
import DynamicBreadcrumb from '../../components/UI/DynamicBreadcrumb';

<DynamicBreadcrumb
  customBreadcrumbs={[
    { label: 'Dashboard', path: '/dashboard', icon: null },
    { label: 'Events', path: '/dashboard/events', icon: null },
    { label: 'Event Name', path: '/dashboard/events/123', isLast: true }
  ]}
  showHome={true}
/>
```

## Variants

### 1. Hero Variant (for hero sections with dark backgrounds)
```jsx
import { HeroBreadcrumb } from '../../components/UI/DynamicBreadcrumb';

<HeroBreadcrumb
  customBreadcrumbs={[
    { label: 'Artists', path: '/artists' },
    { label: 'John Doe', path: '/artists/123', isLast: true }
  ]}
  showHome={true}
  className="mb-8"
/>
```

### 2. Minimal Variant (for compact spaces)
```jsx
import { MinimalBreadcrumb } from '../../components/UI/DynamicBreadcrumb';

<MinimalBreadcrumb
  customBreadcrumbs={[
    { label: 'Settings', path: '/settings' },
    { label: 'Profile', path: '/settings/profile', isLast: true }
  ]}
  showHome={false}
/>
```

### 3. Default Variant (standard glassmorphism style)
```jsx
import { DefaultBreadcrumb } from '../../components/UI/DynamicBreadcrumb';

<DefaultBreadcrumb
  autoGenerate={true}
  showHome={true}
  className="bg-white/90"
/>
```

## Advanced Usage with Hook

### Using the useBreadcrumbs Hook
```jsx
import { useBreadcrumbs } from '../../components/UI/DynamicBreadcrumb';

function MyComponent() {
  const { 
    breadcrumbs, 
    updateBreadcrumbs, 
    addBreadcrumb, 
    removeBreadcrumb, 
    clearBreadcrumbs 
  } = useBreadcrumbs();

  useEffect(() => {
    updateBreadcrumbs([
      { label: 'Custom', path: '/custom' },
      { label: 'Dynamic', path: '/custom/dynamic', isLast: true }
    ]);
  }, []);

  return (
    <DynamicBreadcrumb 
      customBreadcrumbs={breadcrumbs}
      variant="default"
    />
  );
}
```

## Props Reference

### DynamicBreadcrumb Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `customBreadcrumbs` | `array` | `null` | Array of custom breadcrumb objects |
| `showHome` | `boolean` | `true` | Whether to show home icon |
| `variant` | `string` | `'default'` | Visual variant: 'default', 'hero', 'minimal' |
| `className` | `string` | `''` | Additional CSS classes |
| `autoGenerate` | `boolean` | `true` | Auto-generate from URL when no custom breadcrumbs |

### Breadcrumb Object Structure
```jsx
{
  label: 'Display Text',        // Required: Text to display
  path: '/path/to/page',        // Required: Link destination
  icon: IconComponent,          // Optional: Heroicon component
  isLast: false                 // Optional: Mark as last item (no link)
}
```

## Styling Variants

### Hero Variant
- **Background**: Transparent (for dark hero sections)
- **Text**: White with opacity variations
- **Icons**: White themed
- **Separators**: White/40 opacity

### Minimal Variant
- **Background**: None
- **Text**: Gray scale
- **Icons**: Small size (h-3 w-3)
- **Use Case**: Compact headers, sidebars

### Default Variant
- **Background**: White with glassmorphism
- **Border**: Purple-200
- **Text**: Gray to purple on hover
- **Icons**: Standard size (h-4 w-4)
- **Use Case**: Main content areas

## Icon Mapping
The component automatically maps URL segments to appropriate icons:

- `dashboard` → CogIcon
- `events` → CalendarDaysIcon  
- `venues` → BuildingLibraryIcon
- `artists` → MusicalNoteIcon
- `users` → UsersIcon
- `profile` → UsersIcon
- `settings` → CogIcon
- `gallery` → PhotoIcon

## Integration Examples

### In ShowEvent.jsx
```jsx
<HeroBreadcrumb
  customBreadcrumbs={[
    { label: 'Events', path: '/events' },
    { label: event?.name || 'Event', path: `/event/${id}`, isLast: true }
  ]}
  showHome={true}
/>
```

### In ViewVenue.jsx
```jsx
<HeroBreadcrumb
  customBreadcrumbs={[
    { label: 'Dashboard', path: '/organiser/dashboard' },
    { label: 'Venues', path: '/organiser/dashboard/venues' },
    { label: venue?.name || 'Venue', path: `/venue/${id}`, isLast: true }
  ]}
  showHome={true}
  className="mb-8"
/>
```

### In ShowArtist.jsx
```jsx
<HeroBreadcrumb
  customBreadcrumbs={[
    { label: 'Artists', path: '/artists' },
    { label: profile?.stage_name || 'Artist', path: `/artists/${artist_id}`, isLast: true }
  ]}
  showHome={true}
  className="mb-8"
/>
```

## Benefits

1. **Consistency**: All breadcrumbs follow the same 60-30-10 design system
2. **Flexibility**: Auto-generation or complete customization
3. **Accessibility**: Proper ARIA labels and semantic HTML
4. **Responsive**: Works on all screen sizes
5. **Performance**: Optimized with proper React patterns
6. **Maintainable**: Single component for all breadcrumb needs
