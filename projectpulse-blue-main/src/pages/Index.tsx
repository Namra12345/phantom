import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderOpen, CheckSquare, Users, BarChart3, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FolderOpen,
      title: 'Project Management',
      description: 'Organize and track your projects with intuitive dashboards and progress monitoring.',
    },
    {
      icon: CheckSquare,
      title: 'Task Tracking',
      description: 'Break down projects into manageable tasks and monitor completion status.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team members and assign tasks efficiently.',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Get insights into project progress and team performance with detailed analytics.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-accent">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center mr-4">
              <FolderOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-4xl font-bold text-foreground">ProjectHub</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Manage Projects
            <span className="block text-primary">Like a Pro</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            Streamline your project management workflow with our intuitive platform. 
            Track progress, collaborate with teams, and deliver projects on time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              onClick={() => navigate('/signup')}
              className="btn-hero text-lg px-8 py-4"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="btn-outline-primary text-lg px-8 py-4"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-elevated p-6 text-center animate-fade-in">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="card-elevated p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Project Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams who trust ProjectHub to deliver their projects successfully.
          </p>
          <Button
            onClick={() => navigate('/signup')}
            className="btn-hero text-lg px-8 py-4"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
