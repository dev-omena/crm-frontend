'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 font-medium">{title}</p>
      <p className="text-gray-500 text-sm mt-1">{description}</p>
    </div>
  );
}
