# Dashboard Component Architecture

This document explains the reusable dashboard components and how to use them across all dashboard pages.

## Available Components

All components are located in `src/components/dashboard/` and can be imported like:

```tsx
import {
  PageHeader,
  SearchFilterBar,
  GridCard,
  DataTable,
  Modal,
  EmptyState,
} from '@/components/dashboard';
```

---

## 1. PageHeader

Renders the page title, description, view toggle, export button, and action button with optional stats cards.

### Props:
```tsx
{
  icon: LucideIcon;           // Icon component from lucide-react
  title: string;              // Page title
  description: string;        // Page description
  viewMode: 'grid' | 'list';  // Current view mode
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onExport: () => void;       // Export button handler
  onAdd: () => void;          // Add button handler
  addButtonText: string;      // Text for add button
  stats?: Array<{             // Optional stats cards
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;            // 'blue', 'purple', 'green', 'yellow', etc.
    change?: string;          // Optional percentage change
  }>;
}
```

### Example:
```tsx
<PageHeader
  icon={DollarSign}
  title="Expenses"
  description="Track and manage your business expenses"
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  onExport={exportToCSV}
  onAdd={() => setShowAddModal(true)}
  addButtonText="Add Expense"
  stats={[
    {
      label: 'Total Expenses',
      value: `$${stats.total.toFixed(2)}`,
      icon: DollarSign,
      color: 'blue',
      change: '+12.5%',
    },
    // ... more stats
  ]}
/>
```

---

## 2. SearchFilterBar

Renders search input and filter dropdown with dynamic filter options.

### Props:
```tsx
{
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  filterOptions?: Array<{
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
    type?: 'select' | 'buttons';  // Default: 'select'
  }>;
  activeFilters?: Record<string, string>;
}
```

### Example:
```tsx
<SearchFilterBar
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Search expenses by title or description..."
  showFilters={showFilters}
  onToggleFilters={() => setShowFilters(!showFilters)}
  filterOptions={[
    {
      label: 'Category',
      value: categoryFilter,
      options: [
        { label: 'All Categories', value: 'all' },
        { label: 'Office', value: 'office' },
      ],
      onChange: setCategoryFilter,
      type: 'select',
    },
  ]}
  activeFilters={{ Category: categoryFilter }}
/>
```

---

## 3. GridCard

Reusable card component for grid view with consistent styling.

### Props:
```tsx
{
  title: string;
  subtitle?: string;
  description?: string;
  badge?: {
    text: string;
    className: string;  // Tailwind classes for badge styling
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
  index?: number;         // For stagger animation
  children?: React.ReactNode;  // Custom content
}
```

### Example:
```tsx
<GridCard
  title={expense.title}
  description={expense.description}
  badge={{
    text: expense.category,
    className: 'bg-blue-100 text-blue-800',
  }}
  amount={{
    label: 'Amount',
    value: `$${expense.amount.toFixed(2)}`,
  }}
  details={[
    {
      label: 'Date',
      value: new Date(expense.date).toLocaleDateString(),
      icon: Calendar,
    },
    {
      label: 'Payment Method',
      value: expense.paymentMethod,
      icon: CreditCard,
    },
  ]}
  onView={() => openViewModal(expense)}
  onEdit={() => openEditModal(expense)}
  onDelete={() => openDeleteModal(expense)}
  index={index}
/>
```

---

## 4. DataTable

Renders a table with consistent styling and actions.

### Props:
```tsx
{
  columns: Array<{
    header: string;
    accessor: string;
    render?: (value: any, row: any) => ReactNode;
  }>;
  data: any[];
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  showActions?: boolean;  // Default: true
}
```

### Example:
```tsx
const tableColumns = [
  {
    header: 'Expense',
    accessor: 'title',
    render: (value: string, row: ExpenseItem) => (
      <div>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{row.description}</p>
      </div>
    ),
  },
  {
    header: 'Amount',
    accessor: 'amount',
    render: (value: number) => (
      <p className="text-sm font-semibold text-gray-900">${value.toFixed(2)}</p>
    ),
  },
];

<DataTable
  columns={tableColumns}
  data={filteredExpenses}
  onView={(item) => openViewModal(item)}
  onEdit={(item) => openEditModal(item)}
  onDelete={(item) => openDeleteModal(item)}
/>
```

---

## 5. Modal

Reusable modal component with consistent styling.

### Props:
```tsx
{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';  // Default: 'md'
}
```

### Example:
```tsx
<Modal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  title="Add New Expense"
>
  <div className="space-y-4">
    {/* Form fields */}
    <div className="flex gap-3">
      <button onClick={() => setShowAddModal(false)}>Cancel</button>
      <button onClick={handleAdd}>Add</button>
    </div>
  </div>
</Modal>
```

---

## 6. EmptyState

Shows when no data is available.

### Props:
```tsx
{
  icon: LucideIcon;
  title: string;
  description: string;
}
```

### Example:
```tsx
{filteredExpenses.length === 0 && (
  <EmptyState
    icon={Package}
    title="No expenses found"
    description="Try adjusting your search or filters"
  />
)}
```

---

## Migration Guide

### Before (Old Code):
```tsx
<div className="flex flex-col md:flex-row gap-3">
  <div>
    <h1 className="font-bold">{title}</h1>
    <p>{description}</p>
  </div>
  <div className="flex gap-2">
    {/* View toggle buttons */}
    {/* Export button */}
    {/* Add button */}
  </div>
</div>

{/* Stats cards */}
<div className="grid grid-cols-4 gap-4">
  {/* 4 stat cards with motion.div */}
</div>
```

### After (New Components):
```tsx
<PageHeader
  icon={Icon}
  title={title}
  description={description}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
  onExport={exportToCSV}
  onAdd={() => setShowAddModal(true)}
  addButtonText="Add Item"
  stats={statsArray}
/>
```

---

## Benefits

✅ **Less Code**: Reduces page size by 40-60%
✅ **Consistency**: All pages look and behave the same
✅ **Maintainability**: Update once, applies everywhere
✅ **Type Safety**: Full TypeScript support
✅ **Animations**: Built-in framer-motion animations
✅ **Responsive**: Mobile-first design included

---

## Example Refactored Page

See `src/app/dashboard/financial/menu/page-refactored.tsx` for a complete example of a refactored page using all components.

The refactored page went from **~970 lines** to **~400 lines** (58% reduction) while maintaining the exact same UI.
