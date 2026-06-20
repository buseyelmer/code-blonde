import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function ViewAccordion({ children, title }: { children: React.ReactNode; title: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4 group">
      <button 
        className="w-full flex items-center justify-between text-left focus:outline-none py-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xl font-medium text-gray-900 tracking-wide">{title}</span>
        <ChevronDown 
          className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : 'group-hover:text-gray-600'
          }`} 
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}