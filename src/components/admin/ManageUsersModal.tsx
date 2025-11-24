import React, { useState, useEffect } from 'react';
import { X, Users, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import adminApi from '../../services/adminApi';
import { translateRole } from '../../utils/roleTranslations';

interface ManageUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: { value: string };
    isActive: boolean;
    institution?: { name: string };
}

export const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getUsers();
            setUsers(response.users || []);
        } catch (err: any) {
            console.error('❌ Error loading users:', err);
            setError('Error cargando usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (userId: number, currentStatus: boolean) => {
        try {
            await adminApi.updateUser(userId, { isActive: !currentStatus });
            console.log('✅ Usuario actualizado');
            loadUsers();
            onSuccess();
        } catch (err: any) {
            console.error('❌ Error updating user:', err);
            setError('Error actualizando usuario');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            await adminApi.deleteUser(userId);
            console.log('✅ Usuario eliminado');
            loadUsers();
            onSuccess();
        } catch (err: any) {
            console.error('❌ Error deleting user:', err);
            setError('Error eliminando usuario');
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName} ${user.email}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Gestionar Usuarios</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar usuarios..."
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No se encontraron usuarios</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user.firstName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                            {user.institution && (
                                                <div className="text-xs text-gray-500">{user.institution.name}</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                user.role.value === 'student' ? 'default' :
                                                    user.role.value === 'teacher' ? 'success' :
                                                        user.role.value === 'coordinator' ? 'warning' :
                                                            'secondary'
                                            }>
                                                {translateRole(user.role.value)}
                                            </Badge>
                                            <Badge variant={user.isActive ? 'success' : 'secondary'}>
                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleToggleActive(user.id, user.isActive)}
                                            title={user.isActive ? 'Desactivar' : 'Activar'}
                                        >
                                            {user.isActive ? (
                                                <UserX className="w-4 h-4" />
                                            ) : (
                                                <UserCheck className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full"
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </div>
    );
};
