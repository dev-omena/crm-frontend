'use client';

import { motion } from 'framer-motion';
import { Eye, Edit2, Trash2, LucideIcon } from 'lucide-react';

interface GridCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: {
    text: string;
    className: string;
  };
  amount?: {
    label: string;
    value: string;
    subtext?: string;
  };
  details?: Array<{
    label: string;
    value: string;
    icon?: LucideIcon;
  }>;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  index?: number;
  children?: React.ReactNode;
}

export default function GridCard({
  title,
  subtitle,
  description,
  badge,
  amount,
  details,
  onView,
  onEdit,
  onDelete,
  index = 0,
  children,
}: GridCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
          {subtitle && <p className="text-sm font-medium text-gray-700">{subtitle}</p>}
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        {badge && (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.className}`}>
            {badge.text}
          </span>
        )}
      </div>

      {/* Amount Section */}
      {amount && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{amount.label}</span>
            <span className="text-lg font-bold text-gray-900">{amount.value}</span>
          </div>
          {amount.subtext && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">{amount.subtext}</span>
            </div>
          )}
        </div>
      )}

      {/* Custom Content */}
      {children}

      {/* Details Grid */}
      {details && details.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {details.map((detail, idx) => {
            const DetailIcon = detail.icon;
            return (
              <div key={idx}>
                <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  {DetailIcon && <DetailIcon className="w-3 h-3" />}
                  {detail.value}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {(onView || onEdit || onDelete) && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          {onView && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onView}
              className="flex-1 px-3 py-1.5 text-xs bg-primary text-white rounded-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-1"
            >
              <Eye className="w-3 h-3" />
              View
            </motion.button>
          )}
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-all flex items-center justify-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}
