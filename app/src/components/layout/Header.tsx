import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Header({ setSidebarOpen }: HeaderProps): JSX.Element {
  const handleLogout = (): void => {
    localStorage.removeItem('userToken');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 dark:bg-slate-800/80 dark:border-slate-700/60 shadow-sm">
      <button
        type="button"
        className="px-4 text-slate-500 border-r border-slate-200/60 dark:border-slate-700/60 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden transition-all duration-200"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
      </button>
      
      <div className="flex justify-between flex-1 px-6">
        <div className="flex items-center flex-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-blue-200 bg-clip-text text-transparent lg:hidden">
            Life Manager
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="w-5 h-5" aria-hidden="true" />
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <div>
              <Menu.Button className="flex items-center p-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                <span className="sr-only">Open user menu</span>
                <div className="relative">
                  <UserCircleIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-slate-800 rounded-full"></div>
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 w-56 py-2 mt-2 origin-top-right bg-white dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 focus:outline-none border border-slate-200/60 dark:border-slate-700/60">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">John Doe</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">john@example.com</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={classNames(
                        active ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300',
                        'flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150'
                      )}
                    >
                      <UserCircleIcon className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      Your Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={classNames(
                        active ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300',
                        'flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150'
                      )}
                    >
                      <Cog6ToothIcon className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={classNames(
                        active ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300',
                        'flex items-center w-full px-4 py-3 text-sm font-medium transition-colors duration-150'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-500 dark:text-red-400" aria-hidden="true" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
