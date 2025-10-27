import React from 'react';
// FIX: Correctly import types from the newly created types.ts file.
import type { Inspection, CheckStatus } from '../types';
import { CHECKLIST_ITEMS } from '../constants';
import { CheckButtonGroup } from './CheckButtonGroup';

interface ChecklistRowProps {
  inspection: Inspection;
  onInspectionChange: <K extends keyof Inspection>(id: string, field: K, value: Inspection[K]) => void;
  onCheckChange: (inspectionId: string, checkId: string, value: CheckStatus) => void;
  onRemove: (id: string) => void;
}

const TableInput: React.FC<{ type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ type, value, onChange }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className="w-full p-1 border border-gray-200 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
  />
);

export const ChecklistRow: React.FC<ChecklistRowProps> = ({ inspection, onInspectionChange, onCheckChange, onRemove }) => {
  const handleChange = (field: keyof Omit<Inspection, 'id' | 'checks'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onInspectionChange(inspection.id, field, e.target.value);
  };
  
  const handleSelectChange = (checkId: string) => (value: CheckStatus) => {
      onCheckChange(inspection.id, checkId, value);
  }

  return (
    <tr className="odd:bg-white even:bg-gray-50 hover:bg-teal-50 transition-colors">
      <td className="p-1 border border-gray-300 min-w-[130px]"><TableInput type="date" value={inspection.date} onChange={handleChange('date')} /></td>
      <td className="p-1 border border-gray-300 min-w-[100px]"><TableInput type="time" value={inspection.startTime} onChange={handleChange('startTime')} /></td>
      <td className="p-1 border border-gray-300 min-w-[100px]"><TableInput type="number" value={inspection.startKm} onChange={handleChange('startKm')} /></td>
      <td className="p-1 border border-gray-300 min-w-[100px]"><TableInput type="time" value={inspection.endTime} onChange={handleChange('endTime')} /></td>
      <td className="p-1 border border-gray-300 min-w-[100px]"><TableInput type="number" value={inspection.endKm} onChange={handleChange('endKm')} /></td>
      <td className="p-1 border border-gray-300 min-w-[150px]"><TableInput type="text" value={inspection.inspector} onChange={handleChange('inspector')} /></td>
      <td className="p-1 border border-gray-300 min-w-[120px]"><TableInput type="text" value={inspection.matricula} onChange={handleChange('matricula')} /></td>
      <td className="p-1 border border-gray-300 min-w-[120px]"><TableInput type="text" value={inspection.tag} onChange={handleChange('tag')} /></td>
      {CHECKLIST_ITEMS.map(item => (
          <td key={item.id} className="p-1 border border-gray-300 text-center">
             <CheckButtonGroup value={inspection.checks[item.id]} onChange={handleSelectChange(item.id)} />
          </td>
      ))}
      <td className="p-1 border border-gray-300 text-center">
        <button
          onClick={() => onRemove(inspection.id)}
          className="text-red-500 hover:text-red-700 font-bold"
          title="Remover Inspeção"
        >
          X
        </button>
      </td>
    </tr>
  );
};