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
    <section className="py-24 md:py-32 bg-craft-paper-light">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Craft Your Success with <span className="text-teal">Stock-Kit</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12">
          The ultimate inventory management solution for makers, artisans, and small businesses.
        </p>
        <Button className="bg-teal hover:bg-teal-dark text-white py-3 px-8 text-lg transform hover:scale-105 transition-all duration-200">
          Get Started Free
        </Button>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      name: 'Real-time Inventory Tracking',
      description: 'Always know your stock levels. Get alerts when materials are low.',
      icon: Package,
    },
    {
      name: 'Product Recipe Management',
      description: 'Easily create and manage product recipes, linking materials to finished goods.',
      icon: Palette,
    },
    {
      name: 'Order Management',
      description: 'Track orders, sales, and customer information in one central place.',
      icon: ShoppingCart,
    },
    {
      name: 'Insightful Analytics',
      description: 'Gain insights into your business with sales trends, material usage, and more.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <feature.icon className="w-8 h-8 text-teal mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
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
            <div key={index} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
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
