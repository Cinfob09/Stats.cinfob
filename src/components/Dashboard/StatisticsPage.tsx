import { Plus, TrendingUp, Users, Activity, Calendar } from 'lucide-react';

export function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Statistiques</h1>
          <p className="mt-1 text-blue-100">Créez et gérez vos statistiques</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105">
          <Plus className="w-5 h-5 mr-2" />
          Créer Statistique
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 p-6 hover:shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">2,543</h3>
          <p className="text-sm text-gray-600 mt-1">Vues Totales</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 p-6 hover:shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
          <p className="text-sm text-gray-600 mt-1">Utilisateurs Actifs</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 p-6 hover:shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">89.2%</h3>
          <p className="text-sm text-gray-600 mt-1">Taux d'Engagement</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 p-6 hover:shadow-lg transition-all hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-600">+5.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">456</h3>
          <p className="text-sm text-gray-600 mt-1">Ce Mois</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Activité Récente</h2>
          <p className="text-sm text-gray-600 mt-1">Aperçu de vos dernières statistiques</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Trafic Site Web</p>
                <p className="text-sm text-gray-600">Mis à jour il y a 2 heures</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">3,456</p>
              <p className="text-sm text-green-600">+12.5%</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Inscriptions Utilisateurs</p>
                <p className="text-sm text-gray-600">Mis à jour il y a 5 heures</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">234</p>
              <p className="text-sm text-green-600">+8.2%</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Taux de Conversion</p>
                <p className="text-sm text-gray-600">Mis à jour il y a 1 jour</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">4.8%</p>
              <p className="text-sm text-green-600">+2.1%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl shadow-lg p-8 text-white border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Prêt à créer votre première statistique?</h2>
            <p className="text-white/90">Commencez à suivre vos données et obtenez des insights précieux</p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
}
