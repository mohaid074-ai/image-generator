
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onEnhance: () => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onEnhance, disabled }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="prompt-input" className="text-sm font-medium text-gray-300">
        Your Creative Prompt
      </label>
      <div className="relative">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., An astronaut riding a horse on Mars, cinematic lighting"
          className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-none disabled:opacity-50"
          disabled={disabled}
        />
        <button
          onClick={onEnhance}
          disabled={disabled}
          className="absolute bottom-3 right-3 flex items-center px-3 py-1.5 bg-cyan-600 text-white rounded-md text-xs font-semibold hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Enhance
        </button>
      </div>
    </div>
  );
};
