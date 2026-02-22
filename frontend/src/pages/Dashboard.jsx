import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { personaAPI, generationAPI } from '../services/api';

export default function Dashboard() {
  const [persona, setPersona] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [stats, setStats] = useState({
    totalGenerations: 0,
    imageGenerations: 0,
    textGenerations: 0,
    imagesUsedToday: 0,
    textUsedToday: 0,
    favoriteModel: 'DALL-E'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load persona
      try {
        const personaRes = await personaAPI.get();
        setPersona(personaRes.data.persona);
      } catch (err) {
        setPersona(null);
      }

      // Load recent generations
      const generationsRes = await generationAPI.getAll();
      const generations = generationsRes.data.generations || [];
      setRecentGenerations(generations.slice(0, 3));

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayGenerations = generations.filter(g => 
        new Date(g.createdAt) >= today
      );

      const imageCount = generations.filter(g => g.type === 'image').length;
      const textCount = generations.filter(g => g.type === 'text').length;
      const imagesUsedToday = todayGenerations.filter(g => g.type === 'image').length;
      const textUsedToday = todayGenerations.filter(g => g.type === 'text').length;

      // Find favorite model
      const modelCounts = {};
      generations.forEach(g => {
        modelCounts[g.model] = (modelCounts[g.model] || 0) + 1;
      });
      const favoriteModel = Object.keys(modelCounts).length > 0
        ? Object.keys(modelCounts).reduce((a, b) => modelCounts[a] > modelCounts[b] ? a : b)
        : 'DALL-E';
      
      setStats({
        totalGenerations: generations.length,
        imageGenerations: imageCount,
        textGenerations: textCount,
        imagesUsedToday,
        textUsedToday,
        favoriteModel: favoriteModel.toUpperCase()
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Welcome Back, {persona?.userId ? 'Sagar' : 'User'}
          </h1>
          <p className="text-gray-400">
            Ready to create something amazing today?
          </p>
        </div>

        {/* Persona Card */}
        {persona ? (
          <div className="bg-dark-card rounded-2xl p-6 mb-8 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-pink to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  SK
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Your Persona</h2>
                  <p className="text-gray-400 text-sm">
                    Content Creator • {persona.industry || 'Tech & Lifestyle'}
                  </p>
                </div>
              </div>
              <Link
                to="/persona"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm font-medium"
              >
                Change Persona
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">
                  {persona.personaImages?.length || 0}
                </p>
                <p className="text-sm text-gray-400">Reference Images</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white mb-1">
                  {persona.targetAudience || 'Young Adults'}
                </p>
                <p className="text-sm text-gray-400">Target Audience</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white mb-1">
                  {persona.brandTone || 'Casual & Fun'}
                </p>
                <p className="text-sm text-gray-400">Brand Tone</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">👤</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-500 mb-1">
                  Create Your Persona
                </h3>
                <p className="text-gray-300 mb-4">
                  Set up your digital persona to start generating personalized AI content.
                </p>
                <Link
                  to="/persona"
                  className="inline-block px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition font-medium"
                >
                  Create Persona →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-card rounded-2xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Images Today</p>
                <p className="text-3xl font-bold text-white">
                  {stats.imagesUsedToday}/10
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">{10 - stats.imagesUsedToday} remaining</p>
          </div>

          <div className="bg-dark-card rounded-2xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Text Today</p>
                <p className="text-3xl font-bold text-white">
                  {stats.textUsedToday}/50
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">{50 - stats.textUsedToday} remaining</p>
          </div>

          <div className="bg-dark-card rounded-2xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Generations</p>
                <p className="text-3xl font-bold text-white">{stats.totalGenerations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">All time</p>
          </div>

          <div className="bg-dark-card rounded-2xl p-6 border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Favourite Model</p>
                <p className="text-2xl font-bold text-white">{stats.favoriteModel}</p>
              </div>
              <div className="w-12 h-12 bg-brand-pink/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Most Used</p>
          </div>
        </div>

        {/* Create New Generation */}
        <div className="bg-dark-card rounded-2xl p-6 border border-gray-800 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Create New Generation</h2>
            <div className="flex gap-2">
              <Link
                to="/generate?type=image"
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition font-medium text-sm"
              >
                Image
              </Link>
              <Link
                to="/generate?type=text"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium text-sm"
              >
                Text
              </Link>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Your Prompt</label>
            <textarea
              placeholder="Describe what you want to create... Your persona will automatically enhance this prompt with your brand identity and style."
              rows={3}
              className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">AI Model</label>
              <select className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition">
                <option>DALL-E (Default)</option>
              </select>
            </div>
            <div className="flex items-end">
              <Link
                to="/generate"
                className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition font-semibold text-center"
              >
                Generate with AI
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Generations */}
        {recentGenerations.length > 0 && (
          <div className="bg-dark-card rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Generations</h2>
              <Link
                to="/history"
                className="text-sm text-brand-pink hover:text-pink-400 font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {recentGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="bg-black/40 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition"
                >
                  <div className="h-48 bg-gray-900 flex items-center justify-center">
                    {gen.type === 'image' ? (
                      gen.result ? (
                        <img src={gen.result} alt="Generated" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl">🖼️</span>
                      )
                    ) : (
                      <div className="p-4 text-sm text-gray-400 line-clamp-6">
                        {gen.result}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        gen.type === 'image' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {gen.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(gen.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {gen.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}