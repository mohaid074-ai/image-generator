
import React, { useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
  preview: string | null;
  disabled: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, preview, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageUpload(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] || null;
    onImageUpload(file);
    if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onImageUpload(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-300">
        Upload Image (for editing)
      </label>
      <div className="relative w-full aspect-video">
        <label
          htmlFor="image-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors ${preview ? 'border-solid' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {preview ? (
            <img src={preview} alt="Image preview" className="object-contain h-full w-full rounded-lg" />
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
            </div>
          )}
          <input ref={fileInputRef} id="image-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" disabled={disabled} />
        </label>
        {preview && (
             <button onClick={handleClear} disabled={disabled} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        )}
      </div>
    </div>
  );
};
