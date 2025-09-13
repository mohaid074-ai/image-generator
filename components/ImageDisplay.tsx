
import React from 'react';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, loadingMessage, error }) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-semibold text-gray-300 animate-pulse">{loadingMessage || 'Processing...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg border border-red-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (image) {
    return (
      <div className="w-full h-full p-2 bg-black/20 rounded-lg">
          <img src={image} alt="Generated output" className="w-full h-full object-contain rounded-md" />
      </div>
    );
  }

  return (
    <div className="text-center text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1a2 2 0 010-2.828l1-1" /><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
      <h2 className="text-2xl font-bold text-gray-400">Your image will appear here</h2>
      <p className="mt-2">Enter a prompt and choose an action to get started.</p>
    </div>
  );
};
