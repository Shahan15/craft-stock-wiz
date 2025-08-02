import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  Scissors, 
  Users, 
  Star, 
  Sparkles, 
  CheckCircle, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  ArrowRight,
  Play,
  Plus,
  Bell
} from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-craft-paper p-6">
        <div className="max-w-4xl mx-auto">
          <div className="craft-card p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome back, {user.email}!
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
              Your Stock-Kit dashboard is ready to help you manage your craft inventory.
            </p>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-craft-paper">
      {/* Navigation */}
      <nav className="px-6 py-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Scissors className="h-8 w-8 text-craft-teal" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-craft-orange rounded-full"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Stock-Kit</span>
              <span className="font-handwritten text-2xl text-craft-brown ml-2">for makers</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-lg leading-relaxed text-foreground hover:text-craft-teal transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-lg leading-relaxed text-foreground hover:text-craft-teal transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-lg leading-relaxed text-foreground hover:text-craft-teal transition-colors">
              Pricing
            </a>
            <Button variant="outline" asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-craft-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-craft-orange/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column */}
            <div className="col-span-1 lg:col-span-7">
              {/* Badge */}
              <div className="flex items-center space-x-2 mb-6">
                <Badge className="text-sm font-medium bg-craft-cream text-craft-teal border-craft-teal">
                  Revolutionary Stock Management
                </Badge>
                <Sparkles className="h-5 w-5 text-craft-orange" />
              </div>

              {/* H1 with inline SVG underline */}
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-foreground mb-6">
                Simple.{" "}
                <span className="relative">
                  Recipe-Driven.
                  <svg 
                    className="absolute -bottom-2 left-0 w-full h-4" 
                    viewBox="0 0 300 12" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M5,6 Q50,2 100,6 T200,6 Q250,4 295,6" 
                      stroke="#E67E22" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                Stock Control.
              </h1>

              {/* Subhead */}
              <div className="flex flex-col space-y-4 mb-8">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Build recipes. Make products. Watch your stock auto-deduct. No spreadsheets, no guesswork.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Built specifically for makers who want to focus on creating, not counting.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-craft-teal" />
                  <span className="text-lg leading-relaxed">Recipe-based inventory tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-craft-teal" />
                  <span className="text-lg leading-relaxed">Automatic stock deduction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-craft-teal" />
                  <span className="text-lg leading-relaxed">Low-stock alerts that actually matter</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="xl" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="link" className="text-craft-teal flex items-center">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo (2 min)
                </Button>
              </div>
            </div>

            {/* Right Column - Recipe Builder Card */}
            <div className="col-span-1 lg:col-span-5">
              <div className="craft-card p-8 transform rotate-3 shadow-xl">
                <h3 className="font-handwritten text-2xl text-craft-brown mb-4">
                  My Lavender Soap Recipe
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-base">Olive Oil</span>
                    <span className="text-sm text-muted-foreground">500g</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-base">Coconut Oil</span>
                    <span className="text-sm text-muted-foreground">200g</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-base">Lavender Essential Oil</span>
                    <span className="text-sm text-muted-foreground">15ml</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-base">Lye</span>
                    <span className="text-sm text-muted-foreground">95g</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-craft-teal">Makes: 8 bars</span>
                  <div className="decorative-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              We've stripped away the complexity and focused on what matters most to makers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="craft-card p-8 relative">
              <Package className="h-12 w-12 text-craft-teal mb-6" />
              <h3 className="text-xl font-bold mb-4 text-foreground">Recipe Builder</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Create detailed recipes with ingredients, quantities, and yield. Our system tracks every component.
              </p>
              <div className="absolute top-6 right-6 decorative-dot"></div>
            </div>

            {/* Feature 2 */}
            <div className="craft-card p-8 relative">
              <TrendingUp className="h-12 w-12 text-craft-teal mb-6" />
              <h3 className="text-xl font-bold mb-4 text-foreground">Auto-Deduct Stock</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Mark a product as made, and we automatically deduct all ingredients from your inventory.
              </p>
              <div className="absolute top-6 right-6 decorative-dot"></div>
            </div>

            {/* Feature 3 */}
            <div className="craft-card p-8 relative">
              <AlertTriangle className="h-12 w-12 text-craft-teal mb-6" />
              <h3 className="text-xl font-bold mb-4 text-foreground">Smart Alerts</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Get notified when materials run low, with suggestions for reorder quantities.
              </p>
              <div className="absolute top-6 right-6 decorative-dot"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 lg:px-12 bg-gradient-to-br from-craft-cream to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="font-handwritten text-2xl text-craft-brown">
              Three simple steps to inventory freedom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <div className="text-center">
              <Badge className="text-sm font-medium mb-6">Step 1</Badge>
              <div className="craft-card p-6 mb-6">
                <Package className="h-16 w-16 text-craft-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-foreground">Build Your Recipes</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Add ingredients, set quantities, define what each recipe produces.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <Badge className="text-sm font-medium mb-6">Step 2</Badge>
              <div className="craft-card p-6 mb-6">
                <TrendingUp className="h-16 w-16 text-craft-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-foreground">Make & Track</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Log production runs and watch inventory update automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <Badge className="text-sm font-medium mb-6">Step 3</Badge>
              <div className="craft-card p-6 mb-6">
                <AlertTriangle className="h-16 w-16 text-craft-teal mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4 text-foreground">Stay Informed</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Get alerts before you run out, order efficiently, never miss a sale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 py-20 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="craft-card p-12 text-center transform rotate-1">
            {/* Stars */}
            <div className="flex justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-craft-orange fill-current" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl lg:text-3xl font-medium leading-relaxed text-foreground mb-8">
              "Stock-Kit saved me{" "}
              <span className="relative">
                20+ hours per month
                <svg 
                  className="absolute -bottom-1 left-0 w-full h-3" 
                  viewBox="0 0 200 8" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M3,4 Q50,1 100,4 T197,4" 
                    stroke="#E67E22" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              on inventory management. Now I can focus on what I love – creating beautiful soaps."
            </blockquote>

            {/* Avatar and Name */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-craft-teal/20 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-craft-teal" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Sarah Chen</p>
                <p className="text-sm text-muted-foreground">Founder, Botanical Soap Co.</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex justify-center space-x-8 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-craft-teal">500+</p>
                <p className="text-sm text-muted-foreground">Products tracked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-craft-teal">20hrs</p>
                <p className="text-sm text-muted-foreground">Saved monthly</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-craft-teal">$0</p>
                <p className="text-sm text-muted-foreground">Lost sales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-20 lg:px-12 overflow-hidden bg-gradient-to-br from-craft-teal/5 to-craft-orange/5 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Ready to simplify your{" "}
            <span className="relative">
              inventory?
              <svg 
                className="absolute -bottom-2 left-0 w-full h-4" 
                viewBox="0 0 250 12" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5,6 Q60,2 125,6 T245,6" 
                  stroke="#E67E22" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="font-handwritten text-2xl text-craft-brown mb-8">
            Join hundreds of makers who've already simplified their stock management
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Button size="xl" asChild>
              <a href="/auth">Start Your Free Trial</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-12 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Scissors className="h-6 w-6 text-white" />
              <span className="text-lg font-bold text-white">Stock-Kit</span>
              <span className="font-handwritten text-xl text-craft-orange">for makers</span>
            </div>

            {/* Links */}
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Stock-Kit. All rights reserved.
            </p>
            <p className="font-handwritten text-craft-orange mt-4 md:mt-0">
              Crafted in California with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;