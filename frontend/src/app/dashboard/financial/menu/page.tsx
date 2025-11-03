'use client';

import { useState, useMemo } from 'react';
import {
  Utensils,
  DollarSign,
  Package,
  Star,
  Check,
  Plus,
  X,
} from 'lucide-react';
import {
  PageHeader,
  SearchFilterBar,
  GridCard,
  DataTable,
  Modal,
  EmptyState,
} from '@/components/dashboard';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  features: string[];
  popular: boolean;
  available: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Website Development',
      description: 'Full-stack web development services',
      category: 'Development',
      price: 2500,
      features: ['Responsive Design', 'SEO Optimization', 'Admin Panel'],
      popular: true,
      available: true,
    },
    // ... more items
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Development',
    price: '',
    features: [''],
    popular: false,
    available: true,
  });

  const categories = ['Development', 'Design', 'Marketing', 'Consulting', 'Support', 'Other'];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Development',
      price: '',
      features: [''],
      popular: false,
      available: true,
    });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = useMemo(() => {
    const total = filteredItems.length;
    const avgPrice = total > 0 ? filteredItems.reduce((sum, item) => sum + item.price, 0) / total : 0;
    const available = filteredItems.filter((item) => item.available).length;
    const popular = filteredItems.filter((item) => item.popular).length;

    return {
      total,
      avgPrice,
      available,
      popularCount: popular,
    };
  }, [filteredItems]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Development: 'bg-blue-50 text-blue-700 border-blue-200',
      Design: 'bg-purple-50 text-purple-700 border-purple-200',
      Marketing: 'bg-green-50 text-green-700 border-green-200',
      Consulting: 'bg-orange-50 text-orange-700 border-orange-200',
      Support: 'bg-pink-50 text-pink-700 border-pink-200',
      Other: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Price', 'Features', 'Popular', 'Available'];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map((item: MenuItem) =>
        [item.name, item.category, item.price, item.features.join('; '), item.popular, item.available].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'services-menu.csv';
    a.click();
  };

  // Table columns configuration
  const tableColumns = [
    {
      header: 'Service',
      accessor: 'name',
      render: (value: string, row: MenuItem) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{value}</p>
            {row.popular && <Star className="w-3 h-3 text-yellow-600 fill-yellow-600" />}
          </div>
          <p className="text-xs text-gray-500 line-clamp-1">{row.description}</p>
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
      header: 'Price',
      accessor: 'price',
      render: (value: number) => <p className="text-sm font-semibold text-gray-900">${value.toFixed(2)}</p>,
    },
    {
      header: 'Status',
      accessor: 'available',
      render: (value: boolean) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
            value ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {value ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      header: 'Features',
      accessor: 'features',
      render: (value: string[]) => (
        <div className="text-xs text-gray-700">
          {value.length > 0 ? (
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3 text-green-600" />
              <span>{value.length} features</span>
            </div>
          ) : (
            <span className="text-gray-400">No features</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header with Stats */}
      <PageHeader
        icon={Utensils}
        title="Services Menu"
        description="Manage your service offerings and pricing"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={exportToCSV}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add Service"
        stats={[
          {
            label: 'Total Services',
            value: stats.total.toString(),
            icon: Package,
            color: 'blue',
            change: '+5.2%',
          },
          {
            label: 'Average Price',
            value: `$${stats.avgPrice.toFixed(2)}`,
            icon: DollarSign,
            color: 'green',
            change: '+8.1%',
          },
          {
            label: 'Available',
            value: stats.available.toString(),
            icon: Check,
            color: 'purple',
          },
          {
            label: 'Popular Services',
            value: stats.popularCount.toString(),
            icon: Star,
            color: 'yellow',
          },
        ]}
      />

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search services by name or description..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterOptions={[
          {
            label: 'Category',
            value: categoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              ...categories.map((cat) => ({ label: cat, value: cat })),
            ],
            onChange: setCategoryFilter,
            type: 'select',
          },
        ]}
        activeFilters={{ Category: categoryFilter }}
      />

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredItems.map((item, index) => (
            <GridCard
              key={item.id}
              title={item.name}
              description={item.description}
              badge={
                item.popular
                  ? {
                      text: 'Popular',
                      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    }
                  : item.available
                  ? {
                      text: 'Available',
                      className: 'bg-green-50 text-green-700 border-green-200',
                    }
                  : {
                      text: 'Unavailable',
                      className: 'bg-red-50 text-red-700 border-red-200',
                    }
              }
              amount={{
                label: 'Price',
                value: `$${item.price.toFixed(2)}`,
                subtext: `Category: ${item.category}`,
              }}
              onView={() => {
                setSelectedItem(item);
                setShowViewModal(true);
              }}
              onEdit={() => {
                setSelectedItem(item);
                setFormData({
                  name: item.name,
                  description: item.description,
                  category: item.category,
                  price: item.price.toString(),
                  features: item.features,
                  popular: item.popular,
                  available: item.available,
                });
                setShowEditModal(true);
              }}
              onDelete={() => {
                setSelectedItem(item);
                setShowDeleteModal(true);
              }}
              index={index}
            >
              {/* Custom Features Section */}
              {item.features.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Key Features:</p>
                  <div className="space-y-1">
                    {item.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                    {item.features.length > 3 && (
                      <p className="text-xs text-gray-500 mt-1">+{item.features.length - 3} more</p>
                    )}
                  </div>
                </div>
              )}
            </GridCard>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <DataTable
          columns={tableColumns}
          data={filteredItems}
          onView={(item) => {
            setSelectedItem(item);
            setShowViewModal(true);
          }}
          onEdit={(item) => {
            setSelectedItem(item);
            setFormData({
              name: item.name,
              description: item.description,
              category: item.category,
              price: item.price.toString(),
              features: item.features,
              popular: item.popular,
              available: item.available,
            });
            setShowEditModal(true);
          }}
          onDelete={(item) => {
            setSelectedItem(item);
            setShowDeleteModal(true);
          }}
        />
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <EmptyState
          icon={Package}
          title="No services found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Service">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Website Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief description of the service"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeatureField(index)}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeatureField}
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Available</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle add logic here
                setShowAddModal(false);
                resetForm();
              }}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Add Service
            </button>
          </div>
        </div>
      </Modal>

      {/* Other modals would follow the same pattern... */}
    </div>
  );
}
