import { useState } from 'react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
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
        <Button variant="outline" className="border-2 border-teal text-teal hover:bg-teal hover:text-white transform hover:scale-105 transition-all duration-200">
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
            <Button variant="outline" className="w-full border-2 border-teal text-teal hover:bg-teal hover:text-white">
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
      icon: Palette,
      title: "Recipe Builder",
      description: "Create simple formulas for your products. Define exactly what materials go into each item you make.",
      color: "teal",
      highlight: true,
      rotation: "rotate-2"
    },
    {
      icon: Zap,
      title: "Auto-Deduct Stock",
      description: "Every time you log a sale, Stock-Kit automatically deducts the right materials from your inventory.",
      color: "craft-orange",
      rotation: "-rotate-1"
    },
    {
      icon: Bell,
      title: "Low-Stock Alerts",
      description: "Get notified before you run out of materials so you can restock at the perfect time.",
      color: "craft-brown",
      rotation: "rotate-1"
    }
  ];

  return (
    <section id="features" className="px-6 py-20 lg:px-12 relative">
      {/* Background thread connections */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-1/2 left-1/4 w-96 h-96 opacity-10" viewBox="0 0 400 400">
          <path d="M50 200 Q 200 100 350 200 Q 200 300 50 200" stroke="currentColor" strokeWidth="2" fill="none" className="text-teal"/>
        </svg>
      </div>
      
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="handwritten text-3xl text-craft-brown mb-2 transform -rotate-2">Why makers love us</div>
          <div className="w-24 h-1 bg-teal mx-auto rounded-full mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className={`craft-card p-8 transform ${feature.rotation} hover:scale-105 transition-all duration-300 ${feature.highlight ? 'ring-2 ring-teal/20' : ''}`}>
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.color === 'teal' ? 'bg-teal/10 text-teal' :
                  feature.color === 'craft-orange' ? 'bg-craft-orange/10 text-craft-orange' :
                  'bg-craft-brown/10 text-craft-brown'
                }`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                {feature.highlight && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-craft-orange rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-current" />
                  </div>
                )}
                
                <h3 className={`text-xl font-bold mb-4 ${
                  feature.color === 'teal' ? 'text-teal' :
                  feature.color === 'craft-orange' ? 'text-craft-orange' :
                  'text-craft-brown'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-teal/30 to-craft-orange/30 rounded-full"></div>
              </div>
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
      number: 1,
      icon: Package,
      title: "Add Materials",
      description: "Import or manually add your raw materials and their quantities.",
      color: "bg-teal"
    },
    {
      number: 2,
      icon: Palette,
      title: "Build Recipes",
      description: "Create simple formulas that define what goes into each product.",
      color: "bg-craft-orange"
    },
    {
      number: 3,
      icon: ShoppingCart,
      title: "Log Sale & Watch Stock Adjust",
      description: "Record your sales and watch materials automatically deduct.",
      color: "bg-craft-brown"
    }
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 lg:px-12 bg-gradient-to-br from-craft-cream via-white to-craft-paper relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-64 h-64 organic-blob opacity-5 floating"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 organic-blob-2 opacity-5 floating" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple. Recipe-Driven. 
            <span className="relative inline-block mx-2">
              <span className="text-teal">Automatic.</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8 Q 100 2 195 6" stroke="currentColor" strokeWidth="3" fill="none" className="text-craft-orange opacity-60"/>
              </svg>
            </span>
          </h2>
          <p className="handwritten text-2xl text-craft-brown mb-8">Three steps to revolutionize your inventory</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className={`relative w-20 h-20 rounded-full ${step.color} text-white flex items-center justify-center mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <span className="text-2xl font-bold">{step.number}</span>
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <div className="craft-card p-6 w-full transform hover:scale-105 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl ${step.color}/10 flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className={`w-6 h-6 ${
                      step.color === 'bg-teal' ? 'text-teal' :
                      step.color === 'bg-craft-orange' ? 'text-craft-orange' :
                      'text-craft-brown'
                    }`} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Thread connections */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-16 h-0.5 bg-gradient-to-r from-teal/40 to-craft-orange/40 transform translate-x-8 thread-connection"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="px-6 py-20 lg:px-12 relative">
      <div className="mx-auto max-w-4xl">
        <div className="craft-card p-12 text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-all duration-500">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-8 h-8 organic-blob floating"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 organic-blob-2 floating" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-6 w-3 h-3 bg-teal rounded-full floating" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/4 right-6 w-4 h-4 bg-craft-orange rounded-full floating" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current mx-1 transform hover:scale-125 transition-transform" />
              ))}
            </div>
            
            <blockquote className="text-2xl lg:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
              "I cut weekly inventory time from 
              <span className="relative inline-block mx-2">
                <span className="font-bold text-teal">3 hours to 10 minutes</span>
                <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 5 Q 100 1 195 4" stroke="currentColor" strokeWidth="2" fill="none" className="text-craft-orange opacity-60"/>
                </svg>
              </span>
              —because Stock-Kit auto-calculates my material needs."
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal to-craft-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">SM</span>
              </div>
              <div className="text-left">
                <p className="text-gray-700 font-medium">Sarah M.</p>
                <p className="text-gray-500 text-sm">Jewelry Designer</p>
              </div>
            </div>
            
            <div className="inline-flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-teal rounded-full"></div>
                <span className="font-semibold text-teal">Saved 2.8 hours weekly</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-craft-orange rounded-full"></div>
                <span className="font-semibold text-craft-orange">Increased accuracy by 97%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="relative px-6 py-20 lg:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal via-teal-dark to-craft-brown"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 organic-blob floating"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 organic-blob-2 floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rounded-full floating" style={{animationDelay: '3s'}}></div>
      </div>
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Cut Inventory Time by 
          <span className="relative inline-block mx-2">
            <span className="text-craft-orange">90%</span>
            <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8 Q 50 2 95 6" stroke="currentColor" strokeWidth="3" fill="none" className="text-white opacity-60"/>
            </svg>
          </span>
          —Try It Free.
        </h2>
        
        <div className="handwritten text-2xl text-white/90 mb-12">Join 1,200+ happy makers</div>
        
        <Button 
          size="lg" 
          className="bg-white text-teal hover:bg-gray-100 px-8 py-4 text-lg font-semibold mb-6 transform hover:scale-105 transition-all duration-200 shadow-xl"
        >
          <Heart className="w-5 h-5 mr-2" />
          Start Your Free Trial
        </Button>
        
        <div className="flex items-center justify-center space-x-6 text-white/80 text-sm">
          <div className="flex items-center space-x-2">
            <Circle className="w-2 h-2 fill-current" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-2 h-2 fill-current" />
            <span>14-day trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-2 h-2 fill-current" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 px-6 py-12 lg:px-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 w-16 h-16 organic-blob floating"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 organic-blob-2 floating" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="relative">
              <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center transform rotate-3">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <Circle className="absolute -top-2 -right-2 w-4 h-4 text-craft-orange fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Stock-Kit</span>
              <span className="handwritten text-sm text-teal ml-2">for makers</span>
            </div>
          </div>
          
          <div className="flex space-x-8 text-gray-400">
            <a href="#privacy" className="hover:text-white transition-colors relative group">
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
            </a>
            <a href="#terms" className="hover:text-white transition-colors relative group">
              Terms
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
            </a>
            <a href="#support" className="hover:text-white transition-colors relative group">
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal transition-all group-hover:w-full"></span>
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 mb-2">&copy; 2025 Stock-Kit. Made with <Heart className="w-4 h-4 inline text-craft-orange fill-current" /> for makers everywhere.</p>
          <p className="handwritten text-teal text-sm">Crafted in Portland, Oregon</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonial />
      <FooterCTA />
      <Footer />
    </div>
  );
}