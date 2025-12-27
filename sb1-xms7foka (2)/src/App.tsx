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

type PageType =
  | 'statistics'
  | 'settings'
  | 'meta-integration'
  | 'create-stats'
  | 'reports';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('statistics');
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    // On écoute aussi les changements de hash (pour les access_token de Meta)
    window.addEventListener('hashchange', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // 1. GESTION DU CHARGEMENT
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-400 font-medium">
            Chargement de la session...
          </p>
        </div>
      </div>
    );
  }

  // 2. DETECTION DU CALLBACK META (AVANT LE CHECK USER)
  // On ajoute '/meta/callback' car c'est l'URL que Meta essaie d'appeler d'après ton erreur
  const isMetaCallback =
    currentRoute.includes('/auth/callback') ||
    currentRoute.includes('/meta/callback') ||
    window.location.hash.includes('access_token') ||
    window.location.search.includes('code=') ||
    window.location.search.includes('error_code='); // Pour capturer les erreurs Meta proprement

  if (isMetaCallback) {
    return <MetaCallback />;
  }

  // 3. REDIRECTION LOGIN SI NON CONNECTÉ
  if (!user) {
    return <LoginForm />;
  }

  // 4. ROUTAGE DU DASHBOARD
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
