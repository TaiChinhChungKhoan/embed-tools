import React from 'react';

const TopdownInsightsProgress = ({ 
  analysisSteps, 
  selectedSection, 
  expandedSections, 
  toggleSection, 
  getCurrentStep 
}) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Quy trình phân tích Top-down
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Bước {getCurrentStep()}/5
        </span>
      </div>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 -z-10" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-500 -z-10"
          style={{ width: `${(getCurrentStep() - 1) * 25}%` }}
        />
        
        {analysisSteps.map((step, index) => {
          const isActive = selectedSection === step.key;
          const isPast = getCurrentStep() > step.order;
          const isCurrent = getCurrentStep() === step.order;
          
          return (
            <div 
              key={step.key}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => {
                if (!expandedSections.has(step.key)) {
                  toggleSection(step.key);
                }
                setTimeout(() => {
                  document.getElementById(`section-${step.key}`)?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                  });
                }, 100);
              }}
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all
                ${isActive ? 'bg-blue-500 text-white scale-110 shadow-lg' : 
                  isPast ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-yellow-500 text-white animate-pulse' :
                  'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}
                group-hover:scale-110 group-hover:shadow-md
              `}>
                {isPast ? '✓' : step.icon}
              </div>
              <span className={`
                mt-2 text-xs font-medium text-center hidden sm:block
                ${isActive ? 'text-blue-600 dark:text-blue-400' : 
                  isPast ? 'text-green-600 dark:text-green-400' :
                  'text-gray-600 dark:text-gray-400'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopdownInsightsProgress;
