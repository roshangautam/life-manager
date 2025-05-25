import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  WalletIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  ClockIcon,
  CogIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavItemBase {
  name: string;
  icon: IconType;
  badge?: number | string;
}

interface NavLink extends NavItemBase {
  href: string;
  children?: never;
}

interface NavGroup extends NavItemBase {
  href?: never;
  children: NavLink[];
}

type NavItem = NavLink | NavGroup;

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon 
  },
  { 
    name: 'Finance', 
    icon: WalletIcon,
    children: [
      { 
        name: 'Add Expense', 
        href: '/finance/expenses',
        icon: PlusIcon,
      },
      { 
        name: 'Expense History', 
        href: '/finance/history',
        icon: DocumentTextIcon,
      },
      { 
        name: 'Budget Overview', 
        href: '/finance/budget',
        icon: CurrencyDollarIcon,
      },
      { 
        name: 'Analytics', 
        href: '/finance/analytics',
        icon: ChartBarIcon,
      },
      { 
        name: 'Recurring', 
        href: '/finance/recurring',
        icon: ClockIcon,
      },
      { 
        name: 'Settings', 
        href: '/finance/settings',
        icon: CogIcon,
      },
    ],
  },
  { 
    name: 'Household', 
    icon: UsersIcon,
    children: [
      { 
        name: 'Members', 
        href: '/household/members',
        icon: UsersIcon,
      },
      { 
        name: 'Create Household', 
        href: '/household/create',
        icon: PlusIcon,
      },
      { 
        name: 'Settings', 
        href: '/household/settings',
        icon: CogIcon,
      },
    ],
  },
  { 
    name: 'Calendar', 
    href: '/calendar', 
    icon: CalendarIcon,
    badge: 3,
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: ChartPieIcon,
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [darkMode, setDarkMode] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (sidebarOpen && !target.closest('.sidebar-container')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle menu group
  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Check if a path is active
  const isActive = (href: string): boolean => {
    return location.pathname === href;
  };

  // Check if any child nav item is active
  const hasActiveChild = (children: NavLink[] = []): boolean => {
    return children.some(child => isActive(child.href));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 sidebar-container`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">Life Manager</span>
          </Link>
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center">
                      <item.icon 
                        className={`w-5 h-5 mr-3 ${
                          isActive(item.href) 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                        }`} 
                        aria-hidden="true" 
                      />
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleMenu(item.name)}
                      className={`group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        hasActiveChild(item.children)
                          ? 'text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon 
                          className={`w-5 h-5 mr-3 ${
                            hasActiveChild(item.children)
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                          }`} 
                          aria-hidden="true" 
                        />
                        {item.name}
                      </div>
                      {openMenus[item.name] ? (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-200 ${
                        openMenus[item.name] ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="py-1 pl-11">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive(subItem.href)
                                ? 'text-primary-700 bg-primary-50 dark:bg-gray-700 dark:text-white'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <subItem.icon 
                              className={`w-4 h-4 mr-2 ${
                                isActive(subItem.href)
                                  ? 'text-primary-600 dark:text-primary-400'
                                  : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                              }`} 
                              aria-hidden="true" 
                            />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user?.photoURL ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700">
                  <UserCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
