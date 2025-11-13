# Sistema de Navegación al Inicio

Este sistema maneja la navegación inteligente al inicio de la aplicación con scroll automático.

## Problema Solucionado

Cuando el usuario está en la página de inicio (`/`) y hace clic en el logo, React Router no navega porque ya está en esa ruta, por lo que el scroll no se ejecutaba. Ahora el sistema detecta si ya está en inicio y hace scroll directo.

## Componentes y Hooks

### 1. `useNavigateHome` Hook
Hook personalizado que maneja la navegación inteligente al inicio.

**Funcionalidad:**
- Detecta si ya estás en la página de inicio (`/`)
- Si ya estás en inicio: hace scroll directo (sin delay)
- Si estás en otra página: navega y luego hace scroll (con delay)

**Retorna:**
- `navigateToHome: () => void` - Función para navegar al inicio con scroll
- `isAtHome: boolean` - Indica si ya estás en la página de inicio

### 2. `scrollUtils.ts` - Utilidades de Scroll

**Funciones disponibles:**
- `scrollToTop(delay?: number)` - Scroll suave hasta arriba
- `scrollToTopInstant()` - Scroll instantáneo sin animación
- `scrollToElement(id, offset?, delay?)` - Scroll a elemento específico
- `isNearTop(threshold?)` - Detecta si está cerca del top
- `onScroll(callback)` - Hook para detectar scroll

### 3. `Logo.tsx` - Componente Logo Mejorado
Logo interactivo que siempre lleva al inicio con scroll correcto.

**Características:**
- Detecta automáticamente si ya está en inicio
- Scroll suave y optimizado con `requestAnimationFrame`
- Funciona en todas las variantes (full, icon, text)
- Accesible con teclado (Enter/Space)

### 4. `ScrollTestButton.tsx` - Componente de Prueba
Botón temporal para testing que muestra el estado actual.

## Uso

### Opción 1: Usar el Hook (Recomendado)

```tsx
import { useNavigateHome } from '../../hooks/useNavigateHome';

const MyComponent = () => {
  const { navigateToHome, isAtHome } = useNavigateHome();

  return (
    <button onClick={navigateToHome}>
      {isAtHome ? 'Scroll al inicio' : 'Ir al inicio'}
    </button>
  );
};
```

### Opción 2: Usar las Utilidades Directamente

```tsx
import { scrollToTop } from '../../utils/scrollUtils';
import { useNavigate, useLocation } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === '/') {
      scrollToTop(0); // Sin delay
    } else {
      navigate('/');
      scrollToTop(); // Con delay
    }
  };

  return <button onClick={handleClick}>Inicio</button>;
};
```

## Casos de Uso Cubiertos

1. **Usuario en página de inicio** → Scroll directo hasta arriba
2. **Usuario en otra página** → Navega al inicio + scroll hasta arriba
3. **Logo en header** → Siempre funciona correctamente
4. **Navegación programática** → Consistente en toda la app
5. **Accesibilidad** → Funciona con teclado y lectores de pantalla

## Optimizaciones Implementadas

- **`requestAnimationFrame`**: Para mejor rendimiento del scroll
- **Detección de ruta**: Evita navegación innecesaria
- **Delays inteligentes**: Sin delay cuando no hay navegación
- **Scroll suave**: Mejor experiencia de usuario

## Testing

Usa el componente `ScrollTestButton` para probar:

```tsx
import ScrollTestButton from './ScrollTestButton';

// En cualquier componente
<ScrollTestButton className="fixed bottom-4 right-4" />
```

El botón muestra:
- "Scroll ↑" cuando ya estás en inicio
- "Inicio" cuando estás en otra página

## Implementación Actual

El sistema ya está implementado en:
- ✅ `Logo.tsx` - Logo principal del header
- ✅ Todas las variantes del logo (full, icon, text)
- ✅ Navegación desde cualquier página
- ✅ Scroll optimizado con `requestAnimationFrame`

¡Ahora el logo siempre funciona correctamente, sin importar en qué página estés!