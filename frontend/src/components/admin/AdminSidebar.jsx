import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  MusicalNoteIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const linkBase = 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors';
const activeClasses = 'bg-indigo-50 text-indigo-700';
const inactiveClasses = 'text-gray-700 hover:bg-gray-50 hover:text-gray-900';

export default function AdminSidebar() {
  const items = [
    { to: '/admin', label: 'Dashboard', icon: HomeIcon },
    { to: '/admin/users', label: 'Users', icon: UsersIcon },
    { to: '/admin/artists', label: 'Artists', icon: MusicalNoteIcon },
    { to: '/admin/organisers', label: 'Organisers', icon: BuildingOfficeIcon },
    { to: '/admin/venues', label: 'Venues', icon: MapPinIcon },
    { to: '/admin/events', label: 'Events', icon: CalendarDaysIcon },
    { to: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
    { to: '/admin/paid-features', label: 'Paid Features', icon: SparklesIcon }
  ];

  return (
    <nav className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:block">
      <div className="p-4">
        <div className="text-lg font-semibold text-gray-900 mb-4">Admin</div>
        <div className="space-y-1">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${linkBase} ${isActive ? activeClasses : inactiveClasses}`}
              end={item.to === '/admin'}
            >
              {item.icon ? <item.icon className="h-5 w-5 mr-2" /> : null}
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}


