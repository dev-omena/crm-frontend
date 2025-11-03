'use client';

import { motion } from 'framer-motion';
import { Grid3x3, List, Download, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExport: () => void;
  onAdd: () => void;
  addButtonText: string;
  stats?: Array<{
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
    change?: string;
  }>;
}

export default function PageHeader({
  icon: Icon,
  title,
  description,
  viewMode,
  onViewModeChange,
  onExport,
  onAdd,
  addButtonText,
  stats,
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Title Section */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 mt-0.5">{description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExport}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </motion.button>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdd}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 shadow-md shadow-primary/20"
            >
              <span className="text-lg leading-none">+</span>
              {addButtonText}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, translateY: -2 }}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <StatIcon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  {stat.change && (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <motion.svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </motion.svg>
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-gray-600 text-xs mb-1">{stat.label}</h3>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
