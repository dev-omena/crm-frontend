'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HardDrive,
  File,
  Upload,
  Eye,
  Edit2,
  Trash2,
  Plus,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  Calendar,
  User,
  Download,
  Play,
  Image as ImageIcon,
  Video as VideoIcon,
  LayoutGrid,
  List,
  Search,
} from 'lucide-react';
import {
  SearchFilterBar,
  EmptyState,
  FormModal,
  FormField,
  ViewField,
  DataTable,
} from '@/components/dashboard';

interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'archive' | 'other';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category?: string;
  tags?: string[];
  description?: string;
  url?: string;
  thumbnail?: string;
  dimensions?: string;
}

export default function DrivePage() {
  const [items, setItems] = useState<FileItem[]>([
    // Files
    {
      id: '1',
      name: 'Project Proposal.pdf',
      type: 'document',
      size: '2.5 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-01-15',
      category: 'Documents',
      tags: ['proposal', 'project'],
      description: 'Q1 2024 project proposal'
    },
    {
      id: '2',
      name: 'Financial Report 2024.xlsx',
      type: 'document',
      size: '1.2 MB',
      uploadedBy: 'Finance Dept',
      uploadedAt: '2024-01-20',
      category: 'Financial',
      tags: ['finance', 'report'],
      description: 'Annual financial summary'
    },
    {
      id: '3',
      name: 'Backup_Jan2024.zip',
      type: 'archive',
      size: '128 MB',
      uploadedBy: 'IT Team',
      uploadedAt: '2024-01-25',
      category: 'Backups',
      description: 'Monthly backup archive'
    },
    {
      id: '4',
      name: 'Client Contract.docx',
      type: 'document',
      size: '856 KB',
      uploadedBy: 'Legal Team',
      uploadedAt: '2024-01-28',
      category: 'Legal',
      tags: ['contract', 'legal'],
      description: 'Standard client service agreement'
    },
    // Media
    {
      id: '5',
      name: 'Company Logo.png',
      type: 'image',
      size: '856 KB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-01-18',
      category: 'Branding',
      tags: ['logo', 'branding'],
      description: 'Official company logo - high resolution',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      dimensions: '2000x2000'
    },
    {
      id: '6',
      name: 'Product Photo 1.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      uploadedBy: 'Marketing Team',
      uploadedAt: '2024-01-15',
      size: '2.3 MB',
      dimensions: '1920x1080',
      category: 'Products',
      tags: ['product', 'photography'],
      description: 'Professional product photography for catalog'
    },
    {
      id: '7',
      name: 'Company Event.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500',
      uploadedBy: 'HR Team',
      uploadedAt: '2024-01-18',
      size: '3.1 MB',
      dimensions: '1920x1280',
      category: 'Events',
      tags: ['event', 'team'],
      description: 'Annual company gathering'
    },
    {
      id: '8',
      name: 'Promo Video.mp4',
      type: 'video',
      url: 'https://example.com/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500',
      uploadedBy: 'Marketing Team',
      uploadedAt: '2024-01-20',
      size: '45.2 MB',
      dimensions: '1920x1080',
      category: 'Marketing',
      tags: ['promo', 'video', 'marketing'],
      description: 'Q1 promotional video campaign'
    },
    {
      id: '9',
      name: 'Office Space.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-22',
      size: '2.8 MB',
      dimensions: '1920x1080',
      category: 'Office',
      tags: ['office', 'workspace'],
      description: 'New office layout photos'
    },
    {
      id: '10',
      name: 'Client Testimonial.mp4',
      type: 'video',
      url: 'https://example.com/video2.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1551847812-f4796f84e6f9?w=500',
      uploadedBy: 'Marketing Team',
      uploadedAt: '2024-01-25',
      size: '32.5 MB',
      dimensions: '1920x1080',
      category: 'Testimonials',
      tags: ['testimonial', 'client', 'video'],
      description: 'Client success story video'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'files' | 'media'>('files');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'document' as 'document' | 'image' | 'video' | 'archive' | 'other',
    size: '',
    category: '',
    tags: [] as string[],
    description: '',
    uploadTo: 'drive' as 'drive' | 'gallery',
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'document',
      size: '',
      category: '',
      tags: [],
      description: '',
      uploadTo: 'drive',
    });
    setUploadedFile(null);
    setFilePreview(null);
    setTagInput('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const determineFileType = (file: File): 'document' | 'image' | 'video' | 'archive' | 'other' => {
    const type = file.type;
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar') || type.includes('gz')) return 'archive';
    if (type.includes('pdf') || type.includes('document') || type.includes('text') || type.includes('sheet') || type.includes('presentation')) return 'document';
    return 'other';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // Auto-fill form data
    const fileType = determineFileType(file);
    const fileSize = formatFileSize(file.size);

    setFormData({
      ...formData,
      name: file.name,
      type: fileType,
      size: fileSize,
      uploadTo: fileType === 'image' || fileType === 'video' ? 'gallery' : 'drive',
    });

    // Generate preview for images and videos
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAdd = () => {
    const newItem: FileItem = {
      id: (items.length + 1).toString(),
      name: formData.name,
      type: formData.type,
      size: formData.size,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
      category: formData.category || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      description: formData.description || undefined,
    };
    setItems([...items, newItem]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedItem) {
      setItems(items.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              name: formData.name,
              type: formData.type,
              size: formData.size,
              category: formData.category || undefined,
              tags: formData.tags.length > 0 ? formData.tags : undefined,
              description: formData.description || undefined,
            }
          : item
      ));
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItems(items.filter(item => item.id !== selectedItem.id));
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const openEditModal = (item: FileItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      size: item.size,
      category: item.category || '',
      tags: item.tags || [],
      description: item.description || '',
      uploadTo: item.type === 'image' || item.type === 'video' ? 'gallery' : 'drive',
    });
    setShowEditModal(true);
  };

  const openViewModal = (item: FileItem) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const openDeleteModal = (item: FileItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Filter items by active tab
  const tabFilteredItems = items.filter(item => {
    if (activeTab === 'files') {
      return item.type === 'document' || item.type === 'archive' || item.type === 'other';
    } else {
      return item.type === 'image' || item.type === 'video';
    }
  });

  const filteredItems = tabFilteredItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = useMemo(() => {
    const fileCount = items.filter(i => i.type === 'document' || i.type === 'archive' || i.type === 'other').length;
    const imageCount = items.filter(i => i.type === 'image').length;
    const videoCount = items.filter(i => i.type === 'video').length;
    const totalSize = items.reduce((acc, item) => {
      const sizeInMB = parseFloat(item.size.replace(/[^0-9.]/g, ''));
      return acc + (item.size.includes('GB') ? sizeInMB * 1024 : sizeInMB);
    }, 0);

    return {
      fileCount,
      imageCount,
      videoCount,
      mediaCount: imageCount + videoCount,
      totalSize: totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} GB` : `${totalSize.toFixed(0)} MB`
    };
  }, [items]);

  const categories = Array.from(new Set(tabFilteredItems.filter(i => i.category).map(i => i.category)));

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'image': return FileImage;
      case 'video': return FileVideo;
      case 'archive': return FileArchive;
      default: return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'image': return 'bg-green-100 text-green-800 border-green-300';
      case 'video': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'archive': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const MediaCard = ({ item, index }: { item: FileItem; index: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
      >
        {/* Image/Video Preview */}
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
              </div>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-center gap-2">
              <button
                onClick={() => openViewModal(item)}
                className="p-2 bg-white/95 text-gray-700 rounded-lg hover:bg-white transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEditModal(item)}
                className="p-2 bg-white/95 text-gray-700 rounded-lg hover:bg-white transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => openDeleteModal(item)}
                className="p-2 bg-white/95 text-red-600 rounded-lg hover:bg-white transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 bg-white/95 text-gray-700 rounded-lg hover:bg-white transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">{item.name}</h3>
            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(item.type)}`}>
              {item.type}
            </span>
          </div>

          {item.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{item.uploadedBy}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.dimensions && (
                <span className="text-gray-400">{item.dimensions}</span>
              )}
              <span className="font-medium text-gray-600">{item.size}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const FileCard = ({ item, index }: { item: FileItem; index: number }) => {
    const Icon = getFileIcon(item.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all group cursor-pointer"
        onClick={() => openViewModal(item)}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-3 rounded-lg ${getFileTypeColor(item.type).replace('border', 'border-0')}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.category || 'Uncategorized'}</p>
          </div>
        </div>

        {item.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{item.uploadedBy}</span>
          </div>
          <span className="font-medium text-gray-600">{item.size}</span>
        </div>

        {/* Hidden Actions on Hover */}
        <div className="hidden group-hover:flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); openViewModal(item); }}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
            className="p-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openDeleteModal(item); }}
            className="p-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <HardDrive className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Drive & Media</h1>
            <p className="text-sm text-gray-600">
              {stats.fileCount} files • {stats.mediaCount} media • {stats.totalSize}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          {activeTab === 'media' && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'files'
              ? 'text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <File className="w-4 h-4" />
            Files
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'files'
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {stats.fileCount}
            </span>
          </div>
          {activeTab === 'files' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-3 font-medium text-sm transition-colors relative ${
            activeTab === 'media'
              ? 'text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Media
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'media'
                ? 'bg-primary/10 text-primary'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {stats.mediaCount}
            </span>
          </div>
          {activeTab === 'media' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Search ${activeTab}...`}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterOptions={[
          {
            label: 'Category',
            value: categoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              ...categories.map(cat => ({ label: cat!, value: cat! })),
            ],
            onChange: setCategoryFilter,
            type: 'select',
          },
        ]}
        activeFilters={{ Category: categoryFilter }}
      />

      {/* Content Display */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon={activeTab === 'files' ? File : ImageIcon}
          title={`No ${activeTab} found`}
          description="Try adjusting your search or upload new files"
        />
      ) : activeTab === 'files' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <FileCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <MediaCard key={item.id} item={item} index={index} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <DataTable
          columns={[
            {
              header: 'Name',
              accessor: 'name',
              render: (_value: string, row: FileItem) => (
                <div className="flex items-center gap-3">
                  {row.type === 'image' ? (
                    <img src={row.url} alt={row.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <VideoIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{row.name}</div>
                    {row.description && (
                      <div className="text-xs text-gray-500 line-clamp-1">{row.description}</div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: 'Type',
              accessor: 'type',
              render: (value: string) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getFileTypeColor(value)}`}>
                  {value}
                </span>
              ),
            },
            {
              header: 'Category',
              accessor: 'category',
              render: (value: string | undefined) => (
                <span className="text-sm text-gray-700">{value || '-'}</span>
              ),
            },
            {
              header: 'Size',
              accessor: 'size',
              render: (value: string) => (
                <span className="text-sm text-gray-700">{value}</span>
              ),
            },
            {
              header: 'Uploaded By',
              accessor: 'uploadedBy',
              render: (value: string) => (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{value}</span>
                </div>
              ),
            },
            {
              header: 'Date',
              accessor: 'uploadedAt',
              render: (value: string) => (
                <div className="flex items-center gap-1 text-sm text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              ),
            },
            {
              header: 'Tags',
              accessor: 'tags',
              render: (value: string[] | undefined) => (
                <div className="flex flex-wrap gap-1">
                  {value && value.length > 0 ? (
                    <>
                      {value.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {value.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          +{value.length - 2}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              ),
            },
          ]}
          data={filteredItems}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {/* View Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        mode="view"
        title="File Details"
        icon={Eye}
        maxWidth="md"
      >
        {selectedItem && (
          <>
            {(selectedItem.type === 'image' || selectedItem.type === 'video') && (
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                {selectedItem.type === 'image' ? (
                  <img src={selectedItem.url} alt={selectedItem.name} className="w-full" />
                ) : (
                  <div className="relative aspect-video">
                    <img src={selectedItem.thumbnail} alt={selectedItem.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ViewField label="Name" value={selectedItem.name} />
            <ViewField
              label="Type"
              value={
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getFileTypeColor(selectedItem.type)}`}>
                  {selectedItem.type}
                </span>
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <ViewField label="Size" value={selectedItem.size} />
              <ViewField label="Category" value={selectedItem.category || 'Uncategorized'} />
            </div>

            {selectedItem.dimensions && (
              <ViewField label="Dimensions" value={selectedItem.dimensions} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <ViewField label="Uploaded By" value={selectedItem.uploadedBy} />
              <ViewField
                label="Upload Date"
                value={new Date(selectedItem.uploadedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
            </div>

            {selectedItem.description && (
              <ViewField label="Description" value={selectedItem.description} />
            )}

            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <ViewField
                label="Tags"
                value={
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                }
              />
            )}
          </>
        )}
      </FormModal>

      {/* Add Modal - Comprehensive File Upload */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        mode="add"
        title="Upload File"
        icon={Upload}
        maxWidth="md"
        onSave={handleAdd}
        saveButtonText="Upload"
      >
        {/* File Upload Input */}
        <FormField label="Select File" required>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-all"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {uploadedFile ? `${formData.size}` : 'Any file type supported'}
              </span>
            </label>
          </div>
        </FormField>

        {/* Preview Section */}
        {filePreview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              {formData.type === 'image' ? (
                <img src={filePreview} alt="Preview" className="w-full max-h-64 object-contain" />
              ) : formData.type === 'video' ? (
                <video src={filePreview} controls className="w-full max-h-64">
                  Your browser does not support the video tag.
                </video>
              ) : null}
            </div>
          </div>
        )}

        {/* Upload Destination */}
        <FormField label="Upload To" required>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadTo"
                value="drive"
                checked={formData.uploadTo === 'drive'}
                onChange={(e) => setFormData({ ...formData, uploadTo: e.target.value as 'drive' | 'gallery' })}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
              />
              <HardDrive className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Drive (Files)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="uploadTo"
                value="gallery"
                checked={formData.uploadTo === 'gallery'}
                onChange={(e) => setFormData({ ...formData, uploadTo: e.target.value as 'drive' | 'gallery' })}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary"
              />
              <ImageIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Gallery (Media)</span>
            </label>
          </div>
        </FormField>

        {/* File Name */}
        <FormField label="File Name" required>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Document.pdf"
          />
        </FormField>

        {/* File Type & Size (Read-only) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type">
            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(formData.type)}`}>
                {formData.type}
              </span>
            </div>
          </FormField>

          <FormField label="Size">
            <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
              {formData.size || 'N/A'}
            </div>
          </FormField>
        </div>

        {/* Category */}
        <FormField label="Category">
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Documents, Marketing, etc."
          />
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Add a description for this file..."
          />
        </FormField>

        {/* Tags */}
        <FormField label="Tags">
          <div className="space-y-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type a tag and press Enter"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormField>
      </FormModal>

      <FormModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        mode="edit"
        title="Edit File"
        icon={Edit2}
        maxWidth="md"
        onSave={handleEdit}
      >
        <FormField label="File Name" required>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Category">
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Description">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>
      </FormModal>

      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        mode="edit"
        title="Delete File"
        icon={Trash2}
        maxWidth="md"
        onSave={handleDelete}
        saveButtonText="Delete"
      >
        {selectedItem && (
          <p className="text-gray-700">
            Are you sure you want to delete &ldquo;{selectedItem.name}&rdquo;? This action cannot be undone.
          </p>
        )}
      </FormModal>
    </div>
  );
}
