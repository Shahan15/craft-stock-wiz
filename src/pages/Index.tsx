import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Package, Bell, Zap, FileText, Star, ArrowRight, Plus, ShoppingCart, TrendingDown } from 'lucide-react';

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
            Automatically Deduct Materials with Every Sale—No More Spreadsheets
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Build simple product recipes—think '1 chain + 5 beads = 1 necklace'—then watch stock levels adjust themselves.
          </p>
          <div className="flex justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 bg-teal-600 hover:bg-teal-700 text-white">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Smart Features for Craft Businesses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-teal-200 bg-teal-50/50">
              <CardHeader>
                <Plus className="h-12 w-12 text-teal-600 mb-4" />
                <CardTitle className="text-teal-800">Recipe Builder</CardTitle>
                <CardDescription>
                  Create simple product recipes by selecting materials and quantities—like "1 chain + 5 beads = 1 necklace."
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Auto-Deduct Stock</CardTitle>
                <CardDescription>
                  Watch materials automatically reduce when you log a sale—no manual calculations needed.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <Bell className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Low-Stock Alerts</CardTitle>
                <CardDescription>
                  Get notified when materials hit your custom thresholds so you never run out mid-production.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Quick Setup Templates</CardTitle>
                <CardDescription>
                  Start with pre-built recipes for candle-makers, jewellers, soap-makers, and more crafts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Add Materials</h3>
              <p className="text-muted-foreground">Upload your raw materials with current quantities and costs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Build Recipes</h3>
              <p className="text-muted-foreground">Define what materials go into each finished product.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Log Sale & Watch Stock Adjust</h3>
              <p className="text-muted-foreground">Record a sale and see material quantities update automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-teal-600 font-medium mb-4">200+ makers trust us</p>
            <h2 className="text-3xl font-bold mb-12">
              Real Results from Real Makers
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-teal-500 text-teal-500" />
                  ))}
                </div>
                <blockquote className="text-xl text-muted-foreground mb-6 italic">
                  "I cut weekly inventory time from 3 hours to 10 minutes—because Stock-Kit auto-calculates my material needs."
                </blockquote>
                <p className="font-semibold text-lg">— Sarah M., Jewelry Designer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Say Goodbye to Manual Stock Math?
          </h2>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 bg-teal-600 hover:bg-teal-700 text-white">
              Start Your Free Trial
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
