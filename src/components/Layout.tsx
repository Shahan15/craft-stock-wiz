import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { 
  Scissors, 
  LayoutDashboard, 
  Package, 
  Palette, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Circle,
  Link as LinkIcon,
  TrendingUp,
  FileText,
  User,
  Menu,
  X
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { signOut } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Materials', href: '/materials', icon: Package },
    { name: 'Products', href: '/products', icon: Palette },
    { name: 'Recipes', href: '/recipes', icon: FileText },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Integrations', href: '/integrations', icon: LinkIcon },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleSignOut = async () => {
    await signOut()
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-craft-paper flex">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <Button
          onClick={() => setSidebarOpen(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900 flex-1 truncate">
          Stock-Kit
        </h1>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            onClick={closeSidebar}
            variant="ghost"
            size="sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Logo */}
        <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 bg-teal rounded-xl flex items-center justify-center transform rotate-3">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <Circle className="absolute -top-2 -right-2 w-4 h-4 text-craft-orange fill-current" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900">Stock-Kit</span>
            <span className="handwritten text-sm text-teal ml-2">for makers</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-teal/10 text-teal font-medium'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-teal'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <main className="p-4 lg:p-8 min-h-screen overflow-x-hidden">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}