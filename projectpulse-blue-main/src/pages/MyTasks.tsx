import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar, CheckSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const mockTasks = [
  {
    id: '1',
    title: 'Design System Documentation',
    description: 'Create comprehensive documentation for the new design system including components, colors, and typography.',
    status: 'completed' as const,
    priority: 'high' as const,
    dueDate: 'Nov 15, 2024',
    assignee: {
      name: 'You',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
    image: '/api/placeholder/300/200',
    project: 'E-commerce Website Redesign',
  },
  {
    id: '2',
    title: 'User Authentication Flow',
    description: 'Implement secure user authentication with JWT tokens and password reset functionality.',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: 'Nov 30, 2024',
    assignee: {
      name: 'You',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
    project: 'E-commerce Website Redesign',
  },
  {
    id: '3',
    title: 'Mobile App Testing',
    description: 'Comprehensive testing of the mobile application on various devices and operating systems.',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    dueDate: 'Dec 5, 2024',
    assignee: {
      name: 'You',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
    project: 'Mobile App Development',
  },
  {
    id: '4',
    title: 'Performance Optimization',
    description: 'Optimize application performance, implement lazy loading, and reduce bundle size.',
    status: 'todo' as const,
    priority: 'low' as const,
    dueDate: 'Dec 12, 2024',
    assignee: {
      name: 'You',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
    project: 'E-commerce Website Redesign',
  },
  {
    id: '5',
    title: 'Database Migration',
    description: 'Migrate existing data to the new database schema and ensure data integrity.',
    status: 'todo' as const,
    priority: 'high' as const,
    dueDate: 'Dec 20, 2024',
    assignee: {
      name: 'You',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
    project: 'Data Analytics Dashboard',
  },
];

const MyTasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = activeTab === 'all' || task.status === activeTab;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      navigate(`/project/1/edit-task/${taskId}`);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  };

  const taskCounts = getTaskCounts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
          <p className="text-muted-foreground">
            Track and manage all your assigned tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold text-foreground">{taskCounts.all}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">To Do</p>
                <p className="text-2xl font-bold text-foreground">{taskCounts.todo}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{taskCounts['in-progress']}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
              </div>
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{taskCounts.completed}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-success"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({taskCounts.all})</TabsTrigger>
            <TabsTrigger value="todo">To Do ({taskCounts.todo})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({taskCounts['in-progress']})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({taskCounts.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="text-xs text-muted-foreground font-medium px-1">
                      {task.project}
                    </div>
                    <TaskCard
                      task={task}
                      onClick={() => {}}
                      onEdit={() => handleEditTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No tasks found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterPriority !== 'all'
                    ? 'Try adjusting your search or filters'
                    : activeTab === 'all'
                    ? 'You have no tasks assigned'
                    : `You have no ${activeTab.replace('-', ' ')} tasks`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyTasks;