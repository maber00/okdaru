// src/app/dashboard/projects/components/ProjectDeliverables.tsx
'use client';
import { useState, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/app/shared/components/ui/card';
import Button from '@/app/shared/components/ui/Button';
import { useToast } from '@/app/shared/hooks/useToast';
import { projectService } from '@/app/services/projectService';
import { 
  Plus,
  FileText,
  Paperclip,
  Calendar,
  CheckCircle,
  Clock,
  Upload,
  X
} from 'lucide-react';
import type { ProjectDeliverable } from '@/app/types/project';

interface ProjectDeliverablesProps {
  deliverables: ProjectDeliverable[];
  projectId: string;
  canEdit: boolean;
}

interface AddDeliverableModal {
  isOpen: boolean;
  name: string;
  description: string;
  dueDate: string;
  assignedTo: string;
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
};

const STATUS_ICONS = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  in_progress: <Clock className="h-5 w-5 text-blue-500" />,
  completed: <CheckCircle className="h-5 w-5 text-green-500" />
};

export function ProjectDeliverables({ 
    deliverables, 
    projectId, 
    canEdit 
  }: ProjectDeliverablesProps) {
  const { toast } = useToast() || {};
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<ProjectDeliverable | null>(null);
  const [addModal, setAddModal] = useState<AddDeliverableModal>({
    isOpen: false,
    name: '',
    description: '',
    dueDate: '',
    assignedTo: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (deliverable: ProjectDeliverable) => {
    setSelectedDeliverable(deliverable);
    fileInputRef.current?.click();
  };


  const handleAddDeliverable = async () => {
    if (!addModal.name || !addModal.description || !addModal.dueDate) {
      toast({
        message: 'Por favor completa todos los campos requeridos'
      });
      return;
    }
  
    try {
      setIsLoading(true);
      await projectService.addDeliverable(projectId, {
        name: addModal.name,
        description: addModal.description,
        status: 'pending',
        dueDate: addModal.dueDate,
        assignedTo: addModal.assignedTo,
        attachments: [],
        version: 1,  // Añadimos versión inicial
        reviewers: [],
        approvalStatus: 'pending'
      });
  
      toast({
        message: 'Entregable agregado exitosamente'
      });
      setAddModal(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error('Error adding deliverable:', error);
      toast({
        message: 'Error al agregar el entregable'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (deliverableId: string, status: ProjectDeliverable['status']) => {
    try {
      setIsLoading(true);
      await projectService.updateDeliverableStatus(
        projectId,
        deliverableId,
        status
      );

      toast({
        message: 'Estado actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        message: 'Error al actualizar el estado'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (deliverableId: string, file: File) => {
    try {
      setIsLoading(true);
      if (!file) return;
  
  
      // TODO: Implementar subida de archivo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        message: 'Archivo subido exitosamente'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        message: 'Error al subir el archivo'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Y luego en el botón de subida:
  <input
    type="file"
    hidden
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file && selectedDeliverable) {
        handleFileUpload(selectedDeliverable.id, file);
      }
    }}
    ref={fileInputRef}
  />
  
  

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Entregables</h3>
          <p className="text-sm text-gray-500">
            {deliverables.length} entregables en total
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setAddModal(prev => ({ ...prev, isOpen: true }))}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Entregable
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {deliverables.map((deliverable) => (
            <div
              key={deliverable.id}
              className="p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{deliverable.name}</h4>
                    <p className="text-sm text-gray-500">
                      Asignado a: {deliverable.assignedTo}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  STATUS_COLORS[deliverable.status]
                }`}>
                  {STATUS_ICONS[deliverable.status]}
                  <span className="ml-2">
                    {deliverable.status === 'pending' ? 'Pendiente' :
                     deliverable.status === 'in_progress' ? 'En Progreso' :
                     'Completado'}
                  </span>
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{deliverable.description}</p>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4" />
                {new Date(deliverable.dueDate).toLocaleDateString()}
              </div>

              {/* Attachments */} 
                      
                      {deliverable.attachments && deliverable.attachments.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <div className="font-medium text-sm">Archivos adjuntos:</div>
                          <div className="flex flex-wrap gap-2">
                            {deliverable.attachments.map((attachment, index) => (
                              
                              <a  key={index}
                                href={attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-sm hover:bg-gray-100"
                              >
                                <Paperclip className="h-4 w-4 text-gray-400" />
                                <span>Archivo {index + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      

              {/* Actions */}
              {canEdit && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                  <Button
  variant="outline"
  onClick={() => handleUploadClick(deliverable)}
>
  <Upload className="h-4 w-4 mr-2" />
  Subir Archivo
</Button>
                  </div>
                  <div className="flex gap-2">
                    {deliverable.status !== 'completed' && (
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(
                          deliverable.id,
                          'completed'
                        )}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar como Completado
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {deliverables.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay entregables aún
            </div>
          )}
        </div>

        {/* Add Deliverable Modal */}
        {addModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Agregar Entregable</h3>
                <button
                  onClick={() => setAddModal(prev => ({ ...prev, isOpen: false }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={addModal.name}
                    onChange={(e) => setAddModal(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={addModal.description}
                    onChange={(e) => setAddModal(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={addModal.dueDate}
                    onChange={(e) => setAddModal(prev => ({
                      ...prev,
                      dueDate: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Asignar a
                  </label>
                  <input
                    type="text"
                    value={addModal.assignedTo}
                    onChange={(e) => setAddModal(prev => ({
                      ...prev,
                      assignedTo: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setAddModal(prev => ({ ...prev, isOpen: false }))}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddDeliverable}
                    isLoading={isLoading}
                  >
                    Agregar Entregable
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        </CardContent>
    </Card>
  );
}