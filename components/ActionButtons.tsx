import React from 'react';
import type { EditMode } from '../types';

interface ActionButtonsProps {
  onSubmit: (mode: EditMode) => void;
  disabled: boolean;
  hasImage: boolean;
}

const ActionButton: React.FC<{
  onClick: () => void;
  disabled: boolean;
  title: string;
  description: string;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
  primary?: boolean;
}> = ({ onClick, disabled, title, description, icon, primary = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-start space-x-4
      ${primary 
        ? 'bg-cyan-600 border-cyan-500 hover:bg-cyan-500' 
        : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-cyan-500'
      }
      disabled:bg-gray-600 disabled:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed
    `}
  >
    <div className={`flex-shrink-0 w-8 h-8 mt-1 ${primary ? 'text-white' : 'text-cyan-400'}`}>
        {icon}
    </div>
    <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className={`text-sm ${primary ? 'text-cyan-100' : 'text-gray-400'}`}>{description}</p>
    </div>
  </button>
);


export const ActionButtons: React.FC<ActionButtonsProps> = ({ onSubmit, disabled, hasImage }) => {
  return (
    <div className="flex flex-col space-y-4 pt-4 border-t border-gray-700">
        <ActionButton 
            onClick={() => onSubmit('changeCloth')}
            disabled={disabled || !hasImage}
            title="Change Cloth"
            description="Edit the clothing on a person in your uploaded image."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /><path d="M18 8L12 2 6 8" /><path d="M12 2v10" /></svg>}
        />
        <ActionButton 
            onClick={() => onSubmit('changeBackground')}
            disabled={disabled || !hasImage}
            title="Change Background"
            description="Replace the background of your uploaded image."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1a2 2 0 010-2.828l1-1" /><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>}
        />
        <ActionButton 
            onClick={() => onSubmit('generate')}
            disabled={disabled}
            title="Generate Image"
            description="Create a new image from scratch using only your prompt."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16v4m-2-2h4m5 11v4m-2-2h4M12 3v18" /></svg>}
            primary
        />
    </div>
  );
};