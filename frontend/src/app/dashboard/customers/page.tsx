'use client';

/**
 * Customers Management Page
 *
 * Full CRUD operations for managing customers
 */

import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  Filter,
  FileText,
  Download,
  Printer,
  Clock,
  ShoppingCart,
  Receipt,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/SkeletonLoader';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  company?: string;
  address?: string;
  status: 'active' | 'inactive';
  totalSpent: number;
  projectsCompleted: number;
  notes?: string;
  createdAt: string;
  history?: CustomerHistoryItem[];
}

interface CustomerHistoryItem {
  id: string;
  type: 'quotation' | 'receipt' | 'project' | 'note';
  title: string;
  description: string;
  amount?: number;
  date: string;
  status?: 'pending' | 'completed' | 'paid' | 'cancelled';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
    notes: '',
  });

  // Simulate loading data
  useEffect(() => {
    // Mock data
    const mockCustomers: Customer[] = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phoneNumber: '+1234567890',
        company: 'Tech Solutions Inc',
        address: '123 Main St, New York, NY 10001',
        status: 'active',
        totalSpent: 15000,
        projectsCompleted: 3,
        notes: 'VIP Client - High priority',
        createdAt: '2024-01-10',
        history: [
          {
            id: 'h1',
            type: 'quotation',
            title: 'Website Redesign Quotation',
            description: 'Complete website redesign with modern UI/UX',
            amount: 8000,
            date: '2024-03-01',
            status: 'completed',
          },
          {
            id: 'h2',
            type: 'receipt',
            title: 'Payment Receipt #1001',
            description: 'Payment received for website redesign',
            amount: 8000,
            date: '2024-03-05',
            status: 'paid',
          },
          {
            id: 'h3',
            type: 'project',
            title: 'Mobile App Development',
            description: 'iOS and Android app development',
            amount: 5000,
            date: '2024-02-15',
            status: 'completed',
          },
          {
            id: 'h4',
            type: 'quotation',
            title: 'SEO Optimization Package',
            description: '6-month SEO optimization service',
            amount: 2000,
            date: '2024-03-10',
            status: 'pending',
          },
        ],
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@example.com',
        phoneNumber: '+1987654321',
        company: 'Digital Marketing Pro',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        status: 'active',
        totalSpent: 8500,
        projectsCompleted: 2,
        notes: 'Prefers email communication',
        createdAt: '2024-01-12',
        history: [
          {
            id: 'h5',
            type: 'quotation',
            title: 'Social Media Marketing Campaign',
            description: '3-month social media campaign',
            amount: 4500,
            date: '2024-02-20',
            status: 'completed',
          },
          {
            id: 'h6',
            type: 'receipt',
            title: 'Payment Receipt #1002',
            description: 'Payment for marketing campaign',
            amount: 4500,
            date: '2024-02-25',
            status: 'paid',
          },
          {
            id: 'h7',
            type: 'project',
            title: 'Brand Identity Design',
            description: 'Logo and brand guidelines',
            amount: 4000,
            date: '2024-01-20',
            status: 'completed',
          },
        ],
      },
      {
        id: '3',
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@example.com',
        phoneNumber: '+1555123456',
        company: 'Creative Design Studio',
        status: 'inactive',
        totalSpent: 5000,
        projectsCompleted: 1,
        createdAt: '2024-01-15',
        history: [
          {
            id: 'h8',
            type: 'quotation',
            title: 'E-commerce Website',
            description: 'Full e-commerce solution with payment integration',
            amount: 5000,
            date: '2024-01-25',
            status: 'completed',
          },
          {
            id: 'h9',
            type: 'receipt',
            title: 'Payment Receipt #1003',
            description: 'Full payment received',
            amount: 5000,
            date: '2024-02-01',
            status: 'paid',
          },
        ],
      },
    ];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (mode: 'create' | 'edit' | 'view', customer?: Customer) => {
    setModalMode(mode);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber || '',
        company: customer.company || '',
        address: customer.address || '',
        status: customer.status,
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        company: '',
        address: '',
        status: 'active',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'create') {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        totalSpent: 0,
        projectsCompleted: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCustomer]);
      toast.success('Customer created successfully!');
    } else if (modalMode === 'edit' && selectedCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id ? { ...c, ...formData } : c
        )
      );
      toast.success('Customer updated successfully!');
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter((c) => c.id !== id));
      toast.success('Customer deleted successfully!');
    }
  };

  const toggleRowExpansion = (customerId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-3 md:p-4 space-y-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Customers
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your customer relationships and track interactions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal('create')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">Total Customers</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{customers.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {customers.filter((c) => c.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer, index) => (
                <Fragment key={customer.id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleRowExpansion(customer.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpansion(customer.id);
                          }}
                        >
                          {expandedRows.has(customer.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {customer.phoneNumber && (
                        <span className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {customer.phoneNumber}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {customer.company ? (
                      <span className="flex items-center gap-2 text-sm text-gray-900">
                        <Building className="w-4 h-4 text-gray-400" />
                        {customer.company}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        ${customer.totalSpent.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {customer.projectsCompleted} projects
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal('view', customer);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal('edit', customer);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(customer.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>

                {/* Accordion Content - Customer History */}
                <AnimatePresence>
                  {expandedRows.has(customer.id) && customer.history && customer.history.length > 0 && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-primary" />
                            <h4 className="font-semibold text-gray-900">Customer History</h4>
                          </div>
                          <div className="grid gap-2">
                            {customer.history.map((item) => (
                              <div
                                key={item.id}
                                className="bg-white rounded-lg p-3 border border-gray-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg ${
                                      item.type === 'quotation' ? 'bg-blue-100' :
                                      item.type === 'receipt' ? 'bg-green-100' :
                                      item.type === 'project' ? 'bg-purple-100' : 'bg-gray-100'
                                    }`}>
                                      {item.type === 'quotation' && <FileText className="w-4 h-4 text-blue-600" />}
                                      {item.type === 'receipt' && <Receipt className="w-4 h-4 text-green-600" />}
                                      {item.type === 'project' && <Briefcase className="w-4 h-4 text-purple-600" />}
                                      {item.type === 'note' && <FileText className="w-4 h-4 text-gray-600" />}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-gray-900 text-sm">{item.title}</h5>
                                      <p className="text-xs text-gray-600">{item.description}</p>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span>{new Date(item.date).toLocaleDateString()}</span>
                                        {item.status && (
                                          <span className={`px-2 py-0.5 rounded-full font-medium ${
                                            item.status === 'completed' || item.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                          }`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {item.amount && (
                                    <span className="font-bold text-gray-900 text-sm">${item.amount.toLocaleString()}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </Fragment>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No customers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {modalMode === 'create' && 'Add New Customer'}
                  {modalMode === 'edit' && 'Edit Customer'}
                  {modalMode === 'view' && 'Customer Details'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === 'view'}
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={modalMode === 'view'}
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={modalMode === 'view'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      disabled={modalMode === 'view'}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      disabled={modalMode === 'view'}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    disabled={modalMode === 'view'}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    disabled={modalMode === 'view'}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
                  />
                </div>

                {modalMode !== 'view' && (
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      {modalMode === 'create' ? 'Create Customer' : 'Update Customer'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
