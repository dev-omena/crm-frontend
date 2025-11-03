'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Package,
  Tag,
  Calendar,
  CreditCard,
  Eye,
  Edit2,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
import {
  PageHeader,
  SearchFilterBar,
  GridCard,
  DataTable,
  EmptyState,
  FormModal,
  FormField,
  ViewField,
} from '@/components/dashboard';

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  description?: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: '1',
      title: 'Office Supplies',
      amount: 245.50,
      category: 'Office',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      description: 'Printer paper and pens'
    },
    {
      id: '2',
      title: 'Software Subscription',
      amount: 99.99,
      category: 'Software',
      date: '2024-01-18',
      paymentMethod: 'Credit Card',
      description: 'Adobe Creative Cloud'
    },
    {
      id: '3',
      title: 'Client Meeting',
      amount: 156.75,
      category: 'Travel',
      date: '2024-01-20',
      paymentMethod: 'Cash',
      description: 'Lunch and transportation'
    },
    {
      id: '4',
      title: 'Marketing Campaign',
      amount: 890.00,
      category: 'Marketing',
      date: '2024-01-22',
      paymentMethod: 'Bank Transfer',
      description: 'Facebook Ads'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Office',
    date: '',
    paymentMethod: 'Credit Card',
    description: '',
  });

  const categories = ['Office', 'Software', 'Marketing', 'Travel', 'Utilities', 'Equipment', 'Other'];
  const paymentMethods = ['Credit Card', 'Cash', 'Bank Transfer'];

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'Office',
      date: '',
      paymentMethod: 'Credit Card',
      description: '',
    });
  };

  const handleAddExpense = () => {
    const newExpense: ExpenseItem = {
      id: (expenses.length + 1).toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      description: formData.description,
    };
    setExpenses([...expenses, newExpense]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditExpense = () => {
    if (selectedExpense) {
      setExpenses(expenses.map(expense =>
        expense.id === selectedExpense.id
          ? {
              ...expense,
              title: formData.title,
              amount: parseFloat(formData.amount),
              category: formData.category,
              date: formData.date,
              paymentMethod: formData.paymentMethod,
              description: formData.description,
            }
          : expense
      ));
      setShowEditModal(false);
      setSelectedExpense(null);
      resetForm();
    }
  };

  const handleDeleteExpense = () => {
    if (selectedExpense) {
      setExpenses(expenses.filter(expense => expense.id !== selectedExpense.id));
      setShowDeleteModal(false);
      setSelectedExpense(null);
    }
  };

  const openEditModal = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      description: expense.description || '',
    });
    setShowEditModal(true);
  };

  const openViewModal = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setShowViewModal(true);
  };

  const openDeleteModal = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = filteredExpenses.length;
    const avgExpense = count > 0 ? total / count : 0;

    // Category breakdown
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      count,
      avgExpense,
      categoryBreakdown: categoryTotals,
      topCategory: topCategory ? topCategory[0] : 'N/A'
    };
  }, [filteredExpenses]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Office': 'bg-blue-100 text-blue-800',
      'Software': 'bg-purple-100 text-purple-800',
      'Marketing': 'bg-green-100 text-green-800',
      'Travel': 'bg-yellow-100 text-yellow-800',
      'Utilities': 'bg-orange-100 text-orange-800',
      'Equipment': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Amount', 'Category', 'Date', 'Payment Method', 'Description'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(e =>
        [e.title, e.amount, e.category, e.date, e.paymentMethod, e.description || ''].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header with Stats */}
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
          {
            label: 'Expense Count',
            value: stats.count.toString(),
            icon: Package,
            color: 'purple',
            change: '+8.2%',
          },
          {
            label: 'Average Expense',
            value: `$${stats.avgExpense.toFixed(2)}`,
            icon: TrendingUp,
            color: 'green',
            change: '+5.3%',
          },
          {
            label: 'Top Category',
            value: stats.topCategory,
            icon: Tag,
            color: 'yellow',
          },
        ]}
      />

      {/* Category Breakdown Chart */}
      {Object.keys(stats.categoryBreakdown).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage = (amount / stats.total) * 100;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">{category}</span>
                      <span className="text-gray-600">${amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
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
              ...categories.map(cat => ({ label: cat, value: cat })),
            ],
            onChange: setCategoryFilter,
            type: 'select',
          },
        ]}
        activeFilters={{ Category: categoryFilter }}
      />

      {/* Expenses - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredExpenses.map((expense, index) => (
            <GridCard
              key={expense.id}
              title={expense.title}
              description={expense.description}
              badge={{
                text: expense.category,
                className: getCategoryColor(expense.category),
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
          ))}
        </div>
      )}

      {/* Expenses - List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={[
            {
              header: 'Expense',
              accessor: 'title',
              render: (value: string, row: ExpenseItem) => (
                <div>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                  {row.description && (
                    <p className="text-xs text-gray-500 line-clamp-1">{row.description}</p>
                  )}
                </div>
              ),
            },
            {
              header: 'Category',
              accessor: 'category',
              render: (value: string) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(value)}`}>
                  {value}
                </span>
              ),
            },
            {
              header: 'Amount',
              accessor: 'amount',
              render: (value: number) => (
                <p className="text-sm font-semibold text-gray-900">${value.toFixed(2)}</p>
              ),
            },
            {
              header: 'Date',
              accessor: 'date',
              render: (value: string) => (
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  <Calendar className="w-3 h-3" />
                  {new Date(value).toLocaleDateString()}
                </div>
              ),
            },
            {
              header: 'Payment Method',
              accessor: 'paymentMethod',
              render: (value: string) => (
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  <CreditCard className="w-3 h-3" />
                  {value}
                </div>
              ),
            },
          ]}
          data={filteredExpenses}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {filteredExpenses.length === 0 && (
        <EmptyState
          icon={Package}
          title="No expenses found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Add Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        mode="add"
        title="Add New Expense"
        icon={Plus}
        maxWidth="md"
        onSave={handleAddExpense}
        saveButtonText="Add Expense"
      >
        <FormField label="Title" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Office Supplies"
          />
        </FormField>

        <FormField label="Amount ($)" required>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="0.00"
          />
        </FormField>

        <FormField label="Category" required>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Date" required>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Payment Method" required>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Description (Optional)">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Add any additional notes..."
          />
        </FormField>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        mode="edit"
        title="Edit Expense"
        icon={Edit2}
        maxWidth="md"
        onSave={handleEditExpense}
      >
        <FormField label="Title" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Amount ($)" required>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Category" required>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Date" required>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Payment Method" required>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Description (Optional)">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        mode="view"
        title="Expense Details"
        icon={Eye}
        maxWidth="md"
      >
        {selectedExpense && (
          <>
            <ViewField label="Title" value={selectedExpense.title} />

            <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <ViewField 
                label="Amount" 
                value={<span className="text-3xl font-bold text-primary">${selectedExpense.amount.toFixed(2)}</span>}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ViewField 
                label="Category" 
                value={
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedExpense.category)}`}>
                    {selectedExpense.category}
                  </span>
                }
              />

              <ViewField label="Payment" value={selectedExpense.paymentMethod} />
            </div>

            <ViewField 
              label="Date" 
              value={new Date(selectedExpense.date).toLocaleDateString()}
            />

            {selectedExpense.description && (
              <ViewField label="Description" value={selectedExpense.description} />
            )}
          </>
        )}
      </FormModal>

      {/* Delete Modal */}
      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        mode="edit"
        title="Delete Expense"
        icon={Trash2}
        maxWidth="md"
        onSave={handleDeleteExpense}
        saveButtonText="Delete"
      >
        {selectedExpense && (
          <p className="text-gray-700">
            Are you sure you want to delete &ldquo;{selectedExpense.title}&rdquo;? This action cannot be undone.
          </p>
        )}
      </FormModal>
    </div>
  );
}
