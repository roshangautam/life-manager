import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  WalletIcon,
  UsersIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChartPieIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface SubNavItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  icon: IconType;
  children?: SubNavItem[];
}

interface OpenMenusState {
  [key: string]: boolean;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { 
    name: 'Finance', 
    icon: WalletIcon,
    children: [
      { name: 'Add Expense', href: '/finance/expenses' },
      { name: 'Expense History', href: '/finance/history' },
      { name: 'Budget Overview', href: '/finance/budget' },
      { name: 'Analytics', href: '/finance/analytics' },
      { name: 'Recurring Expenses', href: '/finance/recurring' },
      { name: 'Budget Settings', href: '/finance/budget-settings' },
    ],
  },
  { 
    name: 'Household', 
    icon: UsersIcon,
    children: [
      { name: 'Members', href: '/household/members' },
      { name: 'Create Household', href: '/household/create' },
      { name: 'Settings', href: '/household/settings' },
    ],
  },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartPieIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps): JSX.Element {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<OpenMenusState>({
    Finance: true,
    Household: false,
  });

  const toggleMenu = (menuName: string): void => {
    setOpenMenus({
      ...openMenus,
      [menuName]: !openMenus[menuName]
    });
  };

  const isActive = (href: string): boolean => {
    return location.pathname === href;
  };

  const isActiveParent = (children?: SubNavItem[]): boolean => {
    return children ? children.some(child => location.pathname === child.href) : false;
  };

  const handleLogout = (): void => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-primary-600">Life Manager</h2>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {!item.children ? (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        isActiveParent(item.children)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleMenu(item.name)}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
                        {item.name}
                      </div>
                      {openMenus[item.name] ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )}
                    </button>
                    {openMenus[item.name] && (
                      <div className="pl-10 space-y-1 mt-1">
                        {item.children.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`block px-3 py-2 text-sm font-medium rounded-md ${
                              isActive(subItem.href)
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
