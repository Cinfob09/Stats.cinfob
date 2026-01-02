// src/components/Dashboard/CreateStatisticsPage.tsx
import React, { useState, useEffect } from 'react';import {
  Plus,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  BarChart3,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface MetaConnection {
  id: string;
  page_id: string;
  page_name: string;
  access_token: string;
  instagram_account_id: string | null;
  instagram_username: string | null;
}

interface MetricOption {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'both';
  icon: any;
  description: string;
}

const AVAILABLE_METRICS: MetricOption[] = [
  {
    id: 'page_impressions',
    name: 'Impressions',
    platform: 'facebook',
    icon: Eye,
    description: 'Nombre total de fois où votre contenu a été affiché',
  },
  {
    id: 'page_engaged_users',
    name: 'Utilisateurs engagés',
    platform: 'facebook',
    icon: Users,
    description: 'Personnes qui ont interagi avec votre page',
  },
  {
    id: 'page_post_engagements',
    name: 'Engagement des publications',
    platform: 'facebook',
    icon: Heart,
    description: 'Likes, commentaires, partages et clics',
  },
  {
    id: 'page_fans',
    name: 'Nombre de fans',
    platform: 'facebook',
    icon: TrendingUp,
    description: 'Total de personnes qui aiment votre page',
  },
  {
    id: 'impressions',
    name: 'Impressions Instagram',
    platform: 'instagram',
    icon: Eye,
    description: 'Nombre de fois où vos posts ont été vus',
  },
  {
    id: 'reach',
    name: 'Portée Instagram',
    platform: 'instagram',
    icon: Users,
    description: 'Nombre de comptes uniques ayant vu vos posts',
  },
  {
    id: 'engagement',
    name: 'Engagement Instagram',
    platform: 'instagram',
    icon: Heart,
    description: 'Likes, commentaires, sauvegardes',
  },
  {
    id: 'follower_count',
    name: 'Nombre de followers',
    platform: 'instagram',
    icon: TrendingUp,
    description: 'Total de personnes qui vous suivent',
  },
];

export function CreateStatisticsPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<MetaConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Configuration du rapport
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedConnections, setSelectedConnections] = useState<Set<string>>(
    new Set()
  );
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set()
  );
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );

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
      setConnections(data || []);
    } catch (err) {
      console.error('Error loading connections:', err);
    }
  };

  const toggleConnection = (id: string) => {
    const newSet = new Set(selectedConnections);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedConnections(newSet);
  };

  const toggleMetric = (id: string) => {
    const newSet = new Set(selectedMetrics);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedMetrics(newSet);
  };

  const fetchMetrics = async (connection: MetaConnection) => {
    const stats: any[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Récupérer les métriques Facebook
    if (
      selectedMetrics.has('page_impressions') ||
      selectedMetrics.has('page_engaged_users') ||
      selectedMetrics.has('page_post_engagements') ||
      selectedMetrics.has('page_fans')
    ) {
      const fbMetrics = Array.from(selectedMetrics).filter(
        (m) =>
          AVAILABLE_METRICS.find((metric) => metric.id === m)?.platform ===
          'facebook'
      );

      if (fbMetrics.length > 0) {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/${connection.page_id}/insights?` +
              `metric=${fbMetrics.join(',')}` +
              `&period=day` +
              `&since=${Math.floor(yesterday.getTime() / 1000)}` +
              `&until=${Math.floor(today.getTime() / 1000)}` +
              `&access_token=${connection.access_token}`
          );

          const data = await response.json();

          if (data.data) {
            for (const metric of data.data) {
              stats.push({
                user_id: user?.id,
                connection_id: connection.id,
                platform: 'facebook',
                metric_name: metric.name,
                metric_value: metric.values[0]?.value || 0,
                period_start: yesterday.toISOString(),
                period_end: today.toISOString(),
                data: metric,
              });
            }
          }
        } catch (err) {
          console.error('Error fetching Facebook metrics:', err);
        }
      }
    }

    // Récupérer les métriques Instagram
    if (connection.instagram_account_id) {
      const igMetrics = Array.from(selectedMetrics).filter(
        (m) =>
          AVAILABLE_METRICS.find((metric) => metric.id === m)?.platform ===
          'instagram'
      );

      if (igMetrics.length > 0) {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/${connection.instagram_account_id}/insights?` +
              `metric=${igMetrics.join(',')}` +
              `&period=day` +
              `&since=${Math.floor(yesterday.getTime() / 1000)}` +
              `&until=${Math.floor(today.getTime() / 1000)}` +
              `&access_token=${connection.access_token}`
          );

          const data = await response.json();

          if (data.data) {
            for (const metric of data.data) {
              stats.push({
                user_id: user?.id,
                connection_id: connection.id,
                platform: 'instagram',
                metric_name: metric.name,
                metric_value: metric.values[0]?.value || 0,
                period_start: yesterday.toISOString(),
                period_end: today.toISOString(),
                data: metric,
              });
            }
          }
        } catch (err) {
          console.error('Error fetching Instagram metrics:', err);
        }
      }
    }

    return stats;
  };

  const handleCreateReport = async () => {
    if (!reportTitle.trim()) {
      setError('Veuillez entrer un titre pour le rapport');
      return;
    }

    if (selectedConnections.size === 0) {
      setError('Veuillez sélectionner au moins une connexion');
      return;
    }

    if (selectedMetrics.size === 0) {
      setError('Veuillez sélectionner au moins une métrique');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Créer le rapport
      const { data: report, error: reportError } = await supabase
        .from('stat_reports')
        .insert({
          user_id: user?.id,
          title: reportTitle,
          description: reportDescription,
          connections: Array.from(selectedConnections),
          metrics: Array.from(selectedMetrics),
          period_type: periodType,
          last_sync: new Date().toISOString(),
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Récupérer les statistiques pour chaque connexion
      const allStats: any[] = [];
      for (const connId of Array.from(selectedConnections)) {
        const connection = connections.find((c) => c.id === connId);
        if (connection) {
          const stats = await fetchMetrics(connection);
          allStats.push(...stats);
        }
      }

      // Sauvegarder les statistiques
      if (allStats.length > 0) {
        const { error: statsError } = await supabase
          .from('social_stats')
          .insert(allStats);

        if (statsError) throw statsError;
      }

      setSuccess(
        `Rapport créé avec succès! ${allStats.length} statistiques collectées.`
      );

      // Réinitialiser le formulaire
      setReportTitle('');
      setReportDescription('');
      setSelectedConnections(new Set());
      setSelectedMetrics(new Set());
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du rapport');
    } finally {
      setLoading(false);
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Aucune connexion
        </h2>
        <p className="text-gray-600 mb-6">
          Vous devez d'abord connecter vos comptes Facebook et Instagram
        </p>
        <button
          onClick={() => (window.location.href = '/meta-integration')}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Connecter mes comptes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Créer un rapport statistique
        </h1>
        <p className="mt-1 text-gray-600">
          Configurez et collectez vos statistiques Meta
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Configuration du rapport */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Informations du rapport
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du rapport *
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Rapport mensuel - Janvier 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez l'objectif de ce rapport..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période de collecte
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setPeriodType(period)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    periodType === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="w-5 h-5 mx-auto mb-1" />
                  {period === 'daily'
                    ? 'Quotidien'
                    : period === 'weekly'
                    ? 'Hebdomadaire'
                    : 'Mensuel'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sélection des connexions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Sélectionnez les comptes *
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {connections.map((connection) => (
            <button
              key={connection.id}
              onClick={() => toggleConnection(connection.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedConnections.has(connection.id)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {connection.page_name}
                  </p>
                  {connection.instagram_username && (
                    <p className="text-sm text-pink-600 mt-1">
                      @{connection.instagram_username}
                    </p>
                  )}
                </div>
                {selectedConnections.has(connection.id) && (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sélection des métriques */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Sélectionnez les métriques *
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AVAILABLE_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedMetrics.has(metric.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  {selectedMetrics.has(metric.id) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="font-semibold text-gray-900 mb-1">
                  {metric.name}
                </p>
                <p className="text-xs text-gray-600">{metric.description}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    metric.platform === 'facebook'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-pink-100 text-pink-700'
                  }`}
                >
                  {metric.platform === 'facebook' ? 'Facebook' : 'Instagram'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bouton de création */}
      <div className="flex justify-end">
        <button
          onClick={handleCreateReport}
          disabled={loading}
          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-3" />
              Créer le rapport et collecter les données
            </>
          )}
        </button>
      </div>
    </div>
  );
}
