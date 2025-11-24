// Script para verificar el rol del usuario en localStorage
const authStorage = localStorage.getItem('auth-storage');

if (authStorage) {
    const parsed = JSON.parse(authStorage);
    console.log('📦 Auth Storage completo:', parsed);
    console.log('👤 Usuario:', parsed.state?.user);
    console.log('🎭 Rol del usuario:', parsed.state?.user?.role);
    console.log('🔑 Token presente:', !!parsed.state?.token);

    if (parsed.state?.token) {
        // Decodificar el JWT (solo la parte del payload)
        const parts = parsed.state.token.split('.');
        if (parts.length === 3) {
            try {
                const payload = JSON.parse(atob(parts[1]));
                console.log('🔓 JWT Payload:', payload);
            } catch (e) {
                console.error('Error decodificando JWT:', e);
            }
        }
    }
} else {
    console.log('❌ No hay datos de autenticación en localStorage');
}
