'use client';

import { useState, useMemo, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Circle,
  X,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import {
  SearchFilterBar,
  EmptyState,
  FormModal,
  FormField,
  ViewField,
  DataTable,
} from '@/components/dashboard';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  project?: string;
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design Homepage Mockup',
      description: 'Create responsive design mockup for the new homepage',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Jane Smith',
      project: 'Website Redesign',
      tags: ['design', 'ui/ux'],
      dueDate: '2024-02-10',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Update Client Database',
      description: 'Import new client contacts and update existing records',
      status: 'todo',
      priority: 'medium',
      assignee: 'John Doe',
      project: 'CRM Migration',
      tags: ['database', 'migration'],
      dueDate: '2024-02-15',
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      title: 'Quarterly Report',
      description: 'Prepare Q1 2024 financial and operational report',
      status: 'todo',
      priority: 'urgent',
      assignee: 'Finance Team',
      project: 'Reporting',
      tags: ['finance', 'report'],
      dueDate: '2024-02-05',
      createdAt: '2024-01-20'
    },
    {
      id: '4',
      title: 'Fix Login Bug',
      description: 'Resolve authentication issue on mobile devices',
      status: 'completed',
      priority: 'urgent',
      assignee: 'Dev Team',
      project: 'Bug Fixes',
      tags: ['bug', 'mobile', 'urgent'],
      dueDate: '2024-01-25',
      createdAt: '2024-01-22',
      completedAt: '2024-01-24'
    },
    {
      id: '5',
      title: 'Plan Marketing Campaign',
      description: 'Develop strategy for Q2 marketing initiatives',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Marketing Team',
      project: 'Q2 Marketing',
      tags: ['marketing', 'strategy'],
      dueDate: '2024-02-20',
      createdAt: '2024-01-25'
    },
    {
      id: '6',
      title: 'Code Review Session',
      description: 'Review pull requests from last week',
      status: 'todo',
      priority: 'low',
      assignee: 'John Doe',
      project: 'Development',
      tags: ['code-review', 'development'],
      dueDate: '2024-02-08',
      createdAt: '2024-01-28'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'todo' | 'in-progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    assignee: '',
    project: '',
    tags: [] as string[],
    dueDate: '',
  });

  const [tagInput, setTagInput] = useState('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: '',
      project: '',
      tags: [],
      dueDate: '',
    });
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
      priority: formData.priority,
      assignee: formData.assignee || undefined,
      project: formData.project || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      dueDate: formData.dueDate || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedTask) {
      setTasks(tasks.map(task =>
        task.id === selectedTask.id
          ? {
              ...task,
              title: formData.title,
              description: formData.description || undefined,
              status: formData.status,
              priority: formData.priority,
              assignee: formData.assignee || undefined,
              project: formData.project || undefined,
              tags: formData.tags.length > 0 ? formData.tags : undefined,
              dueDate: formData.dueDate || undefined,
              completedAt: formData.status === 'completed' && !task.completedAt
                ? new Date().toISOString().split('T')[0]
                : formData.status !== 'completed' ? undefined : task.completedAt,
            }
          : task
      ));
      setShowEditModal(false);
      setSelectedTask(null);
      resetForm();
    }
  };

  const handleDelete = () => {
    if (selectedTask) {
      setTasks(tasks.filter(task => task.id !== selectedTask.id));
      setShowDeleteModal(false);
      setSelectedTask(null);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignee: task.assignee || '',
      project: task.project || '',
      tags: task.tags || [],
      dueDate: task.dueDate || '',
    });
    setShowEditModal(true);
  };

  const openViewModal = (task: Task) => {
    setSelectedTask(task);
    setShowViewModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  // Filter by status tab first
  const statusFilteredTasks = tasks.filter(task => {
    if (statusTab === 'all') return true;
    return task.status === statusTab;
  });

  const filteredTasks = statusFilteredTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assignee === assigneeFilter;
    const matchesProject = projectFilter === 'all' || task.project === projectFilter;
    return matchesSearch && matchesPriority && matchesAssignee && matchesProject;
  });

  const stats = useMemo(() => {
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    return {
      todoCount,
      inProgressCount,
      completedCount,
      overdueTasks,
      totalTasks: tasks.length
    };
  }, [tasks]);

  const assignees = Array.from(new Set(tasks.filter(t => t.assignee).map(t => t.assignee)));
  const projects = Array.from(new Set(tasks.filter(t => t.project).map(t => t.project)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  // Calendar helper functions
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getTasksForDate = (date: Date) => {
    return filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);

    // Previous month days
    const prevMonthDays = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const TaskCard = ({ task, index }: { task: Task; index: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => openViewModal(task)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            {task.project && (
              <p className="text-xs text-gray-500">{task.project}</p>
            )}
          </div>
          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {task.assignee ? (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <span className="text-xs text-gray-600 max-w-[100px] truncate">{task.assignee}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Unassigned</span>
            )}
          </div>
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue(task) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        {isOverdue(task) && (
          <div className="mt-2 pt-2 border-t border-red-100">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full font-medium">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          </div>
        )}

        {/* Hidden Actions on Hover */}
        <div className="hidden group-hover:flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
            className="flex-1 px-2 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openDeleteModal(task); }}
            className="flex-1 px-2 py-1.5 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors font-medium"
          >
            Delete
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
            <CheckSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Tasks</h1>
            <p className="text-sm text-gray-600">{filteredTasks.length} tasks • {stats.overdueTasks} overdue</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
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
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Calendar View"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 font-medium text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'all', label: 'All Tasks', count: tasks.length, icon: CheckSquare },
          { id: 'todo', label: 'To Do', count: stats.todoCount, icon: Circle },
          { id: 'in-progress', label: 'In Progress', count: stats.inProgressCount, icon: Clock },
          { id: 'completed', label: 'Completed', count: stats.completedCount, icon: CheckCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id as any)}
              className={`px-4 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
                statusTab === tab.id
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  statusTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </div>
              {statusTab === tab.id && (
                <motion.div
                  layoutId="activeStatusTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchFilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search tasks..."
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            filterOptions={[
              {
                label: 'Priority',
                value: priorityFilter,
                options: [
                  { label: 'All Priorities', value: 'all' },
                  { label: 'Urgent', value: 'urgent' },
                  { label: 'High', value: 'high' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Low', value: 'low' },
                ],
                onChange: setPriorityFilter,
                type: 'select',
              },
              {
                label: 'Assignee',
                value: assigneeFilter,
                options: [
                  { label: 'All Assignees', value: 'all' },
                  ...assignees.map(assignee => ({ label: assignee!, value: assignee! })),
                ],
                onChange: setAssigneeFilter,
                type: 'select',
              },
              {
                label: 'Project',
                value: projectFilter,
                options: [
                  { label: 'All Projects', value: 'all' },
                  ...projects.map(project => ({ label: project!, value: project! })),
                ],
                onChange: setProjectFilter,
                type: 'select',
              },
            ]}
            activeFilters={{ Priority: priorityFilter, Assignee: assigneeFilter, Project: projectFilter }}
          />
        </div>

        {/* Active Filters Display */}
        {(priorityFilter !== 'all' || assigneeFilter !== 'all' || projectFilter !== 'all') && (
          <div className="flex items-center gap-2">
            {priorityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                Priority: {priorityFilter}
                <button onClick={() => setPriorityFilter('all')} className="hover:text-gray-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {assigneeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                {assigneeFilter}
                <button onClick={() => setAssigneeFilter('all')} className="hover:text-gray-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {projectFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                {projectFilter}
                <button onClick={() => setProjectFilter('all')} className="hover:text-gray-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tasks Display */}
      {filteredTasks.length === 0 && viewMode !== 'calendar' ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Try adjusting your filters or create a new task"
        />
      ) : viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Calendar */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDate(day.date);
                const hasOverdue = dayTasks.some(isOverdue);

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(day.date)}
                    className={`
                      relative aspect-square p-1 rounded-lg border transition-all
                      ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                      ${isToday(day.date) ? 'border-primary border-2 shadow-sm' : 'border-gray-200'}
                      ${isSelectedDate(day.date) ? 'ring-2 ring-primary/50' : ''}
                      hover:border-primary/50 hover:shadow-md
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span
                        className={`
                          text-xs font-medium mb-1
                          ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                          ${isToday(day.date) ? 'text-primary font-bold' : ''}
                        `}
                      >
                        {day.date.getDate()}
                      </span>

                      {/* Task Indicators */}
                      {dayTasks.length > 0 && (
                        <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                          {dayTasks.slice(0, 3).map((task, idx) => (
                            <div
                              key={idx}
                              className={`h-1 rounded-full ${getPriorityDot(task.priority)}`}
                              title={task.title}
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              +{dayTasks.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {hasOverdue && (
                        <div className="absolute top-1 right-1">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1.5 rounded-full bg-red-500"></div>
                  <span>Urgent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1.5 rounded-full bg-orange-500"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1.5 rounded-full bg-yellow-500"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1.5 rounded-full bg-gray-400"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              {selectedDate
                ? `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                : 'Select a date'}
            </h3>

            {selectedDate && selectedDateTasks.length === 0 && (
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tasks for this date</p>
              </div>
            )}

            <div className="space-y-2">
              {selectedDateTasks.map((task) => {
                const StatusIcon = task.status === 'completed' ? CheckCircle : task.status === 'in-progress' ? Clock : Circle;
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => openViewModal(task)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`w-1 h-1 rounded-full mt-2 ${getPriorityDot(task.priority)}`}></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-600">{task.status.replace('-', ' ')}</span>
                      </div>
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-primary">
                              {task.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {isOverdue(task) && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Overdue
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <DataTable
          columns={[
            {
              header: 'Task',
              accessor: 'title',
              render: (_value: string, row: Task) => (
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-gray-900">{row.title}</div>
                  {row.description && (
                    <div className="text-xs text-gray-500 line-clamp-1">{row.description}</div>
                  )}
                </div>
              ),
            },
            {
              header: 'Status',
              accessor: 'status',
              render: (value: string) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
                  {value.replace('-', ' ')}
                </span>
              ),
            },
            {
              header: 'Priority',
              accessor: 'priority',
              render: (value: string) => (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(value)}`}>
                  {value}
                </span>
              ),
            },
            {
              header: 'Assignee',
              accessor: 'assignee',
              render: (value: string | undefined, row: Task) => (
                <div className="flex items-center gap-2">
                  {row.assignee ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {row.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{row.assignee}</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </div>
              ),
            },
            {
              header: 'Project',
              accessor: 'project',
              render: (value: string | undefined) => (
                <span className="text-sm text-gray-700">{value || '-'}</span>
              ),
            },
            {
              header: 'Due Date',
              accessor: 'dueDate',
              render: (value: string | undefined, row: Task) => (
                <div className="flex items-center gap-1">
                  {value ? (
                    <div className={`flex items-center gap-1 text-sm ${isOverdue(row) ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {isOverdue(row) && (
                        <span className="inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-red-50 text-red-700 text-xs rounded-full font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
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
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {value.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
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
          data={filteredTasks}
          onView={openViewModal}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {/* Add Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); resetForm(); }}
        mode="add"
        title="Create New Task"
        icon={Plus}
        maxWidth="md"
        onSave={handleAdd}
        saveButtonText="Create Task"
      >
        <FormField label="Task Title" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Design homepage mockup"
          />
        </FormField>

        <FormField label="Description (Optional)">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Add task details..."
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status" required>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>

          <FormField label="Priority" required>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </FormField>
        </div>

        <FormField label="Assignee (Optional)">
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., John Doe"
          />
        </FormField>

        <FormField label="Project (Optional)">
          <input
            type="text"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Website Redesign"
          />
        </FormField>

        <FormField label="Due Date (Optional)">
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Tags (Press Enter to add)">
          <div className="space-y-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type and press Enter to add tags"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary-dark"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormField>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); resetForm(); }}
        mode="edit"
        title="Edit Task"
        icon={Edit2}
        maxWidth="md"
        onSave={handleEdit}
      >
        <FormField label="Task Title" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Description (Optional)">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status" required>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </FormField>

          <FormField label="Priority" required>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </FormField>
        </div>

        <FormField label="Assignee (Optional)">
          <input
            type="text"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Project (Optional)">
          <input
            type="text"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Due Date (Optional)">
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>

        <FormField label="Tags (Press Enter to add)">
          <div className="space-y-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Type and press Enter to add tags"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-primary-dark"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormField>
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        mode="view"
        title="Task Details"
        icon={Eye}
        maxWidth="md"
      >
        {selectedTask && (
          <>
            <ViewField label="Task Title" value={selectedTask.title} />

            {selectedTask.description && (
              <ViewField label="Description" value={selectedTask.description} />
            )}

            <div className="grid grid-cols-2 gap-4">
              <ViewField
                label="Status"
                value={
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('-', ' ')}
                  </span>
                }
              />
              <ViewField
                label="Priority"
                value={
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ViewField label="Assignee" value={selectedTask.assignee || 'Unassigned'} />
              <ViewField label="Project" value={selectedTask.project || 'No project'} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ViewField
                label="Created"
                value={new Date(selectedTask.createdAt).toLocaleDateString()}
              />
              <ViewField
                label="Due Date"
                value={
                  selectedTask.dueDate ? (
                    <span className={isOverdue(selectedTask) ? 'text-red-600 font-semibold' : ''}>
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                      {isOverdue(selectedTask) && ' (Overdue)'}
                    </span>
                  ) : 'No due date'
                }
              />
            </div>

            {selectedTask.completedAt && (
              <ViewField
                label="Completed"
                value={new Date(selectedTask.completedAt).toLocaleDateString()}
              />
            )}

            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <ViewField
                label="Tags"
                value={
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, idx) => (
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

      {/* Delete Modal */}
      <FormModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        mode="edit"
        title="Delete Task"
        icon={Trash2}
        maxWidth="md"
        onSave={handleDelete}
        saveButtonText="Delete"
      >
        {selectedTask && (
          <p className="text-gray-700">
            Are you sure you want to delete &ldquo;{selectedTask.title}&rdquo;? This action cannot be undone.
          </p>
        )}
      </FormModal>
    </div>
  );
}
