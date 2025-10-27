import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 mb-8 rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-teal-800">Checklist Diário de Veículos</h1>
        </div>
      </div>
    </header>
  );
};
