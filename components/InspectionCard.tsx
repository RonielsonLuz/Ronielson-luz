import React, { useState } from 'react';
// FIX: Correctly import types from the newly created types.ts file.
import type { Inspection, CheckStatus } from '../types';
import { CHECKLIST_ITEMS } from '../constants';
import { CheckButtonGroup } from './CheckButtonGroup';

interface InspectionCardProps {
    inspection: Inspection;
    onInspectionChange: <K extends keyof Inspection>(id: string, field: K, value: Inspection[K]) => void;
    onCheckChange: (inspectionId: string, checkId: string, value: CheckStatus) => void;
    onRemoveRow: (id: string) => void;
}

const CardInput: React.FC<{ label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, type, value, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
        />
    </div>
);

export const InspectionCard: React.FC<InspectionCardProps> = ({ inspection, onInspectionChange, onCheckChange, onRemoveRow }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleChange = (field: keyof Omit<Inspection, 'id' | 'checks'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onInspectionChange(inspection.id, field, e.target.value);
    };

    const handleSelectChange = (checkId: string) => (value: CheckStatus) => {
        onCheckChange(inspection.id, checkId, value);
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-4 w-full flex justify-between items-center text-left"
                aria-expanded={isOpen}
            >
                <div>
                    <h3 className="font-bold text-teal-700">Inspeção - {inspection.date}</h3>
                    <p className="text-sm text-gray-500">{inspection.inspector || 'Sem responsável'}</p>
                </div>
                <svg
                    className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <CardInput label="Data" type="date" value={inspection.date} onChange={handleChange('date')} />
                        <CardInput label="Responsável" type="text" value={inspection.inspector} onChange={handleChange('inspector')} />
                        <CardInput label="Hora Inicial" type="time" value={inspection.startTime} onChange={handleChange('startTime')} />
                        <CardInput label="Km Inicial" type="number" value={inspection.startKm} onChange={handleChange('startKm')} />
                        <CardInput label="Hora Final" type="time" value={inspection.endTime} onChange={handleChange('endTime')} />
                        <CardInput label="Km Final" type="number" value={inspection.endKm} onChange={handleChange('endKm')} />
                        <CardInput label="Matrícula" type="text" value={inspection.matricula} onChange={handleChange('matricula')} />
                        <CardInput label="TAG" type="text" value={inspection.tag} onChange={handleChange('tag')} />
                    </div>

                    <h4 className="font-bold text-gray-700 mb-2">Checklist</h4>
                    <div className="space-y-3">
                        {CHECKLIST_ITEMS.map(item => (
                            <div key={item.id} className="p-3 bg-slate-50 rounded-md">
                                <p className="text-sm mb-2 text-gray-800">{item.text}</p>
                                <CheckButtonGroup
                                    value={inspection.checks[item.id]}
                                    onChange={handleSelectChange(item.id)}
                                />
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 text-right">
                         <button
                            onClick={() => onRemoveRow(inspection.id)}
                            className="px-3 py-1 bg-transparent text-red-600 text-sm font-semibold rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                        >
                            Remover Inspeção
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};