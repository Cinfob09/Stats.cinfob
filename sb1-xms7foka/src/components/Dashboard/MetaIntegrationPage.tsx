// src/components/Dashboard/MetaIntegrationPage.tsx
import { useState, useEffect } from 'react';
import {
  Facebook,
  Instagram,
  Link,
  Check,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: {
    id: string;
    username: string;
  };
}

export function MetaIntegrationPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger les connexions existantes
  useEffect(() => {
    loadConnections();
  }, [user]);

  const loadConnections = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('meta_connections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setConnected(true);
        setPages(
          data.map((conn) => ({
            id: conn.page_id,
            name: conn.page_name,
            access_token: conn.access_token,
            instagram_business_account: conn.instagram_account_id
              ? {
                  id: conn.instagram_account_id,
                  username: conn.instagram_username,
                }
              : undefined,
          }))
        );
      }
    } catch (err) {
      console.error('Error loading connections:', err);
    }
  };

  // Étape 1: Rediriger vers Facebook OAuth
  const handleConnectFacebook = () => {
    const appId = import.meta.env.VITE_META_APP_ID;
    const redirectUri = `${window.location.origin}/meta/callback`;

    const scope = [
      'pages_show_list',
      'pages_read_engagement',
      'read_insights',
      'instagram_basic',
      'instagram_manage_insights',
    ].join(',');

    const authUrl =
      `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&response_type=code` +
      `&state=${user?.id}`;

    window.location.href = authUrl;
  };

  // Étape 2: Récupérer les pages après OAuth (appelé depuis callback)
  const fetchUserPages = async (accessToken: string) => {
    setLoading(true);
    setError('');

    try {
      // Récupérer les pages Facebook
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}&fields=id,name,access_token,instagram_business_account{id,username}`
      );

      const pagesData = await pagesResponse.json();

      if (pagesData.error) {
        throw new Error(pagesData.error.message);
      }

      setPages(pagesData.data || []);
      setConnected(true);
      setSuccess('Connexion réussie! Sélectionnez les pages à suivre.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des pages');
    } finally {
      setLoading(false);
    }
  };

  // Étape 3: Sauvegarder les pages sélectionnées
  const handleSaveConnections = async () => {
    if (selectedPages.size === 0) {
      setError('Veuillez sélectionner au moins une page');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Supprimer les anciennes connexions
      await supabase.from('meta_connections').delete().eq('user_id', user?.id);

      // Insérer les nouvelles connexions
      const connections = Array.from(selectedPages).map((pageId) => {
        const page = pages.find((p) => p.id === pageId);
        return {
          user_id: user?.id,
          page_id: page?.id,
          page_name: page?.name,
          access_token: page?.access_token,
          instagram_account_id: page?.instagram_business_account?.id || null,
          instagram_username:
            page?.instagram_business_account?.username || null,
        };
      });

      const { error } = await supabase
        .from('meta_connections')
        .insert(connections);

      if (error) throw error;

      setSuccess('Connexions sauvegardées avec succès!');
      await loadConnections();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const togglePageSelection = (pageId: string) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageId)) {
      newSelection.delete(pageId);
    } else {
      newSelection.add(pageId);
    }
    setSelectedPages(newSelection);
  };

  const handleDisconnect = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter tous les comptes?')) {
      return;
    }

    try {
      await supabase.from('meta_connections').delete().eq('user_id', user?.id);

      setConnected(false);
      setPages([]);
      setSelectedPages(new Set());
      setSuccess('Déconnexion réussie');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Intégration Meta</h1>
        <p className="mt-1 text-gray-600">
          Connectez vos pages Facebook et comptes Instagram
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {!connected ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Link className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connectez vos comptes Meta
            </h2>

            <p className="text-gray-600 mb-8">
              Connectez vos pages Facebook et comptes Instagram Business pour
              commencer à analyser vos statistiques. Vous pourrez sélectionner
              quelles pages suivre après la connexion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <Facebook className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pages Facebook
                </h3>
                <p className="text-sm text-gray-600">
                  Statistiques de portée, engagement, et démographiques
                </p>
              </div>

              <div className="bg-pink-50 rounded-lg p-6">
                <Instagram className="w-8 h-8 text-pink-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Comptes Instagram
                </h3>
                <p className="text-sm text-gray-600">
                  Impressions, interactions, et croissance de followers
                </p>
              </div>
            </div>

            <button
              onClick={handleConnectFacebook}
              disabled={loading}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Facebook className="w-5 h-5 mr-3" />
              Connecter avec Facebook
            </button>

            <p className="mt-6 text-sm text-gray-500">
              Nous ne publierons jamais sans votre permission
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Pages connectées
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pages.length} page(s) disponible(s)
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={loadConnections}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </button>
                <button
                  onClick={handleDisconnect}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  Déconnecter
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedPages.has(page.id)}
                      onChange={() => togglePageSelection(page.id)}
                      className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 rounded-lg p-2">
                          <Facebook className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {page.name}
                          </h3>
                          <p className="text-sm text-gray-500">ID: {page.id}</p>
                        </div>
                      </div>

                      {page.instagram_business_account && (
                        <div className="flex items-center space-x-3 ml-11 mt-3 p-3 bg-pink-50 rounded-lg">
                          <Instagram className="w-5 h-5 text-pink-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              @{page.instagram_business_account.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              Compte Instagram Business lié
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedPages.has(page.id) && (
                      <div className="flex-shrink-0">
                        <div className="bg-green-100 rounded-full p-1">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleSaveConnections}
                disabled={loading || selectedPages.size === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Sauvegarder la sélection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
