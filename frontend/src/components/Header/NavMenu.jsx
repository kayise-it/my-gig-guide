// src/components/Header/NavMenu.jsx
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Artists', path: '/artists' },
  { name: 'Events', path: '/events' },
  { name: 'Venues', path: '/venues' },
  { name: 'Contact', path: '/contact' },
];

export default function NavMenu() {
  return (
    <nav className="py-3">
      <ul className="flex space-x-8">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `block py-2 font-medium transition-colors ${
                  isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                }`
              }>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}