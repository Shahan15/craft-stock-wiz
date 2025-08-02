import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Package, Bell, Zap, FileText, Star, ArrowRight, Plus, ShoppingCart, TrendingDown, Sparkles, ChevronRight, Play } from 'lucide-react';

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
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 gradient-primary rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Stock Kit</span>
          </div>
          <Link to="/auth">
            <Button variant="premium" size="lg">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Mesh Background */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Revolutionary Recipe-Based Inventory</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              Automatically Deduct 
              <span className="text-gradient animate-gradient"> Materials </span>
              with Every Sale
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Build simple product recipes—think <span className="font-semibold text-accent">'1 chain + 5 beads = 1 necklace'</span>—then watch stock levels adjust themselves. No more spreadsheets, no more guesswork.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button variant="glow" size="xl" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <Button variant="outline" size="xl" className="group bg-white/80 backdrop-blur-sm hover:bg-white/90">
                <Play className="mr-2 h-5 w-5" />
                Watch 2-min Demo
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="mt-16 text-sm text-muted-foreground">
              <span className="font-medium text-accent">200+ makers</span> already saving hours weekly
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 gradient-primary rounded-full opacity-20 floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 gradient-accent rounded-full opacity-30 floating-animation" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section - Interactive Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Features That Actually Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop wasting time on manual calculations. Let automation handle your inventory.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover-lift group border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 gradient-accent rounded-2xl mb-4 shadow-accent">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-accent">Recipe Builder</CardTitle>
                <CardDescription className="text-base">
                  Create simple product recipes by selecting materials and quantities—like "1 chain + 5 beads = 1 necklace."
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover-lift group border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 gradient-primary rounded-2xl mb-4 shadow-glow">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Auto-Deduct Stock</CardTitle>
                <CardDescription className="text-base">
                  Watch materials automatically reduce when you log a sale—no manual calculations needed.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover-lift group border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-orange-500 rounded-2xl mb-4">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Alerts</CardTitle>
                <CardDescription className="text-base">
                  Get notified when materials hit your custom thresholds so you never run out mid-production.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover-lift group border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto p-4 bg-indigo-500 rounded-2xl mb-4">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Quick Templates</CardTitle>
                <CardDescription className="text-base">
                  Start with pre-built recipes for candle-makers, jewellers, soap-makers, and more crafts.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Process */}
      <section className="py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple. Powerful. <span className="text-gradient">Automatic.</span>
            </h2>
            <p className="text-xl text-muted-foreground">Three steps to revolutionize your inventory management</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Add Materials</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Upload your raw materials with current quantities and costs. One-time setup that saves hours later.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 gradient-accent rounded-full flex items-center justify-center mx-auto shadow-accent group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Build Recipes</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Define what materials go into each finished product. Think ingredients for a cake, but for crafts.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                  <TrendingDown className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Watch Magic Happen</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Record a sale and see material quantities update automatically. Your inventory stays accurate, always.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Data-Driven */}
      <section className="py-24 bg-gradient-to-b from-muted/30 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-800 font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                200+ makers trust us
              </div>
            </div>
            
            <Card className="glass-card border-2 border-accent/20 shadow-premium">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
                  "I cut weekly inventory time from <span className="text-red-500 line-through">3 hours</span> to <span className="text-green-600 font-bold">10 minutes</span>—because Stock Kit auto-calculates my material needs."
                </blockquote>
                <div className="text-lg font-semibold text-accent">— Sarah M., Jewelry Designer</div>
                <div className="text-muted-foreground mt-2">Saved 2.8 hours weekly • Increased accuracy by 97%</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA - Premium Design */}
      <section className="py-24 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Say Goodbye to Manual Stock Math?
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              Join the craft entrepreneurs who've already revolutionized their inventory management
            </p>
            
            <Link to="/auth">
              <Button variant="secondary" size="xl" className="shadow-premium hover:shadow-glow">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="mt-8 text-sm opacity-75">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full floating-animation"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full floating-animation" style={{animationDelay: '3s'}}></div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 gradient-primary rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Stock Kit</span>
          </div>
          <p className="text-muted-foreground">
            &copy; 2024 Stock Kit. Made with ❤️ for craft entrepreneurs who value their time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;