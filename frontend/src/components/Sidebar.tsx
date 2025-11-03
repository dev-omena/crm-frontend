'use client';

/**
 * Enhanced Modern Sidebar Component
 *
 * Features:
 * - Clean modern design with light background
 * - Primary color on hover and active states
 * - Organized sections for better UX
 * - Smooth animations and transitions
 * - Mobile responsive with overlay
 */

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  FolderKanban,
  UsersRound,
  CalendarDays,
  HardDrive,
  Wrench,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Receipt,
  FileText,
  Utensils,
  Wallet,
  ActivitySquare,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        name: 'Overview',
        path: '/dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
      },
      {
        name: 'Customers',
        path: '/dashboard/customers',
        icon: <Users className="w-5 h-5" />,
      },
    ],
  },
  {
    title: 'Financial',
    items: [
      {
        name: 'Receipts',
        path: '/dashboard/financial/receipts',
        icon: <Receipt className="w-5 h-5" />,
      },
      {
        name: 'Quotations',
        path: '/dashboard/financial/quotations',
        icon: <FileText className="w-5 h-5" />,
      },
      {
        name: 'Menu',
        path: '/dashboard/financial/menu',
        icon: <Utensils className="w-5 h-5" />,
      },
      {
        name: 'Expenses',
        path: '/dashboard/financial/expenses',
        icon: <Wallet className="w-5 h-5" />,
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        name: 'Services',
        path: '/dashboard/services',
        icon: <Package className="w-5 h-5" />,
      },
      {
        name: 'Projects',
        path: '/dashboard/projects',
        icon: <FolderKanban className="w-5 h-5" />,
      },
      {
        name: 'Team',
        path: '/dashboard/team',
        icon: <UsersRound className="w-5 h-5" />,
      },
    ],
  },
  {
    title: 'Productivity',
    items: [
      {
        name: 'Tasks & Calendar',
        path: '/dashboard/tasks',
        icon: <CalendarDays className="w-5 h-5" />,
      },
      {
        name: 'Drive & Gallery',
        path: '/dashboard/drive',
        icon: <HardDrive className="w-5 h-5" />,
      },
      {
        name: 'Tools',
        path: '/dashboard/tools',
        icon: <Wrench className="w-5 h-5" />,
      },
      {
        name: 'Activity Logs',
        path: '/dashboard/activity-logs',
        icon: <ActivitySquare className="w-5 h-5" />,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white text-primary rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{
          x: isMobileMenuOpen || pathname.startsWith('/dashboard') ? 0 : -280
        }}
        className="fixed lg:sticky top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 z-40 flex flex-col shadow-xl lg:shadow-none lg:translate-x-0 transition-transform duration-300"
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/Full-logo.png"
                alt="Omena Agency Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 truncate">Omena Agency</h2>
              <p className="text-xs text-gray-500">CRM Dashboard</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {navSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item, itemIndex) => {
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                    return (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      >
                        <Link
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            group relative flex items-center justify-between px-2 py-1.5 rounded-lg text-sm
                            transition-all duration-200
                            ${
                              isActive
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-2">
                            <span className={`
                              transition-transform duration-200
                              ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                            `}>
                              {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                          </div>

                          {item.badge && (
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full font-medium
                              ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-primary/10 text-primary'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Settings & Logout Section */}
        <div className="p-2 border-t border-gray-100 space-y-1">
          <Link
            href="/dashboard/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
              group flex items-center space-x-2 px-2 py-1.5 rounded-lg text-sm transition-all duration-200
              ${
                pathname === '/dashboard/settings'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-gray-700 hover:bg-primary/10 hover:text-primary'
              }
            `}
          >
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Settings</span>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 group text-sm"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
