import * as React from "react"
import { cn } from "../../lib/utils"

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

// Componente Select funcional con estado interno
const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    console.log('🎯 Rol seleccionado:', selectedValue);
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  const contextValue = {
    value,
    onValueChange: handleSelect,
    isOpen,
    setIsOpen,
  };

  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Solo pasar props a componentes personalizados, no a elementos DOM nativos
          if (typeof child.type === 'function' || (child.type as any).$$typeof) {
            return React.cloneElement(child as any, contextValue);
          }
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger: React.FC<SelectTriggerProps & {
  value?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void
}> = ({
  children,
  className,
  isOpen,
  setIsOpen
}) => {
    return (
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => {
          console.log('🖱️ Click en SelectTrigger, isOpen:', isOpen);
          setIsOpen?.(!isOpen);
        }}
      >
        {children}
        <svg
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    );
  };

const SelectContent: React.FC<SelectContentProps & {
  isOpen?: boolean;
  onValueChange?: (value: string) => void;
  value?: string;
}> = ({
  children,
  isOpen,
  onValueChange,
  value
}) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
        <div className="py-1">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              // Solo pasar props a componentes personalizados, no a elementos DOM nativos
              if (typeof child.type === 'function' || (child.type as any).$$typeof) {
                return React.cloneElement(child as any, {
                  onValueChange,
                  selectedValue: value
                });
              }
            }
            return child;
          })}
        </div>
      </div>
    );
  };

const SelectItem: React.FC<SelectItemProps & {
  onValueChange?: (value: string) => void;
  selectedValue?: string;
}> = ({
  value,
  children,
  onValueChange,
  selectedValue
}) => {
    const isSelected = selectedValue === value;

    return (
      <button
        type="button"
        className={cn(
          "w-full px-3 py-2 text-left text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors",
          isSelected && "bg-blue-100 text-blue-900 font-medium"
        )}
        onClick={() => {
          console.log('🖱️ Click en SelectItem:', value);
          onValueChange?.(value);
        }}
      >
        {children}
        {isSelected && (
          <span className="float-right text-blue-600">✓</span>
        )}
      </button>
    );
  };

const SelectValue: React.FC<SelectValueProps & { value?: string }> = ({ placeholder, value }) => {
  // Mapeo de valores a etiquetas legibles
  const roleLabels: Record<string, string> = {
    'student': 'Estudiante',
    'teacher': 'Profesor',
    'coordinator': 'Coordinador',
    'parent': 'Padre de Familia',
    'secretary': 'Secretaría',
    'admin': 'Administrador'
  };

  console.log('📋 SelectValue - value recibido:', value);

  // Si hay un valor seleccionado, mostrar la etiqueta correspondiente
  if (value && roleLabels[value]) {
    return (
      <span className="block truncate text-gray-900 font-medium">
        {roleLabels[value]}
      </span>
    );
  }

  // Si hay un valor pero no está en el mapeo, mostrar el valor tal como está
  if (value) {
    return (
      <span className="block truncate text-gray-900 font-medium">
        {value}
      </span>
    );
  }

  // Si no hay valor, mostrar el placeholder
  return (
    <span className="block truncate text-gray-500">
      {placeholder || "Selecciona tu rol"}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }