import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Photo } from '../types';

interface PhotoUploadsProps {
  photos: Photo[];
  onAddPhoto: (newPhotos: Photo[]) => void;
  onRemovePhoto: (id: string) => void;
  onPhotoDescriptionChange: (id: string, description: string) => void;
}

export const PhotoUploads: React.FC<PhotoUploadsProps> = ({ photos, onAddPhoto, onRemovePhoto, onPhotoDescriptionChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos: Photo[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
      description: '',
    }));
    onAddPhoto(newPhotos);
  }, [onAddPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
    }
  });
  
  const handleRemove = (id: string) => {
    onRemovePhoto(id);
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registro Fotográfico</h2>
      <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-teal-600 bg-teal-50' : 'border-gray-300 hover:border-teal-500'}`}>
        <input {...getInputProps()} />
        <p className="text-gray-500">Arraste e solte as fotos aqui, ou clique para selecionar.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="border rounded-lg p-2 shadow-sm bg-white relative">
            <img src={photo.preview} alt="Pré-visualização" className="w-full h-40 object-cover rounded-md mb-2" />
            <textarea
              value={photo.description}
              onChange={(e) => onPhotoDescriptionChange(photo.id, e.target.value)}
              placeholder="Adicionar descrição..."
              className="w-full p-1 border border-gray-200 rounded-md text-xs focus:ring-teal-500 focus:border-teal-500"
              rows={2}
            />
            <button
              onClick={() => handleRemove(photo.id)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
              title="Remover foto"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
