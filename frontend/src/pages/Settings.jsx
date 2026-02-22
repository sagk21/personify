import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-dark-card rounded-xl p-2 border border-gray-800 w-fit">
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'account'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'preferences'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'billing'
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Billing
          </button>
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Account Created
                  </label>
                  <input
                    type="text"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    disabled
                    className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-4">Danger Zone</h2>
              <p className="text-sm text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition">
                Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-6">Generation Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Default Image Model
                  </label>
                  <select className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition">
                    <option value="dall-e-3">DALL-E 3</option>
                    <option value="dall-e-2">DALL-E 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Default Text Model
                  </label>
                  <select className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition">
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-700">
                  <div>
                    <p className="text-white font-medium mb-1">Auto-enhance prompts</p>
                    <p className="text-sm text-gray-400">
                      Automatically add persona details to your prompts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-pink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-700">
                  <div>
                    <p className="text-white font-medium mb-1">Save generation history</p>
                    <p className="text-sm text-gray-400">
                      Keep a record of all your generations
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-pink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                  </label>
                </div>
              </div>

              <button className="mt-6 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition">
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-6">Current Plan</h2>
              
              <div className="bg-gradient-to-r from-brand-pink/20 to-purple-600/20 border border-brand-pink/30 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
                    <p className="text-gray-300">Perfect for trying out Personify</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">$0</p>
                    <p className="text-gray-400 text-sm">per month</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300 mb-6">
                  <p>✓ 10 image generations per day</p>
                  <p>✓ 50 text generations per day</p>
                  <p>✓ 1 persona</p>
                  <p>✓ Basic support</p>
                </div>

                <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                  Upgrade to Pro
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-500 text-sm">
                  💳 Payment integration coming soon! Enjoy the free plan for now.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}