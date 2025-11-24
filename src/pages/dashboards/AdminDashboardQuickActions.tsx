import React, { useState } from 'react';
import { Plus, Users, BarChart3, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { CreateInstitutionModal } from '../../components/admin/CreateInstitutionModal';
import { ManageUsersModal } from '../../components/admin/ManageUsersModal';
import { ReportsModal } from '../../components/admin/ReportsModal';
import { MonitoringModal } from '../../components/admin/MonitoringModal';

interface QuickActionsProps {
    onSuccess?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSuccess }) => {
    const [showCreateInstitution, setShowCreateInstitution] = useState(false);
    const [showManageUsers, setShowManageUsers] = useState(false);
    const [showReports, setShowReports] = useState(false);
    const [showMonitoring, setShowMonitoring] = useState(false);

    const handleSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Acciones Rápidas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            className="h-20 flex flex-col items-center gap-2"
                            variant="outline"
                            onClick={() => setShowCreateInstitution(true)}
                        >
                            <Plus className="w-6 h-6" />
                            <span className="text-sm">Nueva Institución</span>
                        </Button>
                        <Button
                            className="h-20 flex flex-col items-center gap-2"
                            variant="outline"
                            onClick={() => setShowManageUsers(true)}
                        >
                            <Users className="w-6 h-6" />
                            <span className="text-sm">Gestionar Usuarios</span>
                        </Button>
                        <Button
                            className="h-20 flex flex-col items-center gap-2"
                            variant="outline"
                            onClick={() => setShowReports(true)}
                        >
                            <BarChart3 className="w-6 h-6" />
                            <span className="text-sm">Ver Reportes</span>
                        </Button>
                        <Button
                            className="h-20 flex flex-col items-center gap-2"
                            variant="outline"
                            onClick={() => setShowMonitoring(true)}
                        >
                            <Shield className="w-6 h-6" />
                            <span className="text-sm">Monitoreo</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modales */}
            <CreateInstitutionModal
                isOpen={showCreateInstitution}
                onClose={() => setShowCreateInstitution(false)}
                onSuccess={handleSuccess}
            />
            <ManageUsersModal
                isOpen={showManageUsers}
                onClose={() => setShowManageUsers(false)}
                onSuccess={handleSuccess}
            />
            <ReportsModal
                isOpen={showReports}
                onClose={() => setShowReports(false)}
            />
            <MonitoringModal
                isOpen={showMonitoring}
                onClose={() => setShowMonitoring(false)}
            />
        </>
    );
};
