import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to Craft Stock Wiz</h1>
          <p className="text-xl text-muted-foreground">Manage your handmade business inventory with ease</p>
          <Link to="/auth">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Craft Stock Wiz</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </span>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-lg text-muted-foreground">
            Your handmade business inventory management starts here!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
