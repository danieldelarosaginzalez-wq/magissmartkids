import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Mail, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/authStore';

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const systemSettings = {
    siteName: 'Altius Academy',
    siteDescription: 'Plataforma educativa de refuerzo académico',
    adminEmail: 'admin@altiusacademy.com',
    supportEmail: 'soporte@altiusacademy.com',
    maxFileSize: '10MB',
    sessionTimeout: '30 minutos',
    backupFrequency: 'Diario',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: false
  };

  const notificationSettings = {
    emailNotifications: true,
    assignmentReminders: true,
    gradeNotifications: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyReports: true
  };

  const securitySettings = {
    twoFactorAuth: false,
    passwordExpiry: '90 días',
    maxLoginAttempts: 5,
    sessionSecurity: 'Alta',
    dataEncryption: 'AES-256',
    auditLogging: true
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración ⚙️</h1>
          <p className="text-gray-600 mt-1">
            Gestiona la configuración del sistema y tu perfil
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>Backup del Sistema</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <SettingsIcon className="w-4 h-4" />
            <span>Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Apariencia</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Integraciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Información Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombres
                  </label>
                  <Input defaultValue={user?.firstName} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellidos
                  </label>
                  <Input defaultValue={user?.lastName} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" defaultValue={user?.email} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <Input placeholder="300-123-4567" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía
                </label>
                <Textarea placeholder="Cuéntanos sobre ti..." rows={3} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol Actual
                </label>
                <Badge variant="secondary" className="capitalize">
                  {user?.role}
                </Badge>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button>Guardar Cambios</Button>
                <Button variant="outline">Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <span>Preferencias de Notificaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
                    <p className="text-sm text-gray-600">Recibe notificaciones importantes por correo</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={notificationSettings.emailNotifications}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Recordatorios de Tareas</h4>
                    <p className="text-sm text-gray-600">Alertas sobre fechas límite de entregas</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={notificationSettings.assignmentReminders}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Notificaciones de Notas</h4>
                    <p className="text-sm text-gray-600">Cuando se publiquen nuevas calificaciones</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={notificationSettings.gradeNotifications}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Actualizaciones del Sistema</h4>
                    <p className="text-sm text-gray-600">Información sobre nuevas funcionalidades</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={notificationSettings.systemUpdates}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Reportes Semanales</h4>
                    <p className="text-sm text-gray-600">Resumen semanal de actividad</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={notificationSettings.weeklyReports}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button>Guardar Preferencias</Button>
                <Button variant="outline">Restaurar Predeterminadas</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span>Configuración de Seguridad</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Autenticación de Dos Factores</h4>
                    <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={securitySettings.twoFactorAuth ? 'success' : 'secondary'}>
                      {securitySettings.twoFactorAuth ? 'Activado' : 'Desactivado'}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {securitySettings.twoFactorAuth ? 'Desactivar' : 'Activar'}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Expiración de Contraseña</h4>
                    <p className="text-sm text-gray-600">Frecuencia de cambio obligatorio</p>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="60">60 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="never">Nunca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Intentos de Login</h4>
                    <p className="text-sm text-gray-600">Máximo antes de bloquear cuenta</p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Registro de Auditoría</h4>
                    <p className="text-sm text-gray-600">Registrar todas las acciones del sistema</p>
                  </div>
                  <Badge variant={securitySettings.auditLogging ? 'success' : 'secondary'}>
                    {securitySettings.auditLogging ? 'Activado' : 'Desactivado'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button>Aplicar Cambios</Button>
                <Button variant="outline">Ver Logs de Seguridad</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5 text-purple-600" />
                <span>Configuración del Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Sitio
                  </label>
                  <Input defaultValue={systemSettings.siteName} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email del Administrador
                  </label>
                  <Input type="email" defaultValue={systemSettings.adminEmail} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción del Sitio
                </label>
                <Textarea defaultValue={systemSettings.siteDescription} rows={2} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamaño Máximo de Archivo
                  </label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="25">25 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo de Sesión
                  </label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Modo Mantenimiento</h4>
                    <p className="text-sm text-gray-600">Desactivar acceso público temporalmente</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={systemSettings.maintenanceMode}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Registro Abierto</h4>
                    <p className="text-sm text-gray-600">Permitir registro de nuevos usuarios</p>
                  </div>
                  <input 
                    type="checkbox" 
                    defaultChecked={systemSettings.registrationEnabled}
                    className="rounded border-gray-300 text-blue-600"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button>Guardar Configuración</Button>
                <Button variant="outline">Restaurar Predeterminados</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-pink-600" />
                <span>Personalización de Apariencia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tema del Sistema
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
                    <div className="w-full h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Azul (Actual)</p>
                  </div>
                  <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-br from-green-500 to-green-600 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Verde</p>
                  </div>
                  <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded mb-2"></div>
                    <p className="text-sm font-medium text-center">Morado</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de la Institución
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <SettingsIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Subir Logo</Button>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG hasta 2MB</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colores Personalizados
                </label>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Primario</label>
                    <input type="color" defaultValue="#3B82F6" className="w-full h-10 rounded border" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Secundario</label>
                    <input type="color" defaultValue="#10B981" className="w-full h-10 rounded border" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Éxito</label>
                    <input type="color" defaultValue="#059669" className="w-full h-10 rounded border" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Alerta</label>
                    <input type="color" defaultValue="#F59E0B" className="w-full h-10 rounded border" />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button>Aplicar Cambios</Button>
                <Button variant="outline">Vista Previa</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-green-600" />
                <span>Integraciones Externas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Servicio de Email</h4>
                      <p className="text-sm text-gray-600">SMTP para envío de notificaciones</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">Conectado</Badge>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Backup Automático</h4>
                      <p className="text-sm text-gray-600">Respaldo diario en la nube</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">Activo</Badge>
                    <Button size="sm" variant="outline">Configurar</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <SettingsIcon className="w-8 h-8 text-orange-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">API Externa</h4>
                      <p className="text-sm text-gray-600">Integración con sistemas externos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Desconectado</Badge>
                    <Button size="sm" variant="outline">Conectar</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button>Probar Conexiones</Button>
                <Button variant="outline">Ver Logs</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;