import { useState, useEffect } from 'react';
import { User, Mail, Save, Bell, Lock, Palette } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      const loadProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setFullName(data.full_name || '');
        }
      };
      loadProfile();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        <p className="mt-1 text-blue-100">Gérez vos paramètres de compte et vos préférences</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg ${message.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-400/20 to-cyan-300/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-2">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Informations Profil</h2>
              <p className="text-sm text-gray-600">Mettez à jour vos informations personnelles</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">L'email ne peut pas être changé</p>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom Complet
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Entrez votre nom complet"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer les Modifications'}
          </button>
        </form>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-400/20 to-cyan-300/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-2">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Gérez vos préférences de notification</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Notifications Email</p>
              <p className="text-sm text-gray-600">Recevez des mises à jour par email</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Notifications Push</p>
              <p className="text-sm text-gray-600">Recevez des notifications push sur votre appareil</p>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-400/20 to-cyan-300/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-2">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apparence</h2>
              <p className="text-sm text-gray-600">Personnalisez l'apparence du tableau de bord</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mb-2"></div>
              <span className="text-sm font-medium text-gray-900">Bleu</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 mb-2"></div>
              <span className="text-sm font-medium text-gray-900">Gris</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mb-2"></div>
              <span className="text-sm font-medium text-gray-900">Vert</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 mb-2"></div>
              <span className="text-sm font-medium text-gray-900">Rouge</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-md border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-red-400/20 to-orange-300/20">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-2">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
              <p className="text-sm text-gray-600">Gérez votre mot de passe et vos paramètres de sécurité</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 font-semibold rounded-lg transition-all">
            <Lock className="w-5 h-5 mr-2" />
            Changer le Mot de Passe
          </button>
        </div>
      </div>
    </div>
  );
}
