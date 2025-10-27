import React from 'react';
// FIX: Correctly import types from the newly created types.ts file.
import type { Observation } from '../types';

interface ObservationsTableProps {
  observations: Observation[];
  onObservationChange: <K extends keyof Observation>(id: string, field: K, value: Observation[K]) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const TableInput: React.FC<{ type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, value, onChange }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
  />
);


export const ObservationsTable: React.FC<ObservationsTableProps> = ({ observations, onObservationChange, onAddRow, onRemoveRow }) => {
  const handleChange = (id: string, field: keyof Omit<Observation, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onObservationChange(id, field, e.target.value);
  };
    
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Data e horário</th>
              <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Descrição da observação/recomendação</th>
              <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Empresa</th>
              <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Matrícula e nome</th>
              <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs) => (
              <tr key={obs.id} className="odd:bg-white even:bg-gray-50 hover:bg-teal-50 transition-colors">
                <td className="p-1 border border-gray-300 w-1/6 min-w-[180px]"><TableInput type="datetime-local" value={obs.dateTime} onChange={handleChange(obs.id, 'dateTime')} /></td>
                <td className="p-1 border border-gray-300 w-3/6 min-w-[300px]"><TableInput type="text" value={obs.description} onChange={handleChange(obs.id, 'description')} /></td>
                <td className="p-1 border border-gray-300 w-1/6 min-w-[150px]"><TableInput type="text" value={obs.company} onChange={handleChange(obs.id, 'company')} /></td>
                <td className="p-1 border border-gray-300 w-1/6 min-w-[150px]"><TableInput type="text" value={obs.employee} onChange={handleChange(obs.id, 'employee')} /></td>
                <td className="p-1 border border-gray-300 text-center">
                  <button
                      onClick={() => onRemoveRow(obs.id)}
                      className="text-red-500 hover:text-red-700 font-bold"
                      title="Remover Observação"
                  >
                      X
                  </button>
                </td>
              </tr>
            ))}
            {observations.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">Nenhuma observação adicionada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={onAddRow}
        className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
      >
        Adicionar Observação
      </button>
    </div>
  );
};
