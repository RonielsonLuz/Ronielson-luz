import React, { useState, useEffect } from 'react';
import { Inspection, Observation, Photo } from '../types';
import { formatInspectionForGemini, formatObservationsForGemini, formatInspectionForHtml, formatObservationsForHtml } from '../utils/formatters';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspections: Inspection[];
  observations: Observation[];
  photos: Photo[];
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, inspections, observations, photos }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('Relatório de Inspeção de Veículos');
  const [reportText, setReportText] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const inspectionReports = inspections.map(formatInspectionForGemini).join('\n\n---\n\n');
      const observationReport = formatObservationsForGemini(observations);
      
      const fullReport = `Relatório de Inspeção de Veículos\n\n${inspectionReports}\n\n${observationReport}`;
      
      setReportText(fullReport);
      setRecipient('');
      setSubject(`Relatório de Inspeção - ${inspections[0]?.date || ''}`);
    }
  }, [isOpen, inspections, observations]);

  const generateReportHtml = async (): Promise<string> => {
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const photoPromises = photos.map(photo => fileToBase64(photo.file));
    const photoDataUrls = await Promise.all(photoPromises);

    const inspectionHtml = inspections.map(formatInspectionForHtml).join('<hr style="border: 0; border-top: 1px dashed #ccc; margin: 20px 0;">');
    const observationHtml = formatObservationsForHtml(observations);

    const photoHtml = photoDataUrls.map((dataUrl, index) => `
        <div style="margin-bottom: 20px; page-break-inside: avoid; text-align: center;">
            <img src="${dataUrl}" style="max-width: 90%; max-height: 400px; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 8px;" alt="Foto ${index + 1}" />
            <p style="margin-top: 5px; font-style: italic; color: #555;">${photos[index].description || 'Sem descrição'}</p>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Inspeção - ${inspections[0]?.date || ''}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.5; color: #333; margin: 20px; }
                h1, h2, h3, h4 { color: #1e3a8a; }
                h1 { font-size: 28px; text-align: center; margin-bottom: 20px; }
                h2 { font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 40px; }
                ul { padding-left: 20px; }
                li { margin-bottom: 8px; }
                .inspection-report, .observations-report, .photo-gallery { margin-bottom: 30px; }
                @media print {
                    body { margin: 1.5cm; }
                    h2 { margin-top: 30px; page-break-before: auto; page-break-after: avoid; }
                    .inspection-report, .observations-report, .photo-gallery div { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <h1>Checklist Diário de Veículos</h1>
            <h2>Relatório de Inspeções</h2>
            ${inspectionHtml}
            <h2>Observações e Recomendações</h2>
            ${observationHtml}
            ${photos.length > 0 ? `<h2 class="photo-gallery">Registro Fotográfico</h2>${photoHtml}` : ''}
        </body>
        </html>
    `;
  };

  const handleSendEmail = () => {
    if (recipient && !recipient.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reportText)}`;
    window.open(mailtoLink, '_blank');
    onClose();
  };

  const handleSendWhatsApp = async () => {
    const reportDate = inspections[0]?.date || 'sem-data';
    const fileName = `relatorio-inspecao-${reportDate}.html`;
    const shareTitle = `Relatório de Inspeção - ${reportDate}`;
    const shareText = `Segue o relatório de inspeção do dia ${reportDate}.`;

    if ('share' in navigator) {
      setIsSharing(true);
      try {
        const htmlContent = await generateReportHtml();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const file = new File([blob], fileName, { type: 'text/html' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: shareTitle,
            text: shareText,
          });
          onClose();
          return; 
        }
      } catch (error) {
        console.info("Compartilhamento cancelado ou erro:", error);
      } finally {
        setIsSharing(false);
      }
    }
    
    alert("Para enviar o relatório em PDF pelo WhatsApp, primeiro use o botão 'Baixar Relatório (PDF)' para salvar o arquivo em seu dispositivo. Em seguida, anexe o PDF salvo na conversa do WhatsApp.");
    window.open('https://wa.me/', '_blank');
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
        const htmlContent = await generateReportHtml();
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        } else {
            alert('O bloqueador de pop-ups pode estar impedindo a geração do relatório. Por favor, desabilite-o para este site.');
        }
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Ocorreu um erro ao gerar o relatório em PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Gerar Relatório</h2>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
             <h3 className="text-lg font-semibold text-gray-800 mb-2">Enviar por E-mail (Opcional)</h3>
             <p className="text-sm text-gray-600 mb-3">Preencha os campos abaixo para abrir seu cliente de e-mail com o relatório preenchido.</p>
             <div className="space-y-3">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Destinatário</label>
                  <input
                    type="email"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
             </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-2">
            <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf || isSharing}
                className="w-full sm:w-auto order-1 sm:order-none px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {isGeneratingPdf ? 'Gerando...' : 'Baixar Relatório (PDF)'}
            </button>
            <div className="flex w-full sm:w-auto space-x-2">
                <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                    Cancelar
                </button>
                <button 
                  onClick={handleSendEmail} 
                  disabled={isGeneratingPdf || isSharing}
                  className="flex-1 sm:flex-none px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-teal-400">
                    E-mail
                </button>
                <button 
                  onClick={handleSendWhatsApp} 
                  disabled={isGeneratingPdf || isSharing}
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
                    {isSharing ? 'Preparando...' : 'WhatsApp'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};