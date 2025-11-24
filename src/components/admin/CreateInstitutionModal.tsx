import React, { useState } from 'react';
import { X, Building, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import adminApi from '../../services/adminApi';

interface CreateInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateInstitutionModal: React.FC<CreateInstitutionModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [name, setName] = useState('');
    const [nit, setNit] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!nit.trim()) {
            setError('El NIT es requerido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await adminApi.createInstitution({ name, nit, address, city });
            console.log('✅ Institución creada exitosamente');
            setName('');
            setNit('');
            setAddress('');
            setCity('');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('❌ Error creando institución:', err);
            setError(err.message || 'Error creando institución');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Building className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Nueva Institución</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la Institución *
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Colegio San José"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            NIT *
                        </label>
                        <Input
                            type="text"
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            placeholder="Ej: 900123456-7"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad *
                        </label>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">Seleccionar ciudad</option>
                            <option value="Bogotá">Bogotá</option>
                            <option value="Medellín">Medellín</option>
                            <option value="Cali">Cali</option>
                            <option value="Barranquilla">Barranquilla</option>
                            <option value="Cartagena">Cartagena</option>
                            <option value="Bucaramanga">Bucaramanga</option>
                            <option value="Pereira">Pereira</option>
                            <option value="Manizales">Manizales</option>
                            <option value="Otras">Otras</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dirección
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ej: Calle 123 #45-67"
                                disabled={loading}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            {loading ? 'Creando...' : 'Crear Institución'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
