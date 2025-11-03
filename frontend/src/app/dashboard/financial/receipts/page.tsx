'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Receipt as ReceiptIcon,
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  X,
  Mail,
  User,
  Calendar,
  CreditCard,
  ChevronDown,
  Package,
  Search,
  Grid3x3,
  List,
  Printer,
  FileText,
} from 'lucide-react';
import { mockCustomers, getCustomerDisplayName, getActiveCustomers, type Customer } from '@/lib/dataStore';
import { DocumentGeneratorFactory, type ReceiptData } from '@/lib/pdfGenerator';
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

interface ReceiptItem {
  id: string;
  receiptNumber: string;
  customer: string;
  email: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'refunded';
  items: number;
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptItem[]>([
    {
      id: '1',
      receiptNumber: 'RCP-2024-001',
      customer: 'Tech Solutions Inc',
      email: 'contact@techsolutions.com',
      amount: 2500.00,
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      status: 'paid',
      items: 5
    },
    {
      id: '2',
      receiptNumber: 'RCP-2024-002',
      customer: 'Digital Marketing Pro',
      email: 'info@digitalmarketing.com',
      amount: 1800.00,
      date: '2024-01-18',
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      items: 3
    },
    {
      id: '3',
      receiptNumber: 'RCP-2024-003',
      customer: 'Creative Design Studio',
      email: 'hello@creativedesign.com',
      amount: 3200.00,
      date: '2024-01-20',
      paymentMethod: 'Cash',
      status: 'pending',
      items: 7
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    receiptNumber: '',
    customerId: '',
    customer: '',
    email: '',
    amount: '',
    date: '',
    paymentMethod: 'Credit Card',
    status: 'paid' as ReceiptItem['status'],
    items: '1',
  });

  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const activeCustomers = getActiveCustomers(mockCustomers);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return activeCustomers;
    const search = customerSearchTerm.toLowerCase();
    return activeCustomers.filter((c: Customer) =>
      getCustomerDisplayName(c).toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search)
    );
  }, [customerSearchTerm, activeCustomers]);

  const handleSelectCustomer = (customer: Customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      customer: customer.company || `${customer.firstName} ${customer.lastName}`,
      email: customer.email
    });
    setCustomerSearchTerm('');
    setShowCustomerDropdown(false);
  };

  const paymentMethods = ['Credit Card', 'Bank Transfer', 'Cash', 'PayPal'];

  const resetForm = () => {
    setFormData({
      receiptNumber: '',
      customerId: '',
      customer: '',
      email: '',
      amount: '',
      date: '',
      paymentMethod: 'Credit Card',
      status: 'paid',
      items: '1',
    });
    setCustomerSearchTerm('');
    setShowCustomerDropdown(false);
  };

  const handleAddReceipt = () => {
    const newReceipt: ReceiptItem = {
      id: (receipts.length + 1).toString(),
      receiptNumber: formData.receiptNumber || `RCP-2024-${String(receipts.length + 1).padStart(3, '0')}`,
      customer: formData.customer,
      email: formData.email,
      amount: parseFloat(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      items: parseInt(formData.items),
    };
    setReceipts([...receipts, newReceipt]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditReceipt = () => {
    if (selectedReceipt) {
      setReceipts(receipts.map(receipt =>
        receipt.id === selectedReceipt.id
          ? {
              ...receipt,
              receiptNumber: formData.receiptNumber,
              customer: formData.customer,
              email: formData.email,
              amount: parseFloat(formData.amount),
              date: formData.date,
              paymentMethod: formData.paymentMethod,
              status: formData.status,
              items: parseInt(formData.items),
            }
          : receipt
      ));
      setShowEditModal(false);
      setSelectedReceipt(null);
      resetForm();
    }
  };

  const handleDeleteReceipt = () => {
    if (selectedReceipt) {
      setReceipts(receipts.filter(receipt => receipt.id !== selectedReceipt.id));
      setShowDeleteModal(false);
      setSelectedReceipt(null);
    }
  };

  const openEditModal = (receipt: ReceiptItem) => {
    setSelectedReceipt(receipt);
    setFormData({
      receiptNumber: receipt.receiptNumber,
      customerId: '',
      customer: receipt.customer,
      email: receipt.email,
      amount: receipt.amount.toString(),
      date: receipt.date,
      paymentMethod: receipt.paymentMethod,
      status: receipt.status,
      items: receipt.items.toString(),
    });
    setShowEditModal(true);
  };

  const openViewModal = (receipt: ReceiptItem) => {
    setSelectedReceipt(receipt);
    setShowViewModal(true);
  };

  const openDeleteModal = (receipt: ReceiptItem) => {
    setSelectedReceipt(receipt);
    setShowDeleteModal(true);
  };

  const handlePrintReceipt = (receipt: ReceiptItem) => {
    // Convert ReceiptItem to ReceiptData format
    const receiptData: ReceiptData = {
      receiptNumber: receipt.receiptNumber,
      customer: {
        name: receipt.customer,
        email: receipt.email
      },
      amount: receipt.amount,
      date: receipt.date,
      paymentMethod: receipt.paymentMethod,
      status: receipt.status,
      items: receipt.items
    };

    // Use OOP approach with Factory pattern
    const generator = DocumentGeneratorFactory.createReceiptGenerator(receiptData);
    generator.printReceipt();
  };

  const handleDownloadReceipt = (receipt: ReceiptItem) => {
    // Convert ReceiptItem to ReceiptData format
    const receiptData: ReceiptData = {
      receiptNumber: receipt.receiptNumber,
      customer: {
        name: receipt.customer,
        email: receipt.email
      },
      amount: receipt.amount,
      date: receipt.date,
      paymentMethod: receipt.paymentMethod,
      status: receipt.status,
      items: receipt.items
    };

    // Use OOP approach with Factory pattern
    const generator = DocumentGeneratorFactory.createReceiptGenerator(receiptData);
    generator.downloadReceipt();
  };

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || receipt.paymentMethod === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Enhanced Statistics
  const stats = useMemo(() => {
    const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const paidAmount = filteredReceipts.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const pendingAmount = filteredReceipts.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
    const avgAmount = filteredReceipts.length > 0 ? totalAmount / filteredReceipts.length : 0;

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      avgAmount,
      count: filteredReceipts.length
    };
  }, [filteredReceipts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = ['Receipt Number', 'Customer', 'Email', 'Amount', 'Date', 'Payment Method', 'Status', 'Items'];
    const csvContent = [
      headers.join(','),
      ...filteredReceipts.map(r =>
        [r.receiptNumber, r.customer, r.email, r.amount, r.date, r.paymentMethod, r.status, r.items].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipts.csv';
    a.click();
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="font-bold text-gray-900 flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5 text-primary" />
            Receipts
          </h1>
          <p className="text-gray-600 text-xs mt-0.5">
            Manage and track your payment receipts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded transition-all ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded transition-all ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            className="px-3 py-1.5 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add Receipt
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-blue-900">${stats.totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Paid Amount</p>
              <p className="text-2xl font-bold text-green-900">${stats.paidAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">${stats.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Average Receipt</p>
              <p className="text-2xl font-bold text-purple-900">${stats.avgAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <ReceiptIcon className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by receipt number, customer, or email..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterOptions={[
          {
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
              { label: 'Refunded', value: 'refunded' },
            ],
            onChange: setStatusFilter,
            type: 'select',
          },
          {
            label: 'Payment Method',
            value: paymentFilter,
            options: [
              { label: 'All Payment Methods', value: 'all' },
              ...paymentMethods.map(method => ({ label: method, value: method })),
            ],
            onChange: setPaymentFilter,
            type: 'select',
          },
        ]}
        activeFilters={{ Status: statusFilter, 'Payment Method': paymentFilter }}
      />

      {/* Receipts - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReceipts.map((receipt, index) => (
            <GridCard
              key={receipt.id}
              title={receipt.receiptNumber}
              subtitle={receipt.customer}
              description={receipt.email}
              badge={{
                text: receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1),
                className: getStatusColor(receipt.status),
              }}
              amount={{
                label: 'Receipt Amount',
                value: `$${receipt.amount.toLocaleString()}`,
                subtext: `${receipt.items} items`,
              }}
              details={[
                {
                  label: 'Date',
                  value: new Date(receipt.date).toLocaleDateString(),
                  icon: Calendar,
                },
                {
                  label: 'Payment Method',
                  value: receipt.paymentMethod,
                  icon: CreditCard,
                },
              ]}
              onView={() => openViewModal(receipt)}
              onEdit={() => openEditModal(receipt)}
              onDelete={() => openDeleteModal(receipt)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Receipts - List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={[
            {
              header: 'Receipt',
              accessor: 'receiptNumber',
              render: (value: string, row: ReceiptItem) => (
                <div>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{row.items} items</p>
                </div>
              ),
            },
            {
              header: 'Customer',
              accessor: 'customer',
              render: (value: string, row: ReceiptItem) => (
                <div>
                  <p className="text-sm font-medium text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{row.email}</p>
                </div>
              ),
            },
            {
              header: 'Amount',
              accessor: 'amount',
              render: (value: number, row: ReceiptItem) => (
                <div>
                  <p className="text-sm font-semibold text-gray-900">${value.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CreditCard className="w-3 h-3" />
                    {row.paymentMethod}
                  </div>
                </div>
              ),
            },
            {
              header: 'Status',
              accessor: 'status',
              render: (value: string) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
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
          ]}
          data={filteredReceipts}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {filteredReceipts.length === 0 && (
        <EmptyState
          icon={Package}
          title="No receipts found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Receipt</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                  {!formData.customer ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={customerSearchTerm}
                          onChange={(e) => {
                            setCustomerSearchTerm(e.target.value);
                            setShowCustomerDropdown(true);
                          }}
                          onFocus={() => setShowCustomerDropdown(true)}
                          placeholder="Search customer by name or email..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      {showCustomerDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer: Customer) => (
                              <button
                                key={customer.id}
                                type="button"
                                onClick={() => handleSelectCustomer(customer)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                <div className="font-medium text-gray-900">{getCustomerDisplayName(customer)}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No customers found
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{formData.customer}</div>
                        <div className="text-sm text-gray-600">{formData.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, customerId: '', customer: '', email: '' });
                          setCustomerSearchTerm('');
                        }}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ReceiptItem['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Items</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReceipt}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Add Receipt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal - Continues with customer selection similar to Add Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Receipt</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
                  {!formData.customer ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={customerSearchTerm}
                          onChange={(e) => {
                            setCustomerSearchTerm(e.target.value);
                            setShowCustomerDropdown(true);
                          }}
                          onFocus={() => setShowCustomerDropdown(true)}
                          placeholder="Search customer by name or email..."
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      {showCustomerDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer: Customer) => (
                              <button
                                key={customer.id}
                                type="button"
                                onClick={() => handleSelectCustomer(customer)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                <div className="font-medium text-gray-900">{getCustomerDisplayName(customer)}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                              No customers found
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{formData.customer}</div>
                        <div className="text-sm text-gray-600">{formData.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, customerId: '', customer: '', email: '' });
                          setCustomerSearchTerm('');
                        }}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ReceiptItem['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Items</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditReceipt}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Receipt Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-gray-500 mb-1">Receipt Number</p>
                  <p className="text-xl font-bold text-gray-800">{selectedReceipt.receiptNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Customer</p>
                    <p className="font-semibold text-gray-800">{selectedReceipt.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReceipt.status)}`}>
                      {selectedReceipt.status.charAt(0).toUpperCase() + selectedReceipt.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                  <p className="text-gray-700">{selectedReceipt.email}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-green-900">${selectedReceipt.amount.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                    <p className="font-semibold text-gray-800">{new Date(selectedReceipt.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Items</p>
                    <p className="font-semibold text-gray-800">{selectedReceipt.items}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <p className="font-semibold text-gray-800">{selectedReceipt.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handlePrintReceipt(selectedReceipt)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => handleDownloadReceipt(selectedReceipt)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              <button
                onClick={() => setShowViewModal(false)}
                className="w-full mt-3 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-red-600">Delete Receipt</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete receipt &ldquo;{selectedReceipt.receiptNumber}&rdquo;? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReceipt}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
