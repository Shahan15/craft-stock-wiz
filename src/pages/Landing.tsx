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
  ShoppingCart 
} from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-6 lg:px-12">
      <div className="flex items-center space-x-3">
        <div className="craft-card w-12 h-12 bg-gradient-to-br from-teal to-teal-dark rounded-xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-300 shadow-lg">
          <Scissors className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock-Kit</h1>
          <p className="handwritten text-sm text-teal transform -rotate-2">for makers</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-600 hover:text-teal transition-colors">Features</a>
        <a href="#how-it-works" className="text-gray-600 hover:text-teal transition-colors">How It Works</a>
        <a href="#pricing" className="text-gray-600 hover:text-teal transition-colors">Pricing</a>
        <Button 
          variant="outline" 
          className="border-2 border-teal text-teal hover:bg-teal hover:text-white transform hover:scale-105 transition-all duration-200"
          onClick={() => window.location.href = '/auth'}
        >
          Sign In
        </Button>
      </div>

      <button 
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t md:hidden">
          <div className="p-6 space-y-4">
            <a href="#features" className="block text-gray-600 hover:text-teal">Features</a>
            <a href="#how-it-works" className="block text-gray-600 hover:text-teal">How It Works</a>
            <a href="#pricing" className="block text-gray-600 hover:text-teal">Pricing</a>
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
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-craft-paper to-craft-paper-light"></div>
      <div className="organic-blob absolute top-10 right-10 w-64 h-64 bg-teal opacity-10 floating"></div>
      <div className="organic-blob absolute bottom-20 left-10 w-40 h-40 bg-craft-orange opacity-20 floating" style={{animationDelay: '2s'}}></div>
      
      <div className="relative container mx-auto px-6 text-center">
        <Badge className="mb-6 bg-teal/10 text-teal border-teal/20 hover:bg-teal hover:text-white transition-all duration-300 transform hover:scale-105">
          ✨ Built by makers, for makers
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Manage Your Creative
          <br />
          <span className="text-teal handwritten transform -rotate-1 inline-block">Inventory</span> with Love
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Finally, an inventory system that understands your creative process. 
          Track materials, manage recipes, and grow your maker business.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="craft-card bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => window.location.href = '/auth'}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg"
            className="text-gray-600 hover:text-teal"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            See How It Works
          </Button>
        </div>

        <div className="mt-12 flex justify-center items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Free forever plan
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            No credit card required
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      name: 'Material Tracking',
      description: 'Keep tabs on all your supplies with smart alerts when you\'re running low.',
      icon: Package,
      color: 'from-teal to-blue-500'
    },
    {
      name: 'Recipe Builder',
      description: 'Create detailed recipes that automatically calculate material needs.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Order Management',
      description: 'Track customer orders and automatically update inventory levels.',
      icon: ShoppingCart,
      color: 'from-green-500 to-teal'
    },
    {
      name: 'Smart Insights',
      description: 'Get personalized recommendations to optimize your inventory.',
      icon: Zap,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-craft-paper-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to <span className="handwritten text-teal">manage your craft</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Designed specifically for makers who create beautiful things and need simple tools to manage them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="craft-card group hover:transform hover:scale-105 transition-all duration-300">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
      number: '01',
      title: 'Add Your Materials',
      description: 'Start by adding the materials and supplies you work with. Set low-stock alerts so you never run out.',
      emoji: '📦'
    },
    {
      number: '02', 
      title: 'Create Product Recipes',
      description: 'Build recipes that show exactly what materials go into each of your products.',
      emoji: '📝'
    },
    {
      number: '03',
      title: 'Track Everything',
      description: 'As you create and sell, Stock-Kit automatically updates your inventory levels.',
      emoji: '📊'
    },
    {
      number: '04',
      title: 'Grow Your Business',
      description: 'Use insights to understand what sells best and when to reorder materials.',
      emoji: '🚀'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple steps to <span className="handwritten text-teal">organized success</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've made inventory management as simple as possible, so you can focus on what you love most - creating.
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal/20 via-teal to-teal/20 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="craft-card bg-white p-6 relative z-10 group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-dark rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:rotate-12 transition-transform duration-300">
                    {step.emoji}
                  </div>
                  <div className="handwritten text-teal text-sm mb-2 transform -rotate-2">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-craft-paper-light to-craft-paper">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start creating, <span className="handwritten text-teal">start free</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Perfect for makers just starting out or growing their business. 
            No hidden fees, no surprises.
          </p>
        </div>

        <div className="craft-card bg-white p-8 max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
            <p className="text-gray-600">Everything you need to get started</p>
          </div>

          <div className="space-y-3 mb-8 text-left">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal rounded-full mr-3"></div>
              <span className="text-gray-700">Unlimited materials & products</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal rounded-full mr-3"></div>
              <span className="text-gray-700">Recipe management</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal rounded-full mr-3"></div>
              <span className="text-gray-700">Low-stock alerts</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal rounded-full mr-3"></div>
              <span className="text-gray-700">Basic analytics</span>
            </div>
          </div>

          <Button 
            size="lg"
            className="w-full craft-card bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-teal text-white transform hover:scale-105 transition-all duration-300"
            onClick={() => window.location.href = '/auth'}
          >
            Get Started Free
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Ready to scale? We'll have premium features for growing businesses soon.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="craft-card w-10 h-10 bg-gradient-to-br from-teal to-teal-dark rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900">Stock-Kit</div>
              <div className="handwritten text-xs text-teal transform -rotate-2">for makers</div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600 text-sm mb-1">
              Made with ❤️ for the maker community
            </p>
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Stock-Kit. All rights reserved.
            </p>
          </div>
        </div>
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
