import React from 'react';

interface SimulationStepProps {
  isActive: boolean;
  isCompleted: boolean;
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const SimulationStep: React.FC<SimulationStepProps> = ({
  isActive,
  isCompleted,
  stepNumber,
  title,
  description,
  icon,
}) => {
  return (
    <div className={`relative flex flex-col items-center p-4 w-1/5 transition-all duration-500 ${isActive ? 'scale-105' : 'opacity-70'}`}>
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-lg border-2 z-10 transition-colors duration-300
        ${isActive ? 'bg-blue-600 border-blue-400 text-white' : 
          isCompleted ? 'bg-green-500 border-green-400 text-white' : 'bg-white border-gray-200 text-gray-400'}`}
      >
        {icon}
      </div>
      
      <h3 className={`font-bold text-sm mb-1 text-center ${isActive ? 'text-blue-800' : 'text-gray-500'}`}>
        {title}
      </h3>
      <p className="text-xs text-center text-gray-400 hidden md:block px-2 leading-tight">
        {description}
      </p>

      {/* Progress Bar Line */}
      <div className={`absolute top-10 left-1/2 w-full h-1 -z-0 
        ${stepNumber === 5 ? 'hidden' : ''} 
        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} 
      />
    </div>
  );
};