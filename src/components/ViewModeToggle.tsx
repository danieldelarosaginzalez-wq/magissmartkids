import React from 'react';
import { useViewMode } from '../contexts/ViewModeContext';
import { GraduationCap, Users } from 'lucide-react';

export const ViewModeToggle: React.FC = () => {
    const { viewMode, setViewMode } = useViewMode();

    return (
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
                onClick={() => setViewMode('academic')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'academic'
                        ? 'bg-white text-blue-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm">Académico</span>
            </button>
            <button
                onClick={() => setViewMode('tutoring')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${viewMode === 'tutoring'
                        ? 'bg-white text-green-600 shadow-sm font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                <Users className="h-4 w-4" />
                <span className="text-sm">Refuerzo</span>
            </button>
        </div>
    );
};
