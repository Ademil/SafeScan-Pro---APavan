
import React from 'react';
import { SafetyAnalysis } from '../types';

interface Props {
  analysis: SafetyAnalysis;
  image: string | null;
}

const AnalysisResult: React.FC<Props> = ({ analysis, image }) => {
  const now = new Date().toLocaleString('pt-BR');
  const reportId = Math.random().toString(36).substring(7).toUpperCase();

  const getVerdictDetails = () => {
    switch (analysis.finalVerdict) {
      case 'approved': return { label: 'CONFORME', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-500' };
      case 'restricted': return { label: 'CONFORMIDADE PARCIAL', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-500' };
      case 'critical': return { label: 'NÃO CONFORME - RISCO CRÍTICO', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-500' };
      default: return { label: 'PENDENTE', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-500' };
    }
  };

  const verdict = getVerdictDetails();

  if (!analysis.workerDetected) {
    return (
      <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl text-center no-print">
        <h3 className="text-red-900 font-bold text-lg">Trabalhador não detectado</h3>
        <p className="text-red-700 text-sm mt-1">A IA não conseguiu identificar um colaborador na imagem para realizar a auditoria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-0">
      {/* Visual no App */}
      <div className="no-print space-y-4">
        <div className={`p-4 rounded-xl border-l-4 ${verdict.border} ${verdict.bg}`}>
          <p className={`text-xs font-bold uppercase ${verdict.color}`}>Status da Inspeção</p>
          <p className={`text-xl font-black ${verdict.color}`}>{verdict.label}</p>
        </div>
      </div>

      {/* Estrutura do Laudo (Visível no PDF / Print) */}
      <div id="pdf-report" className="hidden print:block bg-white p-8 font-serif leading-relaxed text-slate-900" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
        
        {/* Cabeçalho Técnico */}
        <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">SafeScan Pro - APavan</h1>
            <p className="text-xs font-bold text-slate-500 uppercase">Sistema de Auditoria de Segurança do Trabalho - IA</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400">LAUDO TÉCNICO Nº {reportId}</p>
            <p className="text-xs font-bold">{now}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Seção 1: Resumo Executivo */}
          <div className="break-inside-avoid">
            <h2 className="text-sm font-bold bg-slate-100 px-2 py-1 mb-3 border-l-4 border-slate-800">1. IDENTIFICAÇÃO E RESUMO</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border p-2">
                <p className="text-slate-400 uppercase font-bold text-[9px]">Atividade Analisada</p>
                <p className="font-bold">{analysis.jobContext}</p>
              </div>
              <div className="border p-2">
                <p className="text-slate-400 uppercase font-bold text-[9px]">Score de Conformidade</p>
                <p className={`font-black text-lg ${analysis.complianceScore >= 90 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.complianceScore}%
                </p>
              </div>
              <div className={`col-span-2 border-2 p-3 text-center ${verdict.bg} ${verdict.border}`}>
                <p className="text-[10px] font-bold uppercase opacity-60">Parecer Técnico Final</p>
                <p className={`text-xl font-black ${verdict.color}`}>{verdict.label}</p>
              </div>
            </div>
          </div>

          {/* Seção 2: Evidência Fotográfica */}
          <div className="break-inside-avoid">
            <h2 className="text-sm font-bold bg-slate-100 px-2 py-1 mb-3 border-l-4 border-slate-800">2. EVIDÊNCIA FOTOGRÁFICA</h2>
            {image && (
              <div className="border-2 border-slate-200 p-1 rounded">
                <img src={image} className="w-full h-auto max-h-[80mm] object-contain mx-auto" alt="Evidência" />
                <p className="text-[9px] text-center mt-1 text-slate-400 italic">Registro capturado via SafeScan Pro - APavan em tempo real.</p>
              </div>
            )}
          </div>

          {/* Seção 3: Auditoria de EPIs */}
          <div className="break-inside-avoid">
            <h2 className="text-sm font-bold bg-slate-100 px-2 py-1 mb-3 border-l-4 border-slate-800">3. CHECKLIST DE CONFORMIDADE (NR-06)</h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="border p-2 text-left">Item / Equipamento</th>
                  <th className="border p-2 text-center w-24">Status</th>
                  <th className="border p-2 text-left">Observação Técnica</th>
                </tr>
              </thead>
              <tbody>
                {analysis.identifiedPPE.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="border p-2 font-bold">{item.name}</td>
                    <td className={`border p-2 text-center font-bold ${
                      item.status === 'present' ? 'text-green-600' : 
                      item.status === 'missing' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {item.status === 'present' ? 'CONFORME' : 
                       item.status === 'missing' ? 'FALTANTE' : 'IRREGULAR'}
                    </td>
                    <td className="border p-2 text-slate-600 italic">{item.observation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Seção 4: Embasamento Legal e Recomendações */}
          <div className="break-inside-avoid pt-4">
            <h2 className="text-sm font-bold bg-slate-100 px-2 py-1 mb-3 border-l-4 border-slate-800">4. EMBASAMENTO E RECOMENDAÇÕES</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Normas Aplicáveis</h3>
                <div className="flex flex-wrap gap-1">
                  {analysis.relevantNRs.map((nr, i) => (
                    <span key={i} className="bg-slate-200 px-2 py-1 rounded text-[9px] font-bold">{nr}</span>
                  ))}
                </div>
              </div>
              <div className="border p-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Orientações de Segurança</h3>
                <ul className="text-[10px] list-disc pl-4 space-y-1">
                  {analysis.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Rodapé e Assinaturas */}
          <div className="pt-12 break-inside-avoid">
            <div className="flex justify-between items-start gap-12">
              <div className="flex-1 border-t-2 border-slate-900 pt-2 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-900">Ademilton Pavan</p>
                <p className="text-[9px] font-bold text-slate-600 uppercase">CREA-SC 86959-8</p>
                <p className="text-[8px] text-slate-400 mt-1 italic">Responsável Técnico</p>
              </div>
              <div className="flex-1 border-t-2 border-slate-900 pt-2 text-center">
                <p className="text-[9px] font-bold uppercase">Trabalhador Inspecionado</p>
                <p className="text-[8px] text-slate-400 mt-1 italic">Ciente das condições e normas</p>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 text-[8px] text-slate-400 flex justify-between">
              <span>GERADO AUTOMATICAMENTE POR SAFESCAN PRO - APAVAN</span>
              <span>PÁGINA 1 DE 1</span>
              <span>{now} - ID: {reportId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
