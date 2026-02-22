import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { generationAPI, personaAPI } from '../services/api';

export default function Generate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || 'image');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(type === 'image' ? 'dall-e-3' : 'gpt-4');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [persona, setPersona] = useState(null);
  const [usageStats, setUsageStats] = useState({ used: 0, limit: 10 });

  useEffect(() => {
    loadPersona();
    loadUsageStats();
  }, []);

  useEffect(() => {
  const typeParam = searchParams.get('type');
  if (typeParam === 'image' || typeParam === 'text') {
    setType(typeParam);
    // Set appropriate default model
    setModel(typeParam === 'image' ? 'dall-e-3' : 'gpt-4');
  }
}, [searchParams]);

  const loadPersona = async () => {
    try {
      const response = await personaAPI.get();
      setPersona(response.data.persona);
    } catch (error) {
      setPersona(null);
    }
  };

  const loadUsageStats = async () => {
    try {
      const response = await generationAPI.getAll();
      const generations = response.data.generations || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayGenerations = generations.filter(g => 
        new Date(g.createdAt) >= today && g.type === type
      );

      const limit = type === 'image' ? 10 : 50;
      setUsageStats({ used: todayGenerations.length, limit });
    } catch (error) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setSearchParams({ type: newType });
    setModel(newType === 'image' ? 'dall-e-3' : 'gpt-4');
    setResult(null);
    setError('');
    loadUsageStats();
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerating(true);
    setError('');
    setResult(null);

    try {
      let response;
      if (type === 'image') {
        response = await generationAPI.generateImage({ prompt, model });
        setResult({
          type: 'image',
          url: response.data.imageUrl,
          generation: response.data.generation
        });
      } else {
        response = await generationAPI.generateText({ prompt, model });
        setResult({
          type: 'text',
          text: response.data.text,
          generation: response.data.generation
        });
      }
      loadUsageStats();
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setResult(null);
    setError('');
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Generate Content</h1>
          <p className="text-gray-400">
            Create AI-powered images and text using your persona
          </p>
        </div>

        {/* No Persona Warning */}
        {!persona && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-500 text-sm">
              ⚠️ You haven't created a persona yet. Generated content won't be personalized.{' '}
              <a href="/persona" className="underline font-semibold">Create one now</a>
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Type Toggle */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleTypeChange('image')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition ${
                    type === 'image'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">🎨</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Image Generation</p>
                    <p className="text-xs opacity-70">
                      Create stunning AI-generated images personalized too your brand identity and visual style
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleTypeChange('text')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition ${
                    type === 'text'
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">✍️</span>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Text Generation</p>
                    <p className="text-xs opacity-70">
                      Generate compelling written content that matches your unique voice, tone, and audience preferences
                    </p>
                  </div>
                </button>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white text-lg">✏️</span>
                  <label className="text-white font-medium">Your Prompt</label>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition resize-none"
                  placeholder={
                    type === 'image'
                      ? 'Describe what you want to create... Your persona will automatically enhance this prompt with your brand identity and style.'
                      : 'e.g., Write a LinkedIn post about AI innovation'
                  }
                  disabled={generating}
                />
              </div>

              {/* AI Model Selection */}
<div className="mb-6">
  <div className="flex items-center gap-2 mb-3">
    <span className="text-white text-lg">✨</span>
    <label className="text-white font-medium">AI Model</label>
  </div>
  
  <div className="grid grid-cols-2 gap-3">
    {type === 'image' ? (
      <>
        <button
          onClick={() => setModel('dall-e-3')}
          disabled={generating}
          className={`p-4 rounded-xl border-2 transition text-left ${
            model === 'dall-e-3'
              ? 'border-white bg-white/5'
              : 'border-gray-700 bg-black/20 hover:border-gray-600'
          }`}
        >
          <p className="text-white font-semibold mb-1">DALL-E 3</p>
          <p className="text-xs text-gray-400">Best quality, most creative</p>
        </button>
        
        <button
          onClick={() => setModel('dall-e-2')}
          disabled={generating}
          className={`p-4 rounded-xl border-2 transition text-left ${
            model === 'dall-e-2'
              ? 'border-white bg-white/5'
              : 'border-gray-700 bg-black/20 hover:border-gray-600'
          }`}
        >
          <p className="text-white font-semibold mb-1">DALL-E 2</p>
          <p className="text-xs text-gray-400">Faster generation</p>
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => setModel('gpt-4')}
          disabled={generating}
          className={`p-4 rounded-xl border-2 transition text-left ${
            model === 'gpt-4'
              ? 'border-white bg-white/5'
              : 'border-gray-700 bg-black/20 hover:border-gray-600'
          }`}
        >
          <p className="text-white font-semibold mb-1">GPT-4</p>
          <p className="text-xs text-gray-400">Best quality, most capable</p>
        </button>
        
        <button
          onClick={() => setModel('gpt-4-turbo')}
          disabled={generating}
          className={`p-4 rounded-xl border-2 transition text-left ${
            model === 'gpt-4-turbo'
              ? 'border-white bg-white/5'
              : 'border-gray-700 bg-black/20 hover:border-gray-600'
          }`}
        >
          <p className="text-white font-semibold mb-1">GPT-4 Turbo</p>
          <p className="text-xs text-gray-400">Faster, same quality</p>
        </button>
        
        <button
          onClick={() => setModel('gpt-3.5-turbo')}
          disabled={generating}
          className={`p-4 rounded-xl border-2 transition text-left ${
            model === 'gpt-3.5-turbo'
              ? 'border-white bg-white/5'
              : 'border-gray-700 bg-black/20 hover:border-gray-600'
          }`}
        >
          <p className="text-white font-semibold mb-1">GPT-3.5 Turbo</p>
          <p className="text-xs text-gray-400">Fast & cost-effective</p>
        </button>

        <button
          onClick={() => setModel('gpt-4o')}
          disabled={generating}
          className={`p-4 rounded-xl border-2 transition text-left ${
            model === 'gpt-4o'
              ? 'border-white bg-white/5'
              : 'border-gray-700 bg-black/20 hover:border-gray-600'
          }`}
        >
          <p className="text-white font-semibold mb-1">GPT-4o</p>
          <p className="text-xs text-gray-400">Multimodal, newest</p>
        </button>
      </>
    )}
  </div>
</div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={generating || !prompt.trim()}
                  className="flex-1 bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Generating...
                    </span>
                  ) : (
                    `Generate with AI`
                  )}
                </button>
                
                {result && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition"
                  >
                    New Generation
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Stats */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Preview</h3>
              
              {result ? (
                <div>
                  {result.type === 'image' ? (
                    <div>
                      <img
                        src={result.url}
                        alt="Generated"
                        className="w-full rounded-lg mb-4"
                      />
                      <div className="space-y-2">
                        <a
                          href={result.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition text-center"
                        >
                          Download Image
                        </a>
                        
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition text-center"
                        >
                          Open Full Size
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-black/40 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                          {result.text}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(result.text);
                          alert('Copied to clipboard!');
                        }}
                        className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                      >
                        📋 Copy to Clipboard
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-black/40 rounded-lg flex items-center justify-center border border-gray-700">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">🖼️</span>
                    <p className="text-gray-500 text-sm">
                      Your generated content will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Usage Stats */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Today's Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Generations</span>
                    <span className="text-white font-semibold">
                      {usageStats.used}/{usageStats.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-brand-pink h-2 rounded-full transition-all"
                      style={{ width: `${(usageStats.used / usageStats.limit) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-white font-semibold">15s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}