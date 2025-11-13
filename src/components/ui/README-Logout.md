# Sistema de Confirmación de Logout

Este sistema implementa un modal de confirmación para todos los botones de cerrar sesión en la aplicación.

## Componentes Incluidos

### 1. `LogoutConfirmModal`
Modal de confirmación que se muestra antes de cerrar sesión.

**Props:**
- `isOpen: boolean` - Controla si el modal está visible
- `onClose: () => void` - Función para cerrar el modal sin hacer logout
- `onConfirm: () => void` - Función para confirmar el logout
- `userName?: string` - Nombre del usuario para personalizar el mensaje

### 2. `useLogout` Hook
Hook personalizado que maneja la lógica del logout con confirmación.

**Retorna:**
- `showLogoutModal: boolean` - Estado del modal
- `handleLogoutClick: () => void` - Función para mostrar el modal
- `handleLogoutConfirm: () => void` - Función para confirmar logout
- `handleLogoutCancel: () => void` - Función para cancelar logout

### 3. `LogoutButton`
Componente de botón reutilizable con confirmación integrada.

**Props:**
- `variant?: 'default' | 'outline' | 'ghost'` - Estilo del botón
- `size?: 'default' | 'sm' | 'lg' | 'xs' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'` - Tamaño del botón
- `className?: string` - Clases CSS adicionales
- `showIcon?: boolean` - Mostrar icono de logout (default: true)
- `children?: React.ReactNode` - Texto personalizado del botón

## Uso

### Opción 1: Usar el Hook (Recomendado para componentes complejos)

```tsx
import { useLogout } from '../../hooks/useLogout';
import LogoutConfirmModal from './LogoutConfirmModal';
import { useAuthStore } from '../../stores/authStore';

const MyComponent = () => {
  const { user } = useAuthStore();
  const { showLogoutModal, handleLogoutClick, handleLogoutConfirm, handleLogoutCancel } = useLogout();

  return (
    <>
      <button onClick={handleLogoutClick}>
        Cerrar Sesión
      </button>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user?.firstName}
      />
    </>
  );
};
```

### Opción 2: Usar el Componente LogoutButton (Más simple)

```tsx
import LogoutButton from './LogoutButton';

const MyComponent = () => {
  return (
    <LogoutButton 
      variant="outline" 
      size="sm"
      className="my-custom-class"
    >
      Salir
    </LogoutButton>
  );
};
```

## Características

- ✅ Modal responsivo que funciona en móvil y desktop
- ✅ Confirmación con "Sí" y "No"
- ✅ Personalización del mensaje con nombre del usuario
- ✅ Cierre con ESC o click fuera del modal
- ✅ Animaciones suaves
- ✅ Accesibilidad completa
- ✅ Reutilizable en cualquier parte de la aplicación

## Implementación Actual

El sistema ya está implementado en:
- `Header.tsx` - Menú de usuario (desktop y móvil)
- Cualquier otro lugar donde se use `LogoutButton`

## Flujo de Usuario

1. Usuario hace click en "Cerrar Sesión"
2. Se muestra el modal: "¿Deseas cerrar sesión?"
3. Usuario puede elegir:
   - "No, mantener sesión" - Cierra el modal
   - "Sí, cerrar sesión" - Ejecuta logout y redirige a home
4. Si confirma, se limpia el estado de autenticación y se redirige a "/"