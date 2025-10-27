import React from 'react';
// FIX: Correctly import types from the newly created types.ts file.
import type { Inspection, CheckStatus } from '../types';
import { CHECKLIST_ITEMS } from '../constants';
import { ChecklistRow } from './ChecklistRow';
import { InspectionCard } from './InspectionCard';

interface ChecklistTableProps {
  inspections: Inspection[];
  onInspectionChange: <K extends keyof Inspection>(id: string, field: K, value: Inspection[K]) => void;
  onCheckChange: (inspectionId: string, checkId: string, value: CheckStatus) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({ inspections, onInspectionChange, onCheckChange, onAddRow, onRemoveRow }) => {
  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {inspections.map((inspection) => (
          <InspectionCard 
            key={inspection.id}
            inspection={inspection}
            onInspectionChange={onInspectionChange}
            onCheckChange={onCheckChange}
            onRemoveRow={onRemoveRow}
          />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full border-collapse bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Data</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Hora Inicial</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Km Inicial</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Hora Final</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Km Final</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Responsável</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">Matrícula</th>
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-left">TAG</th>
                {CHECKLIST_ITEMS.map((item, index) => (
                  <th 
                    key={item.id} 
                    className="p-2 border border-gray-300 text-sm font-semibold text-gray-600 text-center w-12"
                    title={item.text}
                  >
                    {index + 1}
                  </th>
                ))}
                <th className="p-2 border border-gray-300 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection) => (
                <ChecklistRow 
                  key={inspection.id}
                  inspection={inspection}
                  onInspectionChange={onInspectionChange}
                  onCheckChange={onCheckChange}
                  onRemove={onRemoveRow}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4">
            <details className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-teal-700 select-none">
                    Ver Legenda dos Itens do Checklist
                </summary>
                <ol className="list-decimal list-inside mt-3 pt-3 border-t text-sm text-gray-700 space-y-2">
                    {CHECKLIST_ITEMS.map((item, index) => (
                        <li key={item.id}><span className="font-bold">{index + 1}.</span> {item.text}</li>
                    ))}
                </ol>
            </details>
        </div>
      </div>

      <button
        onClick={onAddRow}
        className="mt-4 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
      >
        Adicionar Inspeção
      </button>
    </>
  );
};