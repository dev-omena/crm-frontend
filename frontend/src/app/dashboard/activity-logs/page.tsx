'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  User,
  Calendar,
  Clock,
  Filter,
  Search,
  Eye,
  Edit2,
  Trash2,
  Plus,
  FileText,
  Upload,
  Download,
  LogIn,
  LogOut,
  Settings,
  UserPlus,
  UserMinus,
  CheckSquare,
  AlertCircle,
  DollarSign,
  X,
} from 'lucide-react';
import {
  SearchFilterBar,
  EmptyState,
  FormModal,
  ViewField,
} from '@/components/dashboard';

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'upload' | 'download' | 'other';
  module: 'customers' | 'projects' | 'tasks' | 'drive' | 'financial' | 'team' | 'settings' | 'auth' | 'other';
  description: string;
  targetEntity?: string;
  targetId?: string;
  ipAddress?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      action: 'Created New Customer',
      actionType: 'create',
      module: 'customers',
      description: 'Created customer "Alice Johnson" with email alice.johnson@example.com',
      targetEntity: 'Customer',
      targetId: 'cust_123',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-28T10:30:00Z',
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'Updated Project Status',
      actionType: 'update',
      module: 'projects',
      description: 'Changed project "Website Redesign" status from In Progress to Completed',
      targetEntity: 'Project',
      targetId: 'proj_456',
      ipAddress: '192.168.1.101',
      timestamp: '2024-01-28T10:25:00Z',
    },
    {
      id: '3',
      userId: 'user1',
      userName: 'John Doe',
      action: 'Uploaded File',
      actionType: 'upload',
      module: 'drive',
      description: 'Uploaded file "Q1_Report.pdf" to Drive',
      targetEntity: 'File',
      targetId: 'file_789',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-28T10:20:00Z',
    },
    {
      id: '4',
      userId: 'user3',
      userName: 'Mike Wilson',
      action: 'User Login',
      actionType: 'login',
      module: 'auth',
      description: 'Successfully logged in to the system',
      ipAddress: '192.168.1.102',
      timestamp: '2024-01-28T09:00:00Z',
    },
    {
      id: '5',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'Created Task',
      actionType: 'create',
      module: 'tasks',
      description: 'Created task "Review client proposal" assigned to Mike Wilson',
      targetEntity: 'Task',
      targetId: 'task_321',
      ipAddress: '192.168.1.101',
      timestamp: '2024-01-28T08:45:00Z',
    },
    {
      id: '6',
      userId: 'user1',
      userName: 'John Doe',
      action: 'Deleted Expense',
      actionType: 'delete',
      module: 'financial',
      description: 'Deleted expense record "Office Supplies - $150"',
      targetEntity: 'Expense',
      targetId: 'exp_654',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-28T08:30:00Z',
    },
    {
      id: '7',
      userId: 'user3',
      userName: 'Mike Wilson',
      action: 'Updated Settings',
      actionType: 'update',
      module: 'settings',
      description: 'Changed email notification preferences',
      targetEntity: 'Settings',
      ipAddress: '192.168.1.102',
      timestamp: '2024-01-28T08:15:00Z',
    },
    {
      id: '8',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'Downloaded Report',
      actionType: 'download',
      module: 'financial',
      description: 'Downloaded financial report "January_2024_Summary.xlsx"',
      targetEntity: 'Report',
      targetId: 'report_987',
      ipAddress: '192.168.1.101',
      timestamp: '2024-01-28T08:00:00Z',
    },
    {
      id: '9',
      userId: 'user1',
      userName: 'John Doe',
      action: 'Added Team Member',
      actionType: 'create',
      module: 'team',
      description: 'Added new team member "Sarah Johnson" as Project Manager',
      targetEntity: 'TeamMember',
      targetId: 'team_555',
      ipAddress: '192.168.1.100',
      timestamp: '2024-01-27T16:30:00Z',
    },
    {
      id: '10',
      userId: 'user2',
      userName: 'Jane Smith',
      action: 'Viewed Customer Details',
      actionType: 'view',
      module: 'customers',
      description: 'Viewed customer profile for "Tech Solutions Inc"',
      targetEntity: 'Customer',
      targetId: 'cust_789',
      ipAddress: '192.168.1.101',
      timestamp: '2024-01-27T15:45:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const openViewModal = (log: ActivityLog) => {
    setSelectedLog(log);
    setShowViewModal(true);
  };

  // Get unique users for filter
  const users = Array.from(new Set(logs.map(log => log.userName)));

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesActionType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter;
      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesUser = userFilter === 'all' || log.userName === userFilter;

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const logDate = new Date(log.timestamp);
        const now = new Date();

        if (dateFilter === 'today') {
          matchesDate = logDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
        }
      }

      return matchesSearch && matchesActionType && matchesModule && matchesUser && matchesDate;
    });
  }, [logs, searchTerm, actionTypeFilter, moduleFilter, userFilter, dateFilter]);

  const stats = useMemo(() => {
    const totalActivities = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.userId)).size;
    const todayActivities = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalActivities,
      uniqueUsers,
      todayActivities,
    };
  }, [logs]);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create': return Plus;
      case 'update': return Edit2;
      case 'delete': return Trash2;
      case 'view': return Eye;
      case 'login': return LogIn;
      case 'logout': return LogOut;
      case 'upload': return Upload;
      case 'download': return Download;
      default: return Activity;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create': return 'bg-green-100 text-green-800 border-green-300';
      case 'update': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delete': return 'bg-red-100 text-red-800 border-red-300';
      case 'view': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'login': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'logout': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'upload': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'download': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'customers': return 'bg-blue-50 text-blue-700';
      case 'projects': return 'bg-purple-50 text-purple-700';
      case 'tasks': return 'bg-green-50 text-green-700';
      case 'drive': return 'bg-cyan-50 text-cyan-700';
      case 'financial': return 'bg-yellow-50 text-yellow-700';
      case 'team': return 'bg-pink-50 text-pink-700';
      case 'settings': return 'bg-gray-50 text-gray-700';
      case 'auth': return 'bg-indigo-50 text-indigo-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const LogCard = ({ log, index }: { log: ActivityLog; index: number }) => {
    const ActionIcon = getActionIcon(log.actionType);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
        onClick={() => openViewModal(log)}
      >
        <div className="flex items-start gap-3">
          {/* Action Icon */}
          <div className={`p-2.5 rounded-lg ${getActionColor(log.actionType).replace('border', 'border-0')}`}>
            <ActionIcon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{log.action}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{log.description}</p>
              </div>
              <span className={`shrink-0 px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(log.module)}`}>
                {log.module}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium">{log.userName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimestamp(log.timestamp)}</span>
              </div>
              {log.ipAddress && (
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="text-gray-400">IP:</span>
                  <span>{log.ipAddress}</span>
                </div>
              )}
            </div>
          </div>
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
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Activity Logs</h1>
            <p className="text-sm text-gray-600">
              {stats.totalActivities} total activities • {stats.uniqueUsers} users • {stats.todayActivities} today
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search activities..."
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filterOptions={[
          {
            label: 'Action Type',
            value: actionTypeFilter,
            options: [
              { label: 'All Types', value: 'all' },
              { label: 'Create', value: 'create' },
              { label: 'Update', value: 'update' },
              { label: 'Delete', value: 'delete' },
              { label: 'View', value: 'view' },
              { label: 'Login', value: 'login' },
              { label: 'Logout', value: 'logout' },
              { label: 'Upload', value: 'upload' },
              { label: 'Download', value: 'download' },
            ],
            onChange: setActionTypeFilter,
            type: 'select',
          },
          {
            label: 'Module',
            value: moduleFilter,
            options: [
              { label: 'All Modules', value: 'all' },
              { label: 'Customers', value: 'customers' },
              { label: 'Projects', value: 'projects' },
              { label: 'Tasks', value: 'tasks' },
              { label: 'Drive', value: 'drive' },
              { label: 'Financial', value: 'financial' },
              { label: 'Team', value: 'team' },
              { label: 'Settings', value: 'settings' },
              { label: 'Authentication', value: 'auth' },
            ],
            onChange: setModuleFilter,
            type: 'select',
          },
          {
            label: 'User',
            value: userFilter,
            options: [
              { label: 'All Users', value: 'all' },
              ...users.map(user => ({ label: user, value: user })),
            ],
            onChange: setUserFilter,
            type: 'select',
          },
          {
            label: 'Time Period',
            value: dateFilter,
            options: [
              { label: 'All Time', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'Last 7 Days', value: 'week' },
              { label: 'Last 30 Days', value: 'month' },
            ],
            onChange: setDateFilter,
            type: 'select',
          },
        ]}
        activeFilters={{
          'Action Type': actionTypeFilter,
          'Module': moduleFilter,
          'User': userFilter,
          'Time Period': dateFilter,
        }}
      />

      {/* Active Filters Display */}
      {(actionTypeFilter !== 'all' || moduleFilter !== 'all' || userFilter !== 'all' || dateFilter !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {actionTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-200">
              Type: {actionTypeFilter}
              <button onClick={() => setActionTypeFilter('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {moduleFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-200">
              Module: {moduleFilter}
              <button onClick={() => setModuleFilter('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {userFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-200">
              User: {userFilter}
              <button onClick={() => setUserFilter('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {dateFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-200">
              Period: {dateFilter}
              <button onClick={() => setDateFilter('all')} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Activity List */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activities found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredLogs.map((log, index) => (
              <LogCard key={log.id} log={log} index={index} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* View Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        mode="view"
        title="Activity Details"
        icon={Eye}
        maxWidth="md"
      >
        {selectedLog && (
          <>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getActionColor(selectedLog.actionType).replace('border', 'border-0')}`}>
                  {(() => {
                    const Icon = getActionIcon(selectedLog.actionType);
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedLog.action}</h3>
                  <p className="text-sm text-gray-600">{selectedLog.description}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ViewField label="User" value={selectedLog.userName} />
              <ViewField
                label="Action Type"
                value={
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getActionColor(selectedLog.actionType)}`}>
                    {selectedLog.actionType}
                  </span>
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ViewField
                label="Module"
                value={
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getModuleColor(selectedLog.module)}`}>
                    {selectedLog.module}
                  </span>
                }
              />
              <ViewField label="User ID" value={selectedLog.userId} />
            </div>

            {selectedLog.targetEntity && (
              <div className="grid grid-cols-2 gap-4">
                <ViewField label="Target Entity" value={selectedLog.targetEntity} />
                {selectedLog.targetId && (
                  <ViewField label="Target ID" value={selectedLog.targetId} />
                )}
              </div>
            )}

            {selectedLog.ipAddress && (
              <ViewField label="IP Address" value={selectedLog.ipAddress} />
            )}

            <ViewField
              label="Timestamp"
              value={new Date(selectedLog.timestamp).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            />

            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <ViewField
                label="Additional Data"
                value={
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                }
              />
            )}
          </>
        )}
      </FormModal>
    </div>
  );
}
