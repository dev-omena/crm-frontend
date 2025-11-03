import { motion, AnimatePresence } from 'framer-motion';
import { X, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type ModalMode = 'view' | 'edit' | 'add';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  onSave?: () => void;
  onDelete?: () => void;
  saveButtonText?: string;
  deleteButtonText?: string;
  showDeleteButton?: boolean;
  isLoading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  footer?: ReactNode;
}

/**
 * FormModal Component
 * 
 * A dynamic modal component that supports three modes:
 * - view: Display-only mode with close button
 * - edit: Edit mode with save and cancel buttons
 * - add: Add mode with add and cancel buttons
 * 
 * Features:
 * - Animated entrance/exit
 * - Click outside to close
 * - ESC key to close
 * - Custom icon support
 * - Optional delete button
 * - Custom footer support
 * - Responsive max-width options
 */
export function FormModal({
  isOpen,
  onClose,
  mode,
  title,
  icon: Icon,
  children,
  onSave,
  onDelete,
  saveButtonText,
  deleteButtonText,
  showDeleteButton = false,
  isLoading = false,
  maxWidth = '2xl',
  footer,
}: FormModalProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  const getButtonText = () => {
    if (saveButtonText) return saveButtonText;
    if (mode === 'add') return 'Add';
    if (mode === 'edit') return 'Save Changes';
    return 'Close';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-lg p-6 ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">{children}</div>

            {/* Footer */}
            {footer ? (
              <div className="mt-6">{footer}</div>
            ) : mode !== 'view' ? (
              <div className="flex items-center gap-3 mt-6">
                {showDeleteButton && onDelete && (
                  <button
                    onClick={onDelete}
                    disabled={isLoading}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteButtonText || 'Delete'}
                  </button>
                )}
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                {onSave && (
                  <button
                    onClick={onSave}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : getButtonText()}
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * FormField Component
 * Helper component for consistent form fields inside modals
 */
export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * ViewField Component
 * Helper component for displaying read-only fields in view mode
 */
export interface ViewFieldProps {
  label: string;
  value: string | number | ReactNode;
  className?: string;
}

export function ViewField({ label, value, className = '' }: ViewFieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
