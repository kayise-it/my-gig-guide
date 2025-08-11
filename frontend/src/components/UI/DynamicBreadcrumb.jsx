// frontend/src/components/UI/DynamicBreadcrumb.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChevronRightIcon,
  BuildingLibraryIcon,
  MusicalNoteIcon,
  CalendarDaysIcon,
  UsersIcon,
  UserGroupIcon,
  CogIcon,
  DocumentTextIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const DynamicBreadcrumb = ({ 
  customBreadcrumbs = null, 
  showHome = true, 
  variant = 'default', // 'default', 'hero', 'minimal'
  className = '',
  autoGenerate = true
}) => {
  const location = useLocation();
  
  // Icon mapping for different page types
  const iconMap = {
    'dashboard': CogIcon,
    'events': CalendarDaysIcon,
    'venues': BuildingLibraryIcon,
    'artists': MusicalNoteIcon,
    'organisers': UserGroupIcon,
    'organiser': UserGroupIcon,
    'users': UsersIcon,
    'profile': UsersIcon,
    'settings': CogIcon,
    'gallery': PhotoIcon,
    'posts': DocumentTextIcon,
    'edit': CogIcon,
    'new': DocumentTextIcon,
    'create': DocumentTextIcon,
    'view': PhotoIcon
  };

  // Auto-generate breadcrumbs from URL path if not provided
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) return customBreadcrumbs;
    if (!autoGenerate) return [];

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip certain segments that shouldn't be breadcrumbs
      if (segment === 'public' || segment === 'src') return;
      
      // Format segment name
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Handle special cases
      if (segment.includes('_')) {
        label = segment.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      
      // If it's a number (ID), try to get a more meaningful name
      if (/^\d+$/.test(segment)) {
        const prevSegment = pathSegments[index - 1];
        if (prevSegment) {
          label = `${prevSegment.charAt(0).toUpperCase() + prevSegment.slice(1)} ${segment}`;
        } else {
          label = `ID: ${segment}`;
        }
      }

      // Get appropriate icon
      const IconComponent = iconMap[segment.toLowerCase()] || null;

      breadcrumbs.push({
        label,
        path: currentPath,
        icon: IconComponent,
        isLast: index === pathSegments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          container: 'flex items-center space-x-2 text-sm mb-8',
          link: 'text-white/80 hover:text-white font-medium transition-colors duration-200 flex items-center space-x-1',
          separator: 'text-white/40',
          current: 'text-white font-semibold flex items-center space-x-1',
          homeIcon: 'h-4 w-4 text-white/80'
        };
      case 'minimal':
        return {
          container: 'flex items-center space-x-1 text-xs text-gray-500',
          link: 'hover:text-purple-600 transition-colors duration-200 flex items-center space-x-1',
          separator: 'text-gray-300',
          current: 'text-gray-900 font-medium flex items-center space-x-1',
          homeIcon: 'h-3 w-3'
        };
      default:
        return {
          container: 'flex items-center py-3',
          wrapper: 'flex items-center space-x-1 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-xl shadow-sm border border-purple-200',
          link: 'text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center space-x-1',
          separator: 'text-gray-300 mx-2',
          current: 'text-gray-900 font-semibold flex items-center space-x-1',
          homeIcon: 'h-4 w-4'
        };
    }
  };

  const styles = getVariantStyles();

  if (breadcrumbs.length === 0 && !showHome) return null;

  return (
    <div className={`${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className={styles.container} aria-label="Breadcrumb">
          <ol className={styles.wrapper || 'flex items-center space-x-1'}>
            
            {/* Home Icon */}
            {showHome && (
              <li>
                <Link
                  to="/"
                  className={styles.link}
                  title="Go to Home"
                >
                  <HomeIcon className={styles.homeIcon} />
                  {variant !== 'minimal' && <span className="sr-only">Home</span>}
                </Link>
              </li>
            )}

            {/* Dynamic Breadcrumb Items */}
            {breadcrumbs.map((breadcrumb, index) => {
              const Icon = breadcrumb.icon;
              const isLast = breadcrumb.isLast || index === breadcrumbs.length - 1;

              return (
                <li key={index} className="flex items-center">
                  {(showHome || index > 0) && (
                    <ChevronRightIcon className={`h-4 w-4 ${styles.separator} flex-shrink-0`} />
                  )}
                  
                  {!isLast ? (
                    <Link
                      to={breadcrumb.path}
                      className={`${styles.link} capitalize truncate max-w-xs`}
                      title={breadcrumb.label}
                    >
                      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                      <span className="text-sm font-medium">{breadcrumb.label}</span>
                    </Link>
                  ) : (
                    <span 
                      className={`${styles.current} capitalize truncate max-w-xs`}
                      title={breadcrumb.label}
                    >
                      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                      <span className="text-sm font-medium">{breadcrumb.label}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

// Helper hook for easy breadcrumb management
export const useBreadcrumbs = () => {
  const [breadcrumbs, setBreadcrumbs] = React.useState([]);

  const updateBreadcrumbs = (newBreadcrumbs) => {
    setBreadcrumbs(newBreadcrumbs);
  };

  const addBreadcrumb = (breadcrumb) => {
    setBreadcrumbs(prev => [...prev, breadcrumb]);
  };

  const removeBreadcrumb = (index) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index));
  };

  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
  };

  return {
    breadcrumbs,
    updateBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs
  };
};

// Pre-configured breadcrumb variants for common use cases
export const HeroBreadcrumb = (props) => (
  <DynamicBreadcrumb {...props} variant="hero" />
);

export const MinimalBreadcrumb = (props) => (
  <DynamicBreadcrumb {...props} variant="minimal" />
);

export const DefaultBreadcrumb = (props) => (
  <DynamicBreadcrumb {...props} variant="default" />
);

export default DynamicBreadcrumb;
