import { useViewMode } from '../contexts/ViewModeContext';
import { getViewModeText, getGradeDisplay, getGradeColor } from '../utils/viewModeTexts';

export const useViewModeText = () => {
    const { viewMode, isAcademicMode, isTutoringMode } = useViewMode();

    const getText = (key: string): string => {
        return getViewModeText(viewMode, key);
    };

    const formatGrade = (grade: number): string => {
        return getGradeDisplay(grade, viewMode);
    };

    const getGradeColorClass = (grade: number): string => {
        return getGradeColor(grade, viewMode);
    };

    return {
        viewMode,
        isAcademicMode,
        isTutoringMode,
        getText,
        formatGrade,
        getGradeColorClass
    };
};
