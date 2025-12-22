// src/components/Dashboard/DashboardLayout.tsx
import { ReactNode, useState } from 'react';
import {
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Link2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

type PageType =
  | 'statistics'
  | 'settings'
  | 'meta-integration'
  | 'create-stats'
  | 'reports';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export function DashboardLayout({
  children,
  currentPage,
  onNavigate,
}: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Statistiques', icon: BarChart3, page: 'statistics' as const },
    { name: 'Créer Stats', icon: Plus, page: 'create-stats' as const },
    { name: 'Mes Rapports', icon: FileText, page: 'reports' as const },
    {
      name: 'Intégration Meta',
      icon: Link2,
      page: 'meta-integration' as const,
    },
    { name: 'Paramètres', icon: Settings, page: 'settings' as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300">
      <nav className="bg-gradient-to-r from-blue-700 to-blue-600 shadow-lg">
        <div className="w-full px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="hidden sm:block text-lg sm:text-xl font-bold text-white truncate">
                Meta Stats
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => onNavigate(item.page)}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      currentPage === item.page
                        ? 'bg-white/30 text-white shadow-md'
                        : 'text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden sm:flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="hidden md:block text-right min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-white/70">Connecté</p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-blue-800/50 border-t border-white/10">
            <div className="px-3 sm:px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === item.page
                        ? 'bg-white/30 text-white'
                        : 'text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.name}
                  </button>
                );
              })}
              <div className="border-t border-white/10 my-2 pt-2">
                <p className="text-xs text-white/70 px-4 py-2">{user?.email}</p>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="w-full px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
