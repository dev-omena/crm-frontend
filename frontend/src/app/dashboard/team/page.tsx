'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  Grid3x3,
  List,
  Download,
  Mail,
  Phone,
  Shield,
  Calendar,
  Key,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  AlertCircle,
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
import toast from 'react-hot-toast';

interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  photoURL?: string;
  isOnline: boolean;
  permissions: {
    customers: Permission;
    quotations: Permission;
    receipts: Permission;
    expenses: Permission;
    projects: Permission;
    services: Permission;
  };
  createdAt: string;
  lastLogin?: string;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      email: 'john.doe@omena.com',
      phoneNumber: '+1234567890',
      department: 'Management',
      status: 'active',
      isOnline: true,
      permissions: {
        customers: { read: true, create: true, update: true, delete: true },
        quotations: { read: true, create: true, update: true, delete: true },
        receipts: { read: true, create: true, update: true, delete: true },
        expenses: { read: true, create: true, update: true, delete: true },
        projects: { read: true, create: true, update: true, delete: true },
        services: { read: true, create: true, update: true, delete: true },
      },
      createdAt: '2024-01-15T10:30:00.000Z',
      lastLogin: '2024-03-20T14:30:00.000Z',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      displayName: 'Jane Smith',
      email: 'jane.smith@omena.com',
      phoneNumber: '+1987654321',
      department: 'Sales',
      status: 'active',
      isOnline: true,
      permissions: {
        customers: { read: true, create: true, update: true, delete: false },
        quotations: { read: true, create: true, update: true, delete: false },
        receipts: { read: true, create: true, update: true, delete: false },
        expenses: { read: true, create: true, update: true, delete: false },
        projects: { read: true, create: true, update: true, delete: false },
        services: { read: true, create: true, update: true, delete: false },
      },
      createdAt: '2024-02-10T09:15:00.000Z',
      lastLogin: '2024-03-19T16:45:00.000Z',
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      displayName: 'Mike Johnson',
      email: 'mike.johnson@omena.com',
      phoneNumber: '+1122334455',
      department: 'Finance',
      status: 'active',
      isOnline: false,
      permissions: {
        customers: { read: true, create: false, update: false, delete: false },
        quotations: { read: true, create: false, update: false, delete: false },
        receipts: { read: true, create: false, update: false, delete: false },
        expenses: { read: true, create: true, update: true, delete: false },
        projects: { read: true, create: false, update: false, delete: false },
        services: { read: true, create: false, update: false, delete: false },
      },
      createdAt: '2024-03-01T11:00:00.000Z',
      lastLogin: '2024-03-18T10:20:00.000Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    status: 'active' as TeamMember['status'],
    password: '',
  });

  const [permissionData, setPermissionData] = useState<TeamMember['permissions']>({
    customers: { read: true, create: false, update: false, delete: false },
    quotations: { read: true, create: false, update: false, delete: false },
    receipts: { read: true, create: false, update: false, delete: false },
    expenses: { read: true, create: false, update: false, delete: false },
    projects: { read: true, create: false, update: false, delete: false },
    services: { read: true, create: false, update: false, delete: false },
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(teamMembers.map(m => m.department)));

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      status: 'active',
      password: '',
    });
    setPermissionData({
      customers: { read: true, create: false, update: false, delete: false },
      quotations: { read: true, create: false, update: false, delete: false },
      receipts: { read: true, create: false, update: false, delete: false },
      expenses: { read: true, create: false, update: false, delete: false },
      projects: { read: true, create: false, update: false, delete: false },
      services: { read: true, create: false, update: false, delete: false },
    });
  };

  const openViewModal = (member: TeamMember) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  const openEditModal = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber || '',
      department: member.department,
      status: member.status,
      password: '',
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const openPermissionsModal = (member: TeamMember) => {
    setSelectedMember(member);
    setPermissionData(member.permissions);
    setShowPermissionsModal(true);
  };

  const openPasswordModal = (member: TeamMember) => {
    setSelectedMember(member);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const handleAddMember = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      department: formData.department,
      status: formData.status,
      isOnline: false,
      permissions: permissionData,
      createdAt: new Date().toISOString(),
    };

    setTeamMembers([...teamMembers, newMember]);
    setShowAddModal(false);
    resetForm();
    toast.success('Team member added successfully');
  };

  const handleEditMember = () => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.map((member) =>
      member.id === selectedMember.id
        ? {
            ...member,
            firstName: formData.firstName,
            lastName: formData.lastName,
            displayName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            department: formData.department,
            status: formData.status,
          }
        : member
    );

    setTeamMembers(updatedMembers);
    setShowEditModal(false);
    setSelectedMember(null);
    resetForm();
    toast.success('Team member updated successfully');
  };

  const handleDeleteMember = () => {
    if (!selectedMember) return;

    setTeamMembers(teamMembers.filter((member) => member.id !== selectedMember.id));
    setShowDeleteModal(false);
    setSelectedMember(null);
    toast.success('Team member deleted successfully');
  };

  const handleUpdatePermissions = () => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.map((member) =>
      member.id === selectedMember.id
        ? { ...member, permissions: permissionData }
        : member
    );

    setTeamMembers(updatedMembers);
    setShowPermissionsModal(false);
    setSelectedMember(null);
    toast.success('Permissions updated successfully');
  };

  const handleChangePassword = () => {
    if (!selectedMember) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Simulate password change
    setShowPasswordModal(false);
    setSelectedMember(null);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    toast.success('Password changed successfully');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Status', 'Online Status', 'Created At'];
    const rows = teamMembers.map((member) => [
      member.displayName,
      member.email,
      member.phoneNumber || 'N/A',
      member.department,
      member.status,
      member.isOnline ? 'Online' : 'Offline',
      new Date(member.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  const togglePermission = (module: keyof TeamMember['permissions'], permission: keyof Permission) => {
    setPermissionData((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission],
      },
    }));
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      <PageHeader
        icon={Users}
        title="Team Management"
        description="Manage team members, departments, and permissions"
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={exportToCSV}
        onAdd={() => setShowAddModal(true)}
        addButtonText="Add Member"
      />

      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name or email..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterOptions={[
          {
            label: 'Department',
            value: departmentFilter,
            options: [
              { label: 'All Departments', value: 'all' },
              ...departments.map(dept => ({ label: dept, value: dept })),
            ],
            onChange: setDepartmentFilter,
            type: 'select',
          },
          {
            label: 'Status',
            value: statusFilter,
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Suspended', value: 'suspended' },
            ],
            onChange: setStatusFilter,
            type: 'select',
          },
        ]}
        activeFilters={{ Department: departmentFilter, Status: statusFilter }}
      />

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">{member.displayName}</h3>
                      <p className="text-xs text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 border-blue-200">
                    {member.department}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        member.status
                      )}`}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-gray-800">{member.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className={`text-xs font-medium ${member.isOnline ? 'text-green-700' : 'text-gray-600'}`}>
                        {member.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openViewModal(member)}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(member)}
                    className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openPermissionsModal(member)}
                    className="px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Permissions
                  </button>
                  <button
                    onClick={() => openPasswordModal(member)}
                    className="px-3 py-2 text-sm bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Password
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                    Member
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                    Online Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {member.displayName}
                          </p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{member.phoneNumber || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 border-blue-200">
                        {member.department}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                          member.status
                        )}`}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className={`text-sm font-medium ${member.isOnline ? 'text-green-700' : 'text-gray-600'}`}>
                          {member.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPermissionsModal(member)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title="Manage Permissions"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openPasswordModal(member)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Change Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(member)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMembers.length === 0 && (
        <EmptyState
          icon={Users}
          title="No team members found"
          description="Try adjusting your search or filters"
        />
      )}

      {/* Add Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        mode="add"
        title="Add Team Member"
        icon={Plus}
        onSave={handleAddMember}
        saveButtonText="Add Member"
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="John"
              />
            </FormField>
            <FormField label="Last Name" required>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Doe"
              />
            </FormField>
          </div>

          <FormField label="Email" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="john.doe@omena.com"
            />
          </FormField>

          <FormField label="Phone Number">
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="+1234567890"
            />
          </FormField>

          <FormField label="Password" required>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="••••••••"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Department" required>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Sales, Marketing, Finance, etc."
              />
            </FormField>
            <FormField label="Status" required>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TeamMember['status'] })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </FormField>
          </div>

          {/* Basic Permissions Preview */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Default permissions will be assigned. You can customize them after creation.
            </p>
          </div>
        </div>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMember(null);
          resetForm();
        }}
        mode="edit"
        title="Edit Team Member"
        icon={Edit2}
        onSave={handleEditMember}
        maxWidth="2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="First Name" required>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </FormField>
            <FormField label="Last Name" required>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </FormField>
          </div>

          <FormField label="Email" required>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <FormField label="Phone Number">
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Department" required>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Sales, Marketing, Finance, etc."
              />
            </FormField>
            <FormField label="Status" required>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TeamMember['status'] })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </FormField>
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedMember(null);
        }}
        mode="view"
        title="Team Member Details"
        icon={Eye}
        maxWidth="2xl"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {selectedMember.firstName[0]}
                  {selectedMember.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedMember.displayName}</h3>
                <p className="text-sm text-gray-600">{selectedMember.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 border-blue-200">
                    {selectedMember.department}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                      selectedMember.status
                    )}`}
                  >
                    {selectedMember.status.charAt(0).toUpperCase() +
                      selectedMember.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ViewField label="Phone Number" value={selectedMember.phoneNumber || 'N/A'} />
              <ViewField
                label="Online Status"
                value={selectedMember.isOnline ? 'Online' : 'Offline'}
              />
              <ViewField
                label="Member Since"
                value={new Date(selectedMember.createdAt).toLocaleDateString()}
              />
              <ViewField
                label="Last Login"
                value={
                  selectedMember.lastLogin
                    ? new Date(selectedMember.lastLogin).toLocaleDateString()
                    : 'Never'
                }
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Permissions Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {Object.entries(selectedMember.permissions).map(([module, perms]) => {
                  const activePerms = Object.entries(perms)
                    .filter(([_, value]) => value)
                    .map(([key]) => key.toUpperCase()[0]);
                  return (
                    <div
                      key={module}
                      className="p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <p className="font-medium text-gray-800 capitalize">{module}</p>
                      <p className="text-gray-600">{activePerms.join(', ') || 'None'}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Modal */}
      <FormModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMember(null);
        }}
        mode="edit"
        title="Delete Team Member"
        icon={Trash2}
        onSave={handleDeleteMember}
        saveButtonText="Delete"
        maxWidth="md"
      >
        {selectedMember && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete <strong>{selectedMember.displayName}</strong>?
            </p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
          </div>
        )}
      </FormModal>

      {/* Permissions Modal */}
      <FormModal
        isOpen={showPermissionsModal}
        onClose={() => {
          setShowPermissionsModal(false);
          setSelectedMember(null);
        }}
        mode="edit"
        title="Manage Permissions"
        icon={Shield}
        onSave={handleUpdatePermissions}
        saveButtonText="Update Permissions"
        maxWidth="4xl"
      >
        {selectedMember && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Managing permissions for {selectedMember.displayName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {selectedMember.department} • {selectedMember.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(permissionData).map(([module, perms]) => {
                const activeCount = Object.values(perms).filter(Boolean).length;
                const totalCount = Object.keys(perms).length;
                const percentage = (activeCount / totalCount) * 100;
                
                return (
                  <div key={module} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-800 capitalize flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-primary" />
                          </div>
                          {module}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600">
                            {activeCount} of {totalCount} enabled
                          </span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(perms).map(([permission, enabled]) => {
                          const icons = {
                            read: '👁️',
                            create: '➕',
                            update: '✏️',
                            delete: '🗑️',
                          };
                          
                          return (
                            <label
                              key={permission}
                              className={`relative flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                enabled
                                  ? 'bg-primary/5 border-primary shadow-sm'
                                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={enabled}
                                onChange={() =>
                                  togglePermission(
                                    module as keyof TeamMember['permissions'],
                                    permission as keyof Permission
                                  )
                                }
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                              />
                              <div className="flex items-center gap-2 flex-1">
                                <span className="text-base">{icons[permission as keyof typeof icons]}</span>
                                <span
                                  className={`text-sm font-medium capitalize ${
                                    enabled ? 'text-primary' : 'text-gray-600'
                                  }`}
                                >
                                  {permission}
                                </span>
                              </div>
                              {enabled && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Changes will take effect immediately after saving.
              </p>
            </div>
          </div>
        )}
      </FormModal>

      {/* Change Password Modal */}
      <FormModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setSelectedMember(null);
          setPasswordData({ newPassword: '', confirmPassword: '' });
        }}
        mode="edit"
        title="Change Password"
        icon={Key}
        onSave={handleChangePassword}
        saveButtonText="Change Password"
        maxWidth="md"
      >
        {selectedMember && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <Key className="w-4 h-4 inline mr-1" />
                Changing password for <strong>{selectedMember.displayName}</strong>
              </p>
            </div>

            <FormField label="New Password" required>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </FormField>

            <FormField label="Confirm Password" required>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </FormField>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Password must be at least 6 characters long.
              </p>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}
