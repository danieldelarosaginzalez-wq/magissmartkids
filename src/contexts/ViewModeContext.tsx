import React, { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'academic' | 'tutoring';

interface ViewModeContextType {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    isAcademicMode: boolean;
    isTutoringMode: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export const ViewModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('academic');

    const value = {
        viewMode,
        setViewMode,
        isAcademicMode: viewMode === 'academic',
        isTutoringMode: viewMode === 'tutoring'
    };

    return (
        <ViewModeContext.Provider value={value}>
            {children}
        </ViewModeContext.Provider>
    );
};

export const useViewMode = () => {
    const context = useContext(ViewModeContext);
    if (context === undefined) {
        throw new Error('useViewMode must be used within a ViewModeProvider');
    }
    return context;
};
