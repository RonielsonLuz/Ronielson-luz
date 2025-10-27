import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChecklistTable } from './components/ChecklistTable';
import { ObservationsTable } from './components/ObservationsTable';
import { PhotoUploads } from './components/PhotoUploads';
import { Footer } from './components/Footer';
import { EmailModal } from './components/EmailModal';
import { HistoryView } from './components/HistoryView';
import type { Inspection, Observation, Photo, CheckStatus } from './types';
import { CHECKLIST_ITEMS } from './constants';

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

function App() {
  const createNewInspection = (): Inspection => {
    const defaultChecks = CHECKLIST_ITEMS.reduce((acc, item) => {
      acc[item.id] = 'C';
      return acc;
    }, {} as { [key: string]: CheckStatus });

    return {
      id: generateId('insp'),
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      startKm: '',
      endTime: '',
      endKm: '',
      inspector: '',
      matricula: '',
      tag: '',
      checks: defaultChecks,
    };
  };

  const [inspections, setInspections] = useState<Inspection[]>([createNewInspection()]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'checklist' | 'history'>('checklist');


  // Inspection Handlers
  const handleAddInspection = () => {
    setInspections(prev => [...prev, createNewInspection()]);
  };

  const handleRemoveInspection = (id: string) => {
    setInspections(prev => prev.filter(item => item.id !== id));
  };

  const handleInspectionChange = <K extends keyof Inspection>(id: string, field: K, value: Inspection[K]) => {
    setInspections(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleCheckChange = (inspectionId: string, checkId: string, value: CheckStatus) => {
    setInspections(prev => prev.map(insp => {
      if (insp.id === inspectionId) {
        return { ...insp, checks: { ...insp.checks, [checkId]: value } };
      }
      return insp;
    }));
  };

  // Observation Handlers
  const handleAddObservation = () => {
    setObservations(prev => [...prev, {
      id: generateId('obs'),
      dateTime: new Date().toISOString().slice(0, 16),
      description: '',
      company: '',
      employee: '',
    }]);
  };
  
  const handleRemoveObservation = (id: string) => {
    setObservations(prev => prev.filter(item => item.id !== id));
  };

  const handleObservationChange = <K extends keyof Observation>(id: string, field: K, value: Observation[K]) => {
    setObservations(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Photo Handlers
  const handleAddPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (id: string) => {
    const photoToRemove = photos.find(p => p.id === id);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.preview);
    }
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };
  
  const handlePhotoDescriptionChange = (id: string, description: string) => {
      setPhotos(prev => prev.map(photo => photo.id === id ? { ...photo, description } : photo));
  }
  
  const renderChecklistView = () => (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Inspeções do Veículo</h2>
        <ChecklistTable
          inspections={inspections}
          onInspectionChange={handleInspectionChange}
          onCheckChange={handleCheckChange}
          onAddRow={handleAddInspection}
          onRemoveRow={handleRemoveInspection}
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Observações e Recomendações de Segurança</h2>
        <ObservationsTable
          observations={observations}
          onObservationChange={handleObservationChange}
          onAddRow={handleAddObservation}
          onRemoveRow={handleRemoveObservation}
        />
      </div>

      <PhotoUploads 
        photos={photos}
        onAddPhoto={handleAddPhotos}
        onRemovePhoto={handleRemovePhoto}
        onPhotoDescriptionChange={handlePhotoDescriptionChange}
      />
    </>
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <Header />

        <main>
          <div className="flex items-center justify-between mb-6">
            <div className="flex border-b border-gray-300">
                <button 
                  onClick={() => setCurrentView('checklist')}
                  className={`py-2 px-4 text-sm font-medium ${currentView === 'checklist' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Inspeção Atual
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`py-2 px-4 text-sm font-medium ${currentView === 'history' ? 'border-b-2 border-teal-600 text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Histórico
                </button>
            </div>
             {currentView === 'checklist' && (
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                Gerar Check list
              </button>
            )}
          </div>
          
          {currentView === 'checklist' ? renderChecklistView() : <HistoryView />}

        </main>

        <Footer />
      </div>

      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        inspections={inspections}
        observations={observations}
        photos={photos}
      />
    </div>
  );
}

export default App;