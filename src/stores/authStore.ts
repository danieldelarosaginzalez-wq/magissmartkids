import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// NO limpiar la sesión automáticamente - mantener la persistencia

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        // DEBUG: Verificar datos del usuario en el store
        console.log('Guardando usuario en store:', user);
        console.log('Token recibido:', token ? `${token.substring(0, 20)}...` : 'NULL');
        console.log('Institución del usuario:', user.institution);
        console.log('Grado escolar:', user.schoolGrade);

        set({ user, token, isAuthenticated: true });
        
        // Verificar que se guardó correctamente
        const state = get();
        console.log('✅ Estado después de login:', {
          hasUser: !!state.user,
          hasToken: !!state.token,
          isAuthenticated: state.isAuthenticated
        });
      },
      logout: () => {
        // Limpiar también los datos de localStorage al hacer logout
        localStorage.removeItem('auth-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);