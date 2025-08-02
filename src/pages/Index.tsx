import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Package, Bell, Plus, ShoppingCart, Star, ArrowRight, Play, ChevronRight, Sparkles, Zap, FileText, Brain, TrendingDown } from 'lucide-react';

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
    <div className="min-h-screen bg-background overflow-hidden font-inter">
      {/* Navigation */}
      <nav className="relative z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 craft-teal rounded-2xl shadow-craft rotate-slight">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-handwritten text-craft-gradient">Stock Kit</span>
            <span className="text-sm text-muted-foreground font-handwritten italic">for makers</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <Link to="/auth">
              <Button variant="craft-outline" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 craft-teal blob-shape opacity-20 float-animation"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 craft-orange blob-shape opacity-30 float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-craft-brown blob-shape opacity-15 float-animation" style={{animationDelay: '4s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 paper-card rotate-slight">
                <Sparkles className="h-5 w-5 text-craft-orange" />
                <span className="text-sm font-medium text-craft-gradient">Revolutionary Recipe-Based Inventory</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-black leading-tight">
                  <span className="block">Automatically</span>
                  <span className="block text-craft-gradient hand-underline">Deduct Materials</span>
                  <span className="block">with Every Sale</span>
                </h1>
                
                <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
                  <p className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-craft-teal rounded-full"></span>
                    Build simple product recipes like <span className="font-semibold text-craft-teal">"1 chain + 5 beads = 1 necklace"</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-craft-orange rounded-full"></span>
                    then watch stock levels update themselves—no more guesswork.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link to="/auth">
                  <Button variant="craft-warm" size="xl" className="group shadow-warm">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Button variant="craft-outline" size="xl" className="group">
                  <Play className="mr-2 h-5 w-5" />
                  Watch 2-min Demo
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-craft-orange">200+ makers</span> 
                <span>already saving hours weekly</span>
              </div>
            </div>

            {/* Right Content - Recipe Builder Visual */}
            <div className="relative">
              <div className="paper-card p-8 rotate-slight-right craft-hover max-w-md mx-auto">
                <h3 className="text-xl font-handwritten text-craft-orange mb-6">Recipe Builder</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-craft-teal/10 rounded-xl">
                    <div className="w-3 h-3 bg-craft-teal rounded-full"></div>
                    <span className="font-medium">1x Silver Chain</span>
                  </div>
                  
                  <div className="text-center text-2xl font-handwritten text-muted-foreground">+</div>
                  
                  <div className="flex items-center gap-3 p-3 bg-craft-orange/10 rounded-xl">
                    <div className="w-3 h-3 bg-craft-orange rounded-full"></div>
                    <span className="font-medium">5x Glass Beads</span>
                  </div>
                  
                  <div className="text-center text-2xl font-handwritten text-muted-foreground">=</div>
                  
                  <div className="p-4 bg-gradient-to-r from-craft-teal/5 to-craft-orange/5 rounded-xl border-2 border-dashed border-craft-teal/30">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-craft-teal" />
                      <span className="font-semibold">1x Beaded Necklace</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="font-handwritten text-4xl md:text-5xl text-craft-gradient">Why makers love us</span>
            </h2>
            <div className="w-24 h-1 bg-craft-orange rounded-full mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Recipe Builder */}
            <Card className="paper-card craft-hover border-2 border-craft-teal/20 bg-gradient-to-br from-craft-teal/5 to-craft-teal/10">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 bg-craft-teal/20 blob-shape">
                  <Brain className="h-8 w-8 text-craft-teal" />
                </div>
                <CardTitle className="text-xl text-craft-teal font-semibold">Recipe Builder</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Create simple formulas for your products. Define exactly what materials go into each item you make.
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Auto-Deduct Stock */}
            <Card className="paper-card craft-hover">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 bg-craft-orange/20 blob-shape">
                  <Zap className="h-8 w-8 text-craft-orange" />
                </div>
                <CardTitle className="text-xl text-craft-orange font-semibold">Auto-Deduct Stock</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Every time you log a sale, Stock-Kit automatically deducts the right materials from your inventory.
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Low-Stock Alerts */}
            <Card className="paper-card craft-hover">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 bg-craft-brown/20 blob-shape">
                  <Bell className="h-8 w-8 text-craft-brown" />
                </div>
                <CardTitle className="text-xl text-craft-brown font-semibold">Low-Stock Alerts</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Get notified before you run out of materials so you can restock at the perfect time.
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