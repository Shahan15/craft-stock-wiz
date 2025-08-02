import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Package, BarChart3, AlertCircle, Users, Star, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();

  if (user) {
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
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Craft Stock Wiz</span>
          </div>
          <Link to="/auth">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Manage Your Handmade Business Like a Pro
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Keep track of your inventory, materials, and sales with the inventory management system designed specifically for craft entrepreneurs.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Grow Your Craft Business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Inventory Tracking</CardTitle>
                <CardDescription>
                  Keep track of all your handmade products, quantities, and variations in one place.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>
                  Understand your best-selling items and track your business growth over time.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <AlertCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Never run out of your popular items with automatic low stock notifications.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>
                  Keep track of your customers and their order history for better service.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Package className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Material Tracking</CardTitle>
                <CardDescription>
                  Monitor your raw materials and supplies to plan your production schedule.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>
                  Create beautiful product catalogs with photos, descriptions, and pricing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Loved by Craft Entrepreneurs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Craft Stock Wiz transformed how I manage my jewelry business. I never lose track of inventory anymore!"
                </p>
                <p className="font-semibold">Sarah M. - Jewelry Designer</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The low stock alerts saved me from missing sales. Perfect for my pottery studio!"
                </p>
                <p className="font-semibold">Mike T. - Potter</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Simple, intuitive, and exactly what my handmade card business needed."
                </p>
                <p className="font-semibold">Emma L. - Card Maker</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Inventory?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of craft entrepreneurs who trust Craft Stock Wiz
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Craft Stock Wiz. Made with ❤️ for craft entrepreneurs.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
