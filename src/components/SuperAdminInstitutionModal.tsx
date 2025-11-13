import React, { useState } from 'react';
import { X, Building, MapPin, Phone, Mail, Hash } from 'lucide-react';
import { Button, Input, Label } from './ui';

interface SuperAdminInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstitutionCreated: (institution: any) => void;
}

interface InstitutionFormData {
  name: string;
  nit: string;
  address: string;
  phone: string;
  email: string;
}

const SuperAdminInstitutionModal: React.FC<SuperAdminInstitutionModalProps> = ({
  isOpen,
  onClose,
  onInstitutionCreated
}) => {
  const [formData, setFormData] = useState<InstitutionFormData>({
    name: '',
    nit: '',
    address: '',
    phone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validación básica
    if (!formData.name.trim()) {
      setError('El nombre de la institución es requerido');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🏛️ Creando nueva institución por super admin:', formData);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/super-admin/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          nit: formData.nit.trim() || null,
          address: formData.address.trim() || null,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null
        }),
      });

      console.log('📡 Status de respuesta POST:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error HTTP:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Respuesta del servidor:', data);

      if (data.success && data.institution) {
        console.log('✅ Institución creada exitosamente:', data.institution);

        // Notificar al componente padre
        onInstitutionCreated(data.institution);

        // Limpiar formulario y cerrar modal
        setFormData({ name: '', nit: '', address: '', phone: '', email: '' });
        onClose();
      } else {
        console.error('❌ Error en la respuesta:', data);
        setError(data.message || 'Error al crear la institución');
      }
    } catch (error: any) {
      console.error('❌ Error creando institución:', error);
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', nit: '', address: '', phone: '', email: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Nueva Institución</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre de la institución */}
            <div>
              <Label htmlFor="name">Nombre de la Institución *</Label>
              <div className="relative mt-1">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Colegio San Martín"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* NIT */}
            <div>
              <Label htmlFor="nit">NIT (Número de Identificación Tributaria)</Label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="nit"
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  placeholder="Ej: 901234567-1"
                  className="pl-10"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <Label htmlFor="address">Dirección</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ej: Calle 123 #45-67"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 3001234567"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: info@colegio.edu.co"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creando...
                  </div>
                ) : (
                  'Crear Institución'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminInstitutionModal;
