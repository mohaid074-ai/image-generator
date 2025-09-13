import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ImageUpload } from './components/ImageUpload';
import { ActionButtons } from './components/ActionButtons';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { ApiKeyInput } from './components/ApiKeyInput';
import { enhancePrompt, generateImage, editImage, initializeGemini } from './services/geminiService';
import type { EditMode } from './types';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

function App() {
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('A photorealistic image of a majestic lion in the savanna at sunset, detailed fur, warm lighting.');
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      initializeGemini(storedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

  const handleApiKeySave = (apiKey: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    initializeGemini(apiKey);
    setIsApiKeySet(true);
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    initializeGemini(''); // Nullify the client
    setIsApiKeySet(false);
  };

  const handleImageUpload = (file: File | null) => {
    setInputImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setInputImagePreview(null);
    }
  };

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to enhance.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Enhancing prompt...');
    setError(null);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to enhance prompt.');
      console.error(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt]);

  const handleSubmit = useCallback(async (mode: EditMode) => {
    setError(null);
    setOutputImage(null);

    if (!prompt) {
      setError('A text prompt is required for all actions.');
      return;
    }
    if (mode !== 'generate' && !inputImage) {
      setError('An image upload is required for editing.');
      return;
    }

    setIsLoading(true);
    const messages = {
      generate: 'Generating your masterpiece...',
      changeCloth: 'Tailoring new clothes for your image...',
      changeBackground: 'Scouting for a new background...',
    };
    setLoadingMessage(messages[mode]);

    try {
      let resultImage: string;
      if (mode === 'generate') {
        resultImage = await generateImage(prompt);
      } else {
        // This assertion is safe due to the check above
        resultImage = await editImage(prompt, inputImage!, mode);
      }
      setOutputImage(resultImage);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : `An unknown error occurred during ${mode}.`;
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, inputImage]);

  if (!isApiKeySet) {
    return <ApiKeyInput onSave={handleApiKeySave} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header onClearApiKey={handleClearApiKey} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onEnhance={handleEnhancePrompt}
              disabled={isLoading}
            />
            <ImageUpload
              onImageUpload={handleImageUpload}
              preview={inputImagePreview}
              disabled={isLoading}
            />
            <ActionButtons onSubmit={handleSubmit} disabled={isLoading || !prompt} hasImage={!!inputImage} />
          </div>

          {/* Right Column: Output */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex items-center justify-center min-h-[400px] lg:min-h-0">
            <ImageDisplay
              image={outputImage}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;