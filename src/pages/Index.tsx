import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Scissors, 
  Package, 
  TrendingUp, 
  Zap, 
  Target,
  CheckCircle,
  Star,
  Play
} from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            You're signed in as {user.email}
          </p>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-bg">
      {/* Navigation */}
      <nav className="container-padding py-6 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-primary-teal" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">Stock-Kit</span>
              <span className="text-script text-sm -mt-1">for makers</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-body text-foreground hover:text-primary-teal transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-body text-foreground hover:text-primary-teal transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-body text-foreground hover:text-primary-teal transition-colors">
              Pricing
            </a>
            <Button variant="outline" size="sm" className="border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container-padding section-padding bg-cream-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 grid-gap items-center">
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <Badge className="bg-white border border-primary-teal text-primary-teal text-badge uppercase tracking-wide">
                  Revolutionary Recipe-Based Inventory
                </Badge>
                
                <h1 className="text-h1 text-foreground leading-tight">
                  Automatically Deduct Materials with Every Sale
                </h1>
                
                <div className="space-y-4">
                  <p className="text-body text-foreground">
                    Build simple product recipes like "1 chain + 5 beads = 1 necklace"
                  </p>
                  <p className="text-body text-foreground">
                    then watch stock levels update themselves—no more guesswork.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Button 
                  size="lg" 
                  className="bg-accent-orange hover:bg-accent-orange/90 text-white text-button px-8 py-4"
                >
                  Start Free Trial
                </Button>
                
                <button className="flex items-center space-x-2 text-primary-teal text-body hover:text-teal-light transition-colors">
                  <Play className="h-4 w-4" />
                  <span>Watch 2-min Demo</span>
                </button>
              </div>
            </div>

            {/* Right Column - Mockup */}
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="hero-mockup p-8">
                <div className="space-y-6">
                  <h3 className="text-script text-2xl text-accent-brown">Recipe Builder</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-sm text-foreground">1 × Gold Chain</span>
                      <span className="text-sm font-medium text-foreground">$12.50</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-sm text-foreground">5 × Glass Beads</span>
                      <span className="text-sm font-medium text-foreground">$2.50</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <span className="text-sm text-foreground">1 × Clasp</span>
                      <span className="text-sm font-medium text-foreground">$1.75</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-foreground">= 1 Necklace</span>
                        <span className="text-foreground">$16.75</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container-padding section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 grid-gap">
            <div className="feature-card">
              <Package className="h-12 w-12 text-primary-teal mb-6" />
              <h3 className="text-h3 text-foreground mb-4">Recipe-Based Tracking</h3>
              <p className="text-body text-foreground">
                Define what goes into each product. When you sell a necklace, we automatically deduct the chain, beads, and findings.
              </p>
            </div>
            
            <div className="feature-card">
              <TrendingUp className="h-12 w-12 text-primary-teal mb-6" />
              <h3 className="text-h3 text-foreground mb-4">Real-Time Updates</h3>
              <p className="text-body text-foreground">
                See your material levels change instantly with every sale. No manual updates, no spreadsheet juggling.
              </p>
            </div>
            
            <div className="feature-card">
              <Zap className="h-12 w-12 text-primary-teal mb-6" />
              <h3 className="text-h3 text-foreground mb-4">Smart Reorder Alerts</h3>
              <p className="text-body text-foreground">
                Get notified before you run out. We calculate when you'll need more based on your sales patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container-padding section-padding bg-gradient-to-br from-primary-teal to-teal-light">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-h2 text-white mb-4">Simple. Recipe-Driven. Automatic.</h2>
          <p className="text-script text-white mb-16">Three steps to revolutionise your inventory</p>
          
          <div className="grid md:grid-cols-3 grid-gap">
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-teal font-bold text-lg mx-auto mb-6 border-2 border-white">
                1
              </div>
              <div className="feature-card">
                <Target className="h-8 w-8 text-primary-teal mx-auto mb-4" />
                <p className="text-body text-foreground">Create product recipes with your materials</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-teal font-bold text-lg mx-auto mb-6 border-2 border-white">
                2
              </div>
              <div className="feature-card">
                <CheckCircle className="h-8 w-8 text-primary-teal mx-auto mb-4" />
                <p className="text-body text-foreground">Connect your sales channels and inventory</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-teal font-bold text-lg mx-auto mb-6 border-2 border-white">
                3
              </div>
              <div className="feature-card">
                <Zap className="h-8 w-8 text-primary-teal mx-auto mb-4" />
                <p className="text-body text-foreground">Watch materials auto-deduct with every sale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="container-padding section-padding bg-paper-bg">
        <div className="max-w-4xl mx-auto">
          <div className="feature-card text-center" style={{ padding: '3rem', transform: 'rotate(1deg)' }}>
            <div className="flex justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-accent-orange fill-current" />
              ))}
            </div>
            
            <blockquote className="text-2xl lg:text-3xl font-medium leading-relaxed text-foreground mb-8">
              "Stock-Kit transformed my jewelry business. I used to spend hours tracking materials manually. Now everything updates automatically and I never run out of supplies."
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary-teal rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">SM</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Sarah Martinez</p>
                <p className="text-sm text-muted-foreground">Artisan Jewelry Maker</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-8 text-sm font-bold text-foreground">
              <span>Saved 2.8 hours weekly</span>
              <span>•</span>
              <span>Increased accuracy by 97%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container-padding section-padding bg-gradient-to-br from-teal-dark to-accent-orange overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 text-white mb-4">Cut Inventory Time by 90%—Try It Free.</h2>
          <p className="text-script text-white mb-8">No credit card required • 14-day trial • Cancel anytime</p>
          
          <Button 
            size="lg" 
            className="bg-white text-teal-dark hover:bg-gray-50 text-button px-8 py-4"
          >
            Start Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 container-padding py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6 text-white" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Stock-Kit</span>
                <span className="text-script text-sm text-gray-300 -mt-1">for makers</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">© 2024 Stock-Kit. All rights reserved.</p>
            <p className="text-script text-gray-400">Crafted in the workshop</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;