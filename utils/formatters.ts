import { CHECKLIST_ITEMS } from '../constants';
import type { Inspection, Observation } from '../types';

export const formatInspectionForGemini = (inspection: Inspection): string => {
    const checks = CHECKLIST_ITEMS.map(item => {
        const status = inspection.checks[item.id];
        let statusText = '';
        if (status === 'C') statusText = 'Conforme';
        if (status === 'NC') statusText = 'Não Conforme';
        if (status === 'NA') statusText = 'Não Aplicável';
        return `- ${item.text}: ${statusText}`;
    }).join('\n');

    return `
Inspeção do dia: ${inspection.date}
Responsável: ${inspection.inspector} (Matrícula: ${inspection.matricula})
TAG do Veículo: ${inspection.tag}
Horário: ${inspection.startTime} às ${inspection.endTime}
Quilometragem: ${inspection.startKm} km a ${inspection.endKm} km

Itens do Checklist:
${checks}
    `.trim();
}

export const formatObservationsForGemini = (observations: Observation[]): string => {
    if (observations.length === 0) {
        return "Nenhuma observação registrada.";
    }

    const obsText = observations.map(obs => 
        `- Data/Hora: ${new Date(obs.dateTime).toLocaleString('pt-BR')}\n  Descrição: ${obs.description}\n  Colaborador: ${obs.employee}\n  Empresa: ${obs.company}`
    ).join('\n\n');

    return `
Observações/Recomendações:
${obsText}
    `.trim();
}

const escapeHtml = (unsafe: string) => {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export const formatInspectionForHtml = (inspection: Inspection): string => {
    const checks = CHECKLIST_ITEMS.map(item => {
        const status = inspection.checks[item.id];
        let statusText = '';
        let statusColor = 'black';
        if (status === 'C') { statusText = 'Conforme'; statusColor = 'green'; }
        if (status === 'NC') { statusText = 'Não Conforme'; statusColor = 'red'; }
        if (status === 'NA') { statusText = 'Não Aplicável'; statusColor = 'orange'; }
        return `<li>${escapeHtml(item.text)}: <strong style="color: ${statusColor};">${statusText}</strong></li>`;
    }).join('');

    return `
<div class="inspection-report" style="page-break-inside: avoid;">
    <h3>Inspeção do dia: ${escapeHtml(inspection.date)}</h3>
    <ul>
        <li><strong>Responsável:</strong> ${escapeHtml(inspection.inspector)} (Matrícula: ${escapeHtml(inspection.matricula)})</li>
        <li><strong>TAG do Veículo:</strong> ${escapeHtml(inspection.tag)}</li>
        <li><strong>Horário:</strong> ${escapeHtml(inspection.startTime)} às ${escapeHtml(inspection.endTime)}</li>
        <li><strong>Quilometragem:</strong> ${escapeHtml(inspection.startKm)} km a ${escapeHtml(inspection.endKm)} km</li>
    </ul>
    <h4>Itens do Checklist:</h4>
    <ul style="list-style-type: none; padding-left: 0;">${checks}</ul>
</div>
    `.trim();
}

export const formatObservationsForHtml = (observations: Observation[]): string => {
    if (observations.length === 0) {
        return "<p>Nenhuma observação registrada.</p>";
    }

    const obsText = observations.map(obs => 
        `<li>
            <strong>Data/Hora:</strong> ${escapeHtml(new Date(obs.dateTime).toLocaleString('pt-BR'))}<br/>
            <strong>Descrição:</strong> ${escapeHtml(obs.description)}<br/>
            <strong>Colaborador:</strong> ${escapeHtml(obs.employee)}<br/>
            <strong>Empresa:</strong> ${escapeHtml(obs.company)}
        </li>`
    ).join('');

    return `
<div class="observations-report">
    <ul>${obsText}</ul>
</div>
    `.trim();
}