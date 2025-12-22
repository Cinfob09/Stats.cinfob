// src/components/Dashboard/ViewReportsPage.tsx
import { useState, useEffect } from 'react';
import {
  FileText,
  TrendingUp,
  Calendar,
  Trash2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Report {
  id: string;
  title: string;
  description: string;
  period_type: string;
  last_sync: string;
  is_active: boolean;
  created_at: string;
  stats_count?: number;
}

interface Stat {
  id: string;
  platform: string;
  metric_name: string;
  metric_value: number;
  period_start: string;
  period_end: string;
}

export function ViewReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stat_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Charger le nombre de stats pour chaque rapport
      const reportsWithCount = await Promise.all(
        (data || []).map(async (report) => {
          const { count } = await supabase
            .from('social_stats')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('connection_id', report.connections);

          return { ...report, stats_count: count || 0 };
        })
      );

      setReports(reportsWithCount);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReportStats = async (report: Report) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_stats')
        .select('*')
        .eq('user_id', user.id)
        .in('connection_id', report.connections)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setStats(data || []);
      setSelectedReport(report);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('stat_reports')
        .delete()
        .eq('id', reportId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setReports(reports.filter((r) => r.id !== reportId));
      if (selectedReport?.id === reportId) {
        setSelectedReport(null);
        setStats([]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatValue = (value: number, metricName: string) => {
    if (metricName.includes('rate') || metricName.includes('percentage')) {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Rapports</h1>
          <p className="mt-1 text-gray-600">
            {reports.length} rapport{reports.length > 1 ? 's' : ''} créé
            {reports.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadReports}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aucun rapport
          </h2>
          <p className="text-gray-600 mb-6">
            Créez votre premier rapport pour commencer à suivre vos statistiques
          </p>
          <button
            onClick={() =>
              (window.location.href = '/dashboard?page=create-stats')
            }
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            Créer un rapport
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des rapports */}
          <div className="lg:col-span-1 space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all ${
                  selectedReport?.id === report.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
                onClick={() => loadReportStats(report)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    {report.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {report.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteReport(report.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {report.period_type === 'daily'
                        ? 'Quotidien'
                        : report.period_type === 'weekly'
                        ? 'Hebdomadaire'
                        : 'Mensuel'}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {report.stats_count} stats
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Dernière sync: {formatDate(report.last_sync)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Détails du rapport sélectionné */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedReport.title}
                  </h2>
                  {selectedReport.description && (
                    <p className="text-gray-700">
                      {selectedReport.description}
                    </p>
                  )}
                </div>

                <div className="p-6">
                  {stats.length === 0 ? (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Aucune statistique disponible
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Statistiques récentes ({stats.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Plateforme
                              </th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                                Métrique
                              </th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                                Valeur
                              </th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {stats.map((stat) => (
                              <tr key={stat.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                      stat.platform === 'facebook'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-pink-100 text-pink-700'
                                    }`}
                                  >
                                    {stat.platform === 'facebook'
                                      ? 'Facebook'
                                      : 'Instagram'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {stat.metric_name}
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                                  {formatValue(
                                    stat.metric_value,
                                    stat.metric_name
                                  )}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 text-right">
                                  {new Date(
                                    stat.period_start
                                  ).toLocaleDateString('fr-FR')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sélectionnez un rapport
                </h3>
                <p className="text-gray-600">
                  Cliquez sur un rapport à gauche pour voir ses statistiques
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
