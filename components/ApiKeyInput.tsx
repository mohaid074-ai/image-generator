import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
        <div className="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-3xl font-bold text-white">Gemini Image Studio</h1>
            <p className="text-gray-400 mt-2">Enter your API key to begin.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-300 mb-2">
                    Google AI Studio API Key
                </label>
                <input
                    id="api-key-input"
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter your secret key here"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    required
                />
            </div>
            <p className="text-xs text-gray-500">
                You can get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a>.
                Your key is stored only in your browser's local storage.
            </p>
            <button
                type="submit"
                disabled={!key.trim()}
                className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
                Save and Continue
            </button>
        </form>
      </div>
    </div>
  );
};