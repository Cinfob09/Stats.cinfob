import { Plus, TrendingUp, Users, Activity, Calendar } from 'lucide-react';

export function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
          <p className="mt-1 text-gray-600">Create and manage your statistics</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md">
          <Plus className="w-5 h-5 mr-2" />
          Create Statistic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">2,543</h3>
          <p className="text-sm text-gray-600 mt-1">Total Views</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+8.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
          <p className="text-sm text-gray-600 mt-1">Active Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+15.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">89.2%</h3>
          <p className="text-sm text-gray-600 mt-1">Engagement Rate</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">456</h3>
          <p className="text-sm text-gray-600 mt-1">This Month</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-600 mt-1">Your latest statistics overview</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-lg p-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Website Traffic</p>
                <p className="text-sm text-gray-600">Updated 2 hours ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">3,456</p>
              <p className="text-sm text-green-600">+12.5%</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-lg p-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">User Signups</p>
                <p className="text-sm text-gray-600">Updated 5 hours ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">234</p>
              <p className="text-sm text-green-600">+8.2%</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-lg p-2">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Conversion Rate</p>
                <p className="text-sm text-gray-600">Updated 1 day ago</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">4.8%</p>
              <p className="text-sm text-green-600">+2.1%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to create your first statistic?</h2>
            <p className="text-blue-100">Start tracking your data and gain valuable insights</p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
