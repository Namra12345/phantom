import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Users, 
  Target, 
  MoreHorizontal,
  Edit,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
const mockProject = {
  id: '1',
  title: 'E-commerce Website Redesign',
  description: 'Complete redesign of the company e-commerce platform with modern UI/UX principles and improved user experience. This project aims to increase conversion rates and improve overall customer satisfaction.',
  priority: 'high' as const,
  progress: 75,
  dueDate: 'December 15, 2024',
  startDate: 'October 1, 2024',
  image: '/api/placeholder/800/400',
  members: [
    { id: '1', name: 'Alice Johnson', avatar: '/api/placeholder/32/32', initials: 'AJ', role: 'Project Manager' },
    { id: '2', name: 'Bob Smith', avatar: '/api/placeholder/32/32', initials: 'BS', role: 'UI/UX Designer' },
    { id: '3', name: 'Charlie Brown', avatar: '/api/placeholder/32/32', initials: 'CB', role: 'Frontend Developer' },
    { id: '4', name: 'Diana Ross', avatar: '/api/placeholder/32/32', initials: 'DR', role: 'Backend Developer' },
    { id: '5', name: 'Eve Wilson', avatar: '/api/placeholder/32/32', initials: 'EW', role: 'QA Engineer' },
  ],
  tags: ['React', 'TypeScript', 'UI/UX'],
};

const mockTasks = [
  {
    id: '1',
    title: 'Design System Documentation',
    description: 'Create comprehensive documentation for the new design system including components, colors, and typography.',
    status: 'completed' as const,
    priority: 'high' as const,
    dueDate: 'Nov 15, 2024',
    assignee: {
      name: 'Bob Smith',
      avatar: '/api/placeholder/32/32',
      initials: 'BS',
    },
    image: '/api/placeholder/300/200',
  },
  {
    id: '2',
    title: 'User Authentication Flow',
    description: 'Implement secure user authentication with JWT tokens and password reset functionality.',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: 'Nov 30, 2024',
    assignee: {
      name: 'Diana Ross',
      avatar: '/api/placeholder/32/32',
      initials: 'DR',
    },
  },
  {
    id: '3',
    title: 'Product Catalog Interface',
    description: 'Build responsive product catalog with filtering, sorting, and search capabilities.',
    status: 'in-progress' as const,
    priority: 'medium' as const,
    dueDate: 'Dec 5, 2024',
    assignee: {
      name: 'Charlie Brown',
      avatar: '/api/placeholder/32/32',
      initials: 'CB',
    },
    image: '/api/placeholder/300/200',
  },
  {
    id: '4',
    title: 'Payment Integration Testing',
    description: 'Comprehensive testing of payment gateway integration with various payment methods.',
    status: 'todo' as const,
    priority: 'medium' as const,
    dueDate: 'Dec 10, 2024',
    assignee: {
      name: 'Eve Wilson',
      avatar: '/api/placeholder/32/32',
      initials: 'EW',
    },
  },
  {
    id: '5',
    title: 'Performance Optimization',
    description: 'Optimize application performance, implement lazy loading, and reduce bundle size.',
    status: 'todo' as const,
    priority: 'low' as const,
    dueDate: 'Dec 12, 2024',
    assignee: {
      name: 'Charlie Brown',
      avatar: '/api/placeholder/32/32',
      initials: 'CB',
    },
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(mockTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'badge-high';
      case 'medium':
        return 'badge-medium';
      case 'low':
        return 'badge-low';
      default:
        return 'badge-low';
    }
  };

  const handleCreateTask = () => {
    navigate(`/project/${id}/create-task`);
  };

  const handleEditTask = (taskId: string) => {
    navigate(`/project/${id}/edit-task/${taskId}`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleEditProject = () => {
    navigate(`/edit-project/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <div className="card-elevated p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Project Image */}
            <div className="lg:w-1/3">
              <img
                src={mockProject.image}
                alt={mockProject.title}
                className="w-full h-48 lg:h-64 object-cover rounded-lg"
              />
            </div>

            {/* Project Info */}
            <div className="lg:w-2/3 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">
                      {mockProject.title}
                    </h1>
                    <Badge className={getPriorityColor(mockProject.priority)}>
                      {mockProject.priority}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {mockProject.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditProject}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Project Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {mockProject.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Progress</span>
                  <span className="text-muted-foreground">{mockProject.progress}%</span>
                </div>
                <Progress value={mockProject.progress} className="h-3" />
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <div>
                    <div className="text-xs">Due Date</div>
                    <div className="font-medium text-foreground">{mockProject.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Target className="w-4 h-4" />
                  <div>
                    <div className="text-xs">Started</div>
                    <div className="font-medium text-foreground">{mockProject.startDate}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <div>
                    <div className="text-xs">Team Members</div>
                    <div className="font-medium text-foreground">{mockProject.members.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="card-elevated p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProject.members.map((member) => (
              <div key={member.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Tasks</h2>
            <p className="text-muted-foreground">
              {tasks.length} tasks • {tasks.filter(t => t.status === 'completed').length} completed
            </p>
          </div>
          <Button
            onClick={handleCreateTask}
            className="btn-hero mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </Button>
        </div>

        {/* Tasks Grid */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => {}}
                onEdit={() => handleEditTask(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No tasks yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first task for this project
            </p>
            <Button onClick={handleCreateTask} className="btn-hero">
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;