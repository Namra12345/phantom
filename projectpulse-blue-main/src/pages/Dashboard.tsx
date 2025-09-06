import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projectsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Mock data
const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Complete redesign of the company e-commerce platform with modern UI/UX principles and improved user experience.',
    tags: ['React', 'TypeScript', 'UI/UX'],
    progress: 75,
    image: '/api/placeholder/400/300',
    dueDate: 'Dec 15, 2024',
    members: 5,
    priority: 'high' as const,
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms with cross-platform functionality.',
    tags: ['React Native', 'Mobile', 'API'],
    progress: 45,
    image: '/api/placeholder/400/300',
    dueDate: 'Jan 20, 2025',
    members: 3,
    priority: 'medium' as const,
  },
  {
    id: '3',
    title: 'Marketing Campaign Platform',
    description: 'Digital marketing platform for campaign management, analytics, and customer engagement.',
    tags: ['Vue.js', 'Analytics', 'Marketing'],
    progress: 20,
    image: '/api/placeholder/400/300',
    dueDate: 'Feb 10, 2025',
    members: 4,
    priority: 'low' as const,
  },
  {
    id: '4',
    title: 'Data Analytics Dashboard',
    description: 'Real-time dashboard for business analytics with advanced reporting and visualization features.',
    tags: ['Python', 'Data Science', 'Dashboard'],
    progress: 90,
    image: '/api/placeholder/400/300',
    dueDate: 'Nov 30, 2024',
    members: 2,
    priority: 'high' as const,
  },
];

const Dashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || project.priority?.toLowerCase() === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectsAPI.delete(parseInt(projectId));
      setProjects(projects.filter(p => p.project_id !== parseInt(projectId)));
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your projects in one place
            </p>
          </div>
          <Button
            onClick={handleCreateProject}
            className="btn-hero mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
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

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading projects...
            </h3>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={{
                  id: project.project_id.toString(),
                  title: project.name,
                  description: project.description,
                  tags: project.tags ? project.tags.split(',').map((tag: string) => tag.trim()) : [],
                  progress: 0, // You can calculate this based on tasks
                  image: project.image_url || '/api/placeholder/400/300',
                  dueDate: project.duration || 'No due date',
                  members: 0, // You can fetch this from project members API
                  priority: project.priority?.toLowerCase() || 'medium',
                }}
                onClick={() => handleProjectClick(project.project_id.toString())}
                onEdit={() => handleEditProject(project.project_id.toString())}
                onDelete={() => handleDeleteProject(project.project_id.toString())}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterPriority !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first project'}
            </p>
            {!searchTerm && filterPriority === 'all' && (
              <Button onClick={handleCreateProject} className="btn-hero">
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;