import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { MetaCallback } from './components/Auth/MetaCallback';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { StatisticsPage } from './components/Dashboard/StatisticsPage';
import { SettingsPage } from './components/Dashboard/SettingsPage';
import { MetaIntegrationPage } from './components/Dashboard/MetaIntegrationPage';
import { CreateStatisticsPage } from './components/Dashboard/CreateStatisticsPage';
import { ViewReportsPage } from './components/Dashboard/ViewReportsPage';

type PageType = 'statistics' | 'settings' | 'meta-integration' | 'create-stats' | 'reports';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('statistics');
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (
    currentRoute === '/auth/callback' ||
    window.location.hash.includes('access_token')
  ) {
    return <MetaCallback />;
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'statistics':
        return <StatisticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'meta-integration':
        return <MetaIntegrationPage />;
      case 'create-stats':
        return <CreateStatisticsPage />;
      case 'reports':
        return <ViewReportsPage />;
      default:
        return <StatisticsPage />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
