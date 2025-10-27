import React from 'react';
// FIX: Correctly import types from the newly created types.ts file.
import type { CheckStatus } from '../types';

interface CheckButtonGroupProps {
    value: CheckStatus;
    onChange: (value: CheckStatus) => void;
}

const buttonConfig = {
    'C': { label: 'C', styles: 'bg-green-500 border-green-500 text-white' },
    'NC': { label: 'NC', styles: 'bg-red-500 border-red-500 text-white' },
    'NA': { label: 'NA', styles: 'bg-amber-500 border-amber-500 text-white' },
};

const defaultStyles = 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700';

export const CheckButtonGroup: React.FC<CheckButtonGroupProps> = ({ value, onChange }) => {
    return (
        <div className="inline-flex rounded-md" role="group">
            {(['C', 'NC', 'NA'] as CheckStatus[]).map((status, index) => (
                <button
                    key={status}
                    type="button"
                    onClick={() => onChange(status)}
                    className={`
                        px-3 py-1 text-xs font-bold border transition-colors
                        ${index === 0 ? 'rounded-l-md' : ''}
                        ${index === 2 ? 'rounded-r-md' : ''}
                        ${value === status ? buttonConfig[status].styles : defaultStyles}
                    `}
                >
                    {buttonConfig[status].label}
                </button>
            ))}
        </div>
    );
};
