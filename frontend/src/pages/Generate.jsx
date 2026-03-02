import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { generationAPI, personaAPI } from '../services/api';

export default function Generate() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || 'image');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(
    type === 'image' ? 'dall-e-3' : 'gpt-4'
  );
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [persona, setPersona] = useState(null);
  const [usageStats, setUsageStats] = useState({ used: 0, limit: 10 });
  const [useFaceConsistency, setUseFaceConsistency] = useState(false);

  useEffect(() => {
    loadPersona();
  }, []);

  useEffect(() => {
    loadUsageStats();
  }, [type]);

  const loadPersona = async () => {
    try {
      const response = await personaAPI.get();
      setPersona(response.data.persona);
    } catch {
      setPersona(null);
    }
  };

  const loadUsageStats = async () => {
    try {
      const response = await generationAPI.getAll();
      const generations = response.data.generations || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayGenerations = generations.filter(
        (g) =>
          new Date(g.createdAt) >= today &&
          g.type === type
      );

      const limit = type === 'image' ? 10 : 50;
      setUsageStats({ used: todayGenerations.length, limit });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
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
        response = await generationAPI.generateImage({
          prompt,
          model: useFaceConsistency ? 'fal-face-to-many' : model,
          useFaceConsistency,
        });

        setResult({
          type: 'image',
          url: response.data.imageUrl,
        });
      } else {
        response = await generationAPI.generateText({
          prompt,
          model,
        });

        setResult({
          type: 'text',
          text: response.data.text,
        });
      }

      loadUsageStats();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Generation failed. Please try again.'
      );
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
          <h1 className="text-3xl font-semibold text-white mb-2">
            Generate Content
          </h1>
          <p className="text-gray-400">
            Create AI-powered images and text using your persona
          </p>
        </div>

        {/* Persona Warning */}
        {!persona && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <p className="text-yellow-500 text-sm">
              ⚠️ You haven't created a persona yet. Generated content won't be personalized.
            </p>
          </div>
        )}

        {/* TYPE TOGGLE */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setType('image');
              setModel('dall-e-3');
              setResult(null);
              setUseFaceConsistency(false);
            }}
            disabled={generating}
            className={`flex-1 p-6 rounded-xl border-2 transition text-left ${
              type === 'image'
                ? 'border-white bg-white/5'
                : 'border-gray-700 bg-black/20 hover:border-gray-600'
            }`}
          >
            <span className="text-3xl">🎨</span>
            <h3 className="text-xl font-semibold text-white mt-2">
              Image Generation
            </h3>
          </button>

          <button
            onClick={() => {
              setType('text');
              setModel('gpt-4');
              setResult(null);
            }}
            disabled={generating}
            className={`flex-1 p-6 rounded-xl border-2 transition text-left ${
              type === 'text'
                ? 'border-white bg-white/5'
                : 'border-gray-700 bg-black/20 hover:border-gray-600'
            }`}
          >
            <span className="text-3xl">✍️</span>
            <h3 className="text-xl font-semibold text-white mt-2">
              Text Generation
            </h3>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Prompt */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                disabled={generating}
                placeholder={
                  type === 'image'
                    ? 'Describe what you want to create...'
                    : 'e.g., Write a LinkedIn post about AI innovation'
                }
                className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white"
              />
            </div>

            {/* Preview */}
            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              {result ? (
                result.type === 'image' ? (
                  <>
                    <img
                      src={result.url}
                      alt="Generated"
                      className="w-full rounded-lg mb-4"
                    />
                  </>
                ) : (
                  <div className="bg-black/40 rounded-lg p-6">
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {result.text}
                    </p>
                  </div>
                )
              ) : (
                <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Your generated content will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex gap-4">
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="flex-1 bg-white text-black py-4 rounded-xl font-semibold"
              >
                {generating ? 'Generating...' : 'Generate with AI'}
              </button>

              {result && (
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl"
                >
                  New Generation
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            <div className="bg-dark-card rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-medium mb-4">
                ✨ AI Model
              </h3>

              {type === 'image' ? (
                <>
                  {!useFaceConsistency ? (
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={generating}
                      className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white mb-4"
                    >
                      <option value="dall-e-3">DALL-E 3</option>
                      <option value="dall-e-2">DALL-E 2</option>
                    </select>
                  ) : (
                    <div className="bg-brand-pink/10 border border-brand-pink/30 rounded-lg p-4 mb-4">
                      <p className="text-brand-pink text-sm">
                        Using Fal.ai Face-to-Many
                      </p>
                    </div>
                  )}

                  {/* Face Consistency */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">
                        Use My Face
                      </span>
                      <input
                        type="checkbox"
                        checked={useFaceConsistency}
                        onChange={(e) =>
                          setUseFaceConsistency(e.target.checked)
                        }
                        disabled={generating}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={generating}
                  className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gpt-3.5-turbo">
                    GPT-3.5 Turbo
                  </option>
                  <option value="gpt-4o">GPT-4o</option>
                </select>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}