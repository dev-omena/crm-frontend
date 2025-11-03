'use client';

/**
 * Quotations Management Page
 *
 * Features:
 * - View all quotations with filters
 * - Create new quotations
 * - Search and filter by status, customer, date
 * - Convert quotations to invoices
 */

import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
  Send,
  CheckCircle2,
  Calendar,
  DollarSign,
  Clock,
  XCircle,
  TrendingUp,
  FileCheck,
  FileClock,
  X,
  Package,
  Search,
  Printer,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockMenuItems, mockCustomers, getCustomerDisplayName, getActiveCustomers, type MenuItem, type Customer } from '@/lib/dataStore';
import { DocumentGeneratorFactory, type QuotationData } from '@/lib/pdfGenerator';
import { PageHeader, SearchFilterBar, GridCard, DataTable, EmptyState, FormModal, FormField, ViewField } from '@/components/dashboard';

interface QuotationItem {
  id: string;
  quotationNumber: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdDate: string;
  items: number;
}

const mockQuotations: QuotationItem[] = [
  {
    id: '1',
    quotationNumber: 'QUO-2024-001',
    customer: { name: 'Tech Solutions Inc', email: 'contact@techsolutions.com' },
    amount: 12500,
    validUntil: '2024-02-15',
    status: 'sent',
    createdDate: '2024-01-15',
    items: 8,
  },
  {
    id: '2',
    quotationNumber: 'QUO-2024-002',
    customer: { name: 'Digital Marketing Pro', email: 'info@digitalmarketing.com' },
    amount: 8900,
    validUntil: '2024-02-20',
    status: 'accepted',
    createdDate: '2024-01-18',
    items: 5,
  },
  {
    id: '3',
    quotationNumber: 'QUO-2024-003',
    customer: { name: 'Creative Design Studio', email: 'hello@creativedesign.com' },
    amount: 15200,
    validUntil: '2024-02-25',
    status: 'draft',
    createdDate: '2024-01-20',
    items: 12,
  },
  {
    id: '4',
    quotationNumber: 'QUO-2024-004',
    customer: { name: 'Startup Ventures LLC', email: 'contact@startupventures.com' },
    amount: 6800,
    validUntil: '2024-01-30',
    status: 'expired',
    createdDate: '2024-01-10',
    items: 4,
  },
  {
    id: '5',
    quotationNumber: 'QUO-2024-005',
    customer: { name: 'Global Enterprises', email: 'billing@globalent.com' },
    amount: 9500,
    validUntil: '2024-02-05',
    status: 'rejected',
    createdDate: '2024-01-12',
    items: 7,
  },
  {
    id: '6',
    quotationNumber: 'QUO-2024-006',
    customer: { name: 'Innovative Solutions Ltd', email: 'info@innovative.com' },
    amount: 18900,
    validUntil: '2024-02-28',
    status: 'sent',
    createdDate: '2024-01-22',
    items: 10,
  },
];

