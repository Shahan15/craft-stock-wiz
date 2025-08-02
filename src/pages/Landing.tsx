import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Play, 
  Scissors, 
  Sparkles, 
  Zap, 
  Bell, 
  Package, 
  ShoppingCart,
  Star,
  Heart,
  Palette,
  Link,
  Circle
} from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-6 lg:px-12">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center transform rotate-3">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <Circle className="absolute -top-2 -right-2 w-4 h-4 text-craft-orange fill-current" />
        </div>
        <span className="text-xl font-bold text-gray-900">Stock-Kit</span>
        <span className="handwritten text-sm text-teal transform -rotate-12 opacity-80">for makers</span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-700 hover:text-teal transition-colors relative group">
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
        </a>
        <a href="#how-it-works" className="text-gray-700 hover:text-teal transition-colors relative group">
          How It Works
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
        </a>
        <a href="#pricing" className="text-gray-700 hover:text-teal transition-colors relative group">
          Pricing
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
        </a>
        <Button 
          variant="outline" 
          className="border-2 border-teal text-teal hover:bg-teal hover:text-white transform hover:scale-105 transition-all duration-200"
          onClick={() => window.location.href = '/auth'}
        >
          Sign In
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t md:hidden">
          <div className="px-6 py-6 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-teal py-2">Features</a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-teal py-2">How It Works</a>
            <a href="#pricing" className="block text-gray-700 hover:text-teal py-2">Pricing</a>
            <Button 
              variant="outline" 
              className="w-full border-2 border-teal text-teal hover:bg-teal hover:text-white"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative px-6 py-16 lg:px-12 lg:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 organic-blob opacity-20 floating"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 organic-blob-2 opacity-15 floating" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-craft-orange rounded-full floating" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-teal rounded-full floating" style={{animationDelay: '3s'}}></div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="relative inline-block mb-8">
              <Badge variant="secondary" className="bg-teal/10 text-teal border-teal/30 px-4 py-2 text-sm font-medium transform -rotate-1">
                Revolutionary Recipe-Based Inventory
              </Badge>
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-craft-orange" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Automatically 
              <span className="relative inline-block mx-3">
                <span className="text-teal">Deduct</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8 Q 100 2 195 6" stroke="currentColor" strokeWidth="3" fill="none" className="text-teal opacity-60"/>
                </svg>
              </span>
              Materials with Every Sale
            </h1>

            <div className="text-lg leading-relaxed text-gray-700 mb-12 max-w-2xl space-y-3">
              <p className="flex items-start space-x-2">
                <Link className="w-5 h-5 text-teal mt-1 flex-shrink-0" />
                <span>Build simple product recipes like <span className="font-semibold text-teal">"1 chain + 5 beads = 1 necklace"</span></span>
              </p>
              <p className="flex items-start space-x-2">
                <Zap className="w-5 h-5 text-craft-orange mt-1 flex-shrink-0" />
                <span>then watch stock levels update themselves—<span className="font-semibold">no more guesswork.</span></span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Button 
                size="lg" 
                className="bg-teal hover:bg-teal-dark text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <button className="flex items-center space-x-3 text-gray-700 hover:text-teal transition-colors group">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-teal/10 transition-colors">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">Watch 2-min Demo</div>
                  <div className="text-xs text-gray-500">See it in action</div>
                </div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="craft-card p-8 transform rotate-3 shadow-xl">
              <div className="handwritten text-2xl text-craft-brown mb-4">Recipe Builder</div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-craft-cream rounded-lg">
                  <Circle className="w-4 h-4 text-teal fill-current" />
                  <span className="text-sm">1 × Silver Chain</span>
                </div>
                <div className="text-center text-2xl text-teal">+</div>
                <div className="flex items-center space-x-3 p-3 bg-craft-cream rounded-lg">
                  <Circle className="w-4 h-4 text-craft-orange fill-current" />
                  <span className="text-sm">5 × Glass Beads</span>
                </div>
                <div className="text-center text-2xl text-gray-400">=</div>
                <div className="flex items-center space-x-3 p-3 bg-teal/10 rounded-lg border-2 border-teal/30">
                  <Sparkles className="w-4 h-4 text-teal" />
                  <span className="text-sm font-semibold text-teal">1 × Beaded Necklace</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-craft-orange/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      name: 'Recipe Magic',
      description: 'Build products from materials with our visual recipe builder. Set it once, forget the math forever.',
      icon: Package,
      accent: 'teal'
    },
    {
      name: 'Smart Deduction',
      description: 'Every sale automatically updates your material stock. No spreadsheets, no manual tracking.',
      icon: Zap,
      accent: 'orange'
    },
    {
      name: 'Low Stock Alerts',
      description: 'Never run out of beads again. Get notified when materials are running low.',
      icon: Bell,
      accent: 'teal'
    },
    {
      name: 'Craft-Focused Design',
      description: 'Built specifically for makers, creators, and artisans. We understand your workflow.',
      icon: Palette,
      accent: 'orange'
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block relative mb-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              Why Makers <span className="text-teal">Love</span> Stock-Kit
            </h2>
            <div className="absolute -top-4 -right-8 w-8 h-8 text-craft-orange floating">
              <Heart className="w-full h-full fill-current" />
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop wrestling with complex inventory systems. 
            <span className="handwritten text-2xl text-teal block mt-2 transform rotate-1">
              Finally, software that gets creativity.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="craft-card p-8 hover:shadow-xl transition-all duration-300 group thread-connection">
              <div className={`w-16 h-16 rounded-2xl bg-${feature.accent === 'teal' ? 'teal' : 'craft-orange'}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className={`w-8 h-8 text-${feature.accent === 'teal' ? 'teal' : 'craft-orange'}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal transition-colors">
                {feature.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Sign Up & Set Up',
      description: 'Create your account and set up your business profile.',
      icon: Star,
    },
    {
      number: '2',
      title: 'Add Materials & Products',
      description: 'Input your raw materials and finished products with details and quantities.',
      icon: Heart,
    },
    {
      number: '3',
      title: 'Manage Recipes & Orders',
      description: 'Link materials to products and track incoming orders.',
      icon: Link,
    },
    {
      number: '4',
      title: 'Analyze & Optimize',
      description: 'Use our analytics to optimize your inventory and boost your profits.',
      icon: Zap,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-craft-paper-light">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
              <Badge className="bg-teal text-white font-bold text-xl absolute -top-4 left-1/2 transform -translate-x-1/2">
                {step.number}
              </Badge>
              <step.icon className="w-8 h-8 text-teal mx-auto mt-6 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Pricing</h2>
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-8">
            Start with our free plan and upgrade as your business grows.
          </p>
          <Button className="bg-teal hover:bg-teal-dark text-white py-3 px-8 text-lg transform hover:scale-105 transition-all duration-200">
            View Pricing Plans
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Stock-Kit. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}
