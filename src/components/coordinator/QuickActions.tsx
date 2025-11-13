import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, UserPlus, FileText, Settings } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'grados',
    title: 'Gestión de Grados',
    description: 'Asignar profesores a grados y secciones',
    icon: School,
    gradient: 'from-blue-500 to-blue-600',
    route: '/gestion-grados'
  },
  {
    id: 'usuarios',
    title: 'Gestión de Usuarios',
    description: 'Ver y administrar todos los usuarios',
    icon: UserPlus,
    gradient: 'from-emerald-500 to-emerald-600',
    route: '/users'
  },
  {
    id: 'reportes',
    title: 'Reportes',
    description: 'Generar reportes institucionales',
    icon: FileText,
    gradient: 'from-purple-500 to-purple-600',
    route: '/reports'
  }
];

interface QuickActionsProps {
  maxItems?: number;
  columns?: 2 | 3 | 4 | 6;
  showTitle?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  maxItems = 6, 
  columns = 3,
  showTitle = true 
}) => {
  const navigate = useNavigate();
  
  const displayedActions = quickActions.slice(0, maxItems);
  
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className="w-full">
      {showTitle && (
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h2>
        </div>
      )}
      
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {displayedActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => navigate(action.route)}
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} p-6 text-left shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Círculo decorativo */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10"></div>
              
              {/* Contenido */}
              <div className="relative z-10">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg w-fit mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-white/90 text-sm">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