const stats = [
  {
    label: 'Total Quotations',
    value: '156',
    change: '+24',
    icon: FileText,
    color: 'blue',
  },
  {
    label: 'Potential Revenue',
    value: '$245,890',
    change: '+32%',
    icon: DollarSign,
    color: 'green',
  },
  {
    label: 'Accepted',
    value: '78',
    change: '+15',
    icon: FileCheck,
    color: 'emerald',
  },
  {
    label: 'Pending',
    value: '42',
    change: '+8',
    icon: FileClock,
    color: 'yellow',
  },
];

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [quotations, setQuotations] = useState<QuotationItem[]>(mockQuotations);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    quotationNumber: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    amount: '',
    status: 'draft' as QuotationItem['status'],
    createdDate: '',
    validUntil: '',
    items: '1',
  });

  // Customer selection state
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // Menu items selection state
  const [selectedMenuItems, setSelectedMenuItems] = useState<Array<{ menuItem: MenuItem; quantity: number }>>([]);
  const [showMenuItemsModal, setShowMenuItemsModal] = useState(false);
  const [menuSearchTerm, setMenuSearchTerm] = useState('');

  const activeCustomers = getActiveCustomers(mockCustomers);
  const availableMenuItems = mockMenuItems.filter((item: MenuItem) => item.available);

  const filteredCustomers = useMemo(() => {
    if (!customerSearchTerm) return activeCustomers;
    const search = customerSearchTerm.toLowerCase();
    return activeCustomers.filter((c: Customer) =>
      getCustomerDisplayName(c).toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search)
    );
  }, [customerSearchTerm, activeCustomers]);

  const filteredMenuItems = useMemo(() => {
    if (!menuSearchTerm) return availableMenuItems;
    const search = menuSearchTerm.toLowerCase();
    return availableMenuItems.filter((item: MenuItem) =>
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  }, [menuSearchTerm, availableMenuItems]);

  const totalAmount = useMemo(() => {
    return selectedMenuItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }, [selectedMenuItems]);

  const handleSelectCustomer = (customer: Customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      customerName: customer.company || `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email
    });
    setCustomerSearchTerm('');
    setShowCustomerDropdown(false);
  };

  const handleAddMenuItem = (menuItem: MenuItem) => {
    const existingItem = selectedMenuItems.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      setSelectedMenuItems(selectedMenuItems.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedMenuItems([...selectedMenuItems, { menuItem, quantity: 1 }]);
    }
  };

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedMenuItems(selectedMenuItems.filter(item => item.menuItem.id !== menuItemId));
    } else {
      setSelectedMenuItems(selectedMenuItems.map(item =>
        item.menuItem.id === menuItemId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const handleRemoveMenuItem = (menuItemId: string) => {
    setSelectedMenuItems(selectedMenuItems.filter(item => item.menuItem.id !== menuItemId));
  };

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'expired':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'draft':
        return <Edit className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Action handlers
  const openViewModal = (quotation: QuotationItem) => {
    setSelectedQuotation(quotation);
    setShowViewModal(true);
  };

  const openEditModal = (quotation: QuotationItem) => {
    setSelectedQuotation(quotation);
    setFormData({
      quotationNumber: quotation.quotationNumber,
      customerId: '',
      customerName: quotation.customer.name,
      customerEmail: quotation.customer.email,
      amount: quotation.amount.toString(),
      status: quotation.status,
      createdDate: quotation.createdDate,
      validUntil: quotation.validUntil,
      items: quotation.items.toString(),
    });
    setShowEditModal(true);
  };

  const handlePrintQuotation = (quotation: QuotationItem) => {
    // Convert QuotationItem to QuotationData format
    const quotationData: QuotationData = {
      quotationNumber: quotation.quotationNumber,
      customer: {
        name: quotation.customer.name,
        email: quotation.customer.email,
      },
      amount: quotation.amount,
      createdDate: quotation.createdDate,
      validUntil: quotation.validUntil,
      status: quotation.status,
      items: quotation.items,
    };

    // Use OOP approach with Factory pattern
    const generator = DocumentGeneratorFactory.createQuotationGenerator(quotationData);
    generator.printQuotation();
  };

  const handleDownloadQuotation = (quotation: QuotationItem) => {
    // Convert QuotationItem to QuotationData format
    const quotationData: QuotationData = {
      quotationNumber: quotation.quotationNumber,
      customer: {
        name: quotation.customer.name,
        email: quotation.customer.email,
      },
      amount: quotation.amount,
      createdDate: quotation.createdDate,
      validUntil: quotation.validUntil,
      status: quotation.status,
      items: quotation.items,
    };

    // Use OOP approach with Factory pattern
    const generator = DocumentGeneratorFactory.createQuotationGenerator(quotationData);
    generator.downloadQuotation();
  };

  const handleEditSave = () => {
    if (!selectedQuotation) return;
    const amount = parseFloat(formData.amount || '0');
    const items = parseInt(formData.items || '1', 10);
    const updated: QuotationItem = {
      ...selectedQuotation,
      quotationNumber: formData.quotationNumber || selectedQuotation.quotationNumber,
      customer: { name: formData.customerName, email: formData.customerEmail },
      amount: isNaN(amount) ? selectedQuotation.amount : amount,
      status: formData.status,
      createdDate: formData.createdDate || selectedQuotation.createdDate,
      validUntil: formData.validUntil || selectedQuotation.validUntil,
      items: isNaN(items) ? selectedQuotation.items : items,
    };
    setQuotations((prev) => prev.map((q) => (q.id === selectedQuotation.id ? updated : q)));
    setShowEditModal(false);
    setSelectedQuotation(null);
  };

  const handleSendQuotation = (quotation: QuotationItem) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotation.id ? { ...q, status: 'sent' } : q))
    );
  };

  const handleAddQuotation = () => {
    const amount = parseFloat(formData.amount || '0');
    const newQuotation: QuotationItem = {
      id: (quotations.length + 1).toString(),
      quotationNumber:
        formData.quotationNumber || `QUO-${new Date().getFullYear()}-${String(quotations.length + 1).padStart(3, '0')}`,
      customer: { name: formData.customerName, email: formData.customerEmail },
      amount,
      validUntil: formData.validUntil || new Date().toISOString().slice(0, 10),
      status: formData.status,
      createdDate: formData.createdDate || new Date().toISOString().slice(0, 10),
      items: parseInt(formData.items || '1', 10),
    };
    setQuotations([...quotations, newQuotation]);
    setShowAddModal(false);
    setFormData({
      quotationNumber: '',
      customerId: '',
      customerName: '',
      customerEmail: '',
      amount: '',
      status: 'draft',
      createdDate: '',
      validUntil: '',
      items: '1',
    });
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header */}
      <PageHeader
        icon={FileText}
        title="Quotations Management"
        description="Create and manage quotations for your customers"
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={() => console.log('Exporting quotations...')}
        onAdd={() => setShowAddModal(true)}
        addButtonText="New Quotation"
      />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by quotation number or customer..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterOptions={[
          {
            label: 'Status',
            value: statusFilter,
            options: ['all', 'draft', 'sent', 'accepted', 'rejected', 'expired'].map(status => ({
              label: status.charAt(0).toUpperCase() + status.slice(1),
              value: status,
            })),
            onChange: setStatusFilter,
            type: 'buttons',
          },
        ]}
        activeFilters={{ Status: statusFilter }}
      />

      {/* Quotations - Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredQuotations.map((quotation, index) => (
            <GridCard
              key={quotation.id}
              title={quotation.quotationNumber}
              subtitle={quotation.customer.name}
              description={quotation.customer.email}
              badge={{
                text: quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1),
                className: getStatusColor(quotation.status),
              }}
              amount={{
                label: 'Quotation Amount',
                value: `$${quotation.amount.toLocaleString()}`,
                subtext: `${quotation.items} items`,
              }}
              details={[
                {
                  label: 'Created',
                  value: new Date(quotation.createdDate).toLocaleDateString(),
                  icon: Calendar,
                },
                {
                  label: 'Valid Until',
                  value: new Date(quotation.validUntil).toLocaleDateString(),
                  icon: Clock,
                },
              ]}
              onView={() => openViewModal(quotation)}
              onEdit={() => openEditModal(quotation)}
              onDelete={() => handleSendQuotation(quotation)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Quotations - List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={[
            {
              header: 'Quotation',
              accessor: 'quotationNumber',
              render: (value: string, row: QuotationItem) => (
                <div>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">Created {new Date(row.createdDate).toLocaleDateString()}</p>
                </div>
              ),
            },
            {
              header: 'Customer',
              accessor: 'customer',
              render: (value: { name: string; email: string }) => (
                <div>
                  <p className="text-sm font-medium text-gray-900">{value.name}</p>
                  <p className="text-xs text-gray-500">{value.email}</p>
                </div>
              ),
            },
            {
              header: 'Amount',
              accessor: 'amount',
              render: (value: number, row: QuotationItem) => (
                <div>
                  <p className="text-sm font-semibold text-gray-900">${value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{row.items} items</p>
                </div>
              ),
            },
            {
              header: 'Status',
              accessor: 'status',
              render: (value: string) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
                  {getStatusIcon(value)}
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              ),
            },
            {
              header: 'Valid Until',
              accessor: 'validUntil',
              render: (value: string) => (
                <div className="flex items-center gap-1 text-xs text-gray-700">
                  <Clock className="w-3 h-3" />
                  {new Date(value).toLocaleDateString()}
                </div>
              ),
            },
          ]}
          data={filteredQuotations}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={handleSendQuotation}
        />
      )}

      {filteredQuotations.length === 0 && (
        <EmptyState
          icon={Package}
          title="No quotations found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Pagination */}
      {filteredQuotations.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredQuotations.length}</span> of{' '}
            <span className="font-medium">{quotations.length}</span> quotations
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-all">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add Quotation Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
        title="New Quotation"
        icon={Plus}
        maxWidth="2xl"
        onSave={handleAddQuotation}
        saveButtonText="Add Quotation"
      >
        <FormField label="Quotation Number">
          <input
            type="text"
            value={formData.quotationNumber}
            onChange={(e) => setFormData({ ...formData, quotationNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Auto-generated if empty"
          />
        </FormField>

        {/* Customer Selection */}
        <FormField label="Select Customer" required>
          {!formData.customerName ? (
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
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                <div className="font-medium text-gray-900">{formData.customerName}</div>
                <div className="text-sm text-gray-600">{formData.customerEmail}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, customerId: '', customerName: '', customerEmail: '' });
                  setCustomerSearchTerm('');
                }}
                className="p-1 hover:bg-green-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </FormField>

        {/* Menu Items Selection */}
        <FormField label="Services / Items">
          <button
            type="button"
            onClick={() => setShowMenuItemsModal(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-gray-600 hover:text-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Services / Items
          </button>

          {selectedMenuItems.length > 0 && (
            <div className="mt-3 space-y-2">
              {selectedMenuItems.map((item) => (
                <div key={item.menuItem.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.menuItem.name}</div>
                    <div className="text-sm text-gray-600">${item.menuItem.price.toFixed(2)} each</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                      >
                        <span className="text-lg font-bold text-gray-600">−</span>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                      >
                        <span className="text-lg font-bold text-gray-600">+</span>
                      </button>
                    </div>
                    <div className="text-sm font-bold text-gray-900 w-20 text-right">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMenuItem(item.menuItem.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg">
                <span className="font-bold text-gray-900">Total Amount:</span>
                <span className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Status">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as QuotationItem['status'] })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </FormField>
          <FormField label="Created Date">
            <input
              type="date"
              value={formData.createdDate}
              onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Valid Until">
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>
      </FormModal>

      {/* View Quotation Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        mode="view"
        title="Quotation Details"
        icon={Eye}
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => selectedQuotation && handlePrintQuotation(selectedQuotation)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={() => selectedQuotation && handleDownloadQuotation(selectedQuotation)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => {
                setShowViewModal(false);
                if (selectedQuotation) openEditModal(selectedQuotation);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          </div>
        }
      >
        {selectedQuotation && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <ViewField label="Quotation" value={selectedQuotation.quotationNumber} />
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedQuotation.status)}`}>
                {getStatusIcon(selectedQuotation.status)}
                {selectedQuotation.status.charAt(0).toUpperCase() + selectedQuotation.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField
                label="Customer"
                value={
                  <div>
                    <p className="font-medium">{selectedQuotation.customer.name}</p>
                    <p className="text-xs text-gray-500">{selectedQuotation.customer.email}</p>
                  </div>
                }
              />
              <ViewField
                label="Amount"
                value={
                  <div>
                    <p className="font-bold">${selectedQuotation.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{selectedQuotation.items} items</p>
                  </div>
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField
                label="Created"
                value={
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedQuotation.createdDate).toLocaleDateString()}
                  </div>
                }
              />
              <ViewField
                label="Valid Until"
                value={
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(selectedQuotation.validUntil).toLocaleDateString()}
                  </div>
                }
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Edit Quotation Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        title="Edit Quotation"
        icon={Edit}
        maxWidth="2xl"
        onSave={handleEditSave}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Quotation Number">
            <input
              type="text"
              value={formData.quotationNumber}
              onChange={(e) => setFormData({ ...formData, quotationNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
          <FormField label="Items Count">
            <input
              type="number"
              min={1}
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Customer Name">
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
          <FormField label="Customer Email">
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Amount">
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
          <FormField label="Status">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as QuotationItem['status'] })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </FormField>
          <FormField label="Created Date">
            <input
              type="date"
              value={formData.createdDate}
              onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Valid Until">
            <input
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </FormField>
        </div>
      </FormModal>
    </div>
  );
}
