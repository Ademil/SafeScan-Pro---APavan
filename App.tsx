
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import WorkSelector from './components/WorkSelector';
import AnalysisResult from './components/AnalysisResult';
import { JobType, AppState } from './types';
import { analyzeSafety } from './services/geminiService';

declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentImage: null,
    selectedJob: JobType.CONSTRUCTION,
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          currentImage: reader.result as string,
          result: null,
          error: null 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!state.currentImage) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const result = await analyzeSafety(state.currentImage, state.selectedJob);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-report');
    if (!element) return;

    const btn = document.getElementById('export-btn');
    if (btn) btn.innerHTML = "Processando Laudo...";

    const options = {
      margin: 0,
      filename: `Laudo_Seguranca_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Remove hidden temporary to capture
    element.classList.remove('hidden');

    window.html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        element.classList.add('hidden');
        if (btn) btn.innerHTML = "Exportar Laudo PDF";
      })
      .catch((err: any) => {
        console.error("Erro PDF:", err);
        element.classList.add('hidden');
        if (btn) btn.innerHTML = "Exportar Laudo PDF";
      });
  };

  const reset = () => {
    setState({
      currentImage: null,
      selectedJob: JobType.CONSTRUCTION,
      isAnalyzing: false,
      result: null,
      error: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-slate-100 shadow-2xl relative">
      
      <div className="no-print">
        <Header />
      </div>

      <main className="flex-grow p-4 space-y-6 pb-32 no-print">
        {/* Step 1: Configuração */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <WorkSelector 
            value={state.selectedJob} 
            onChange={(val) => setState(prev => ({ ...prev, selectedJob: val }))}
            disabled={state.isAnalyzing}
          />
        </div>

        {/* Step 2: Imagem */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          {!state.currentImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-amber-50 hover:border-amber-300 transition-all"
            >
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeWidth="2" />
              </svg>
              <p className="text-xs font-bold text-slate-400 uppercase">Toque para registrar foto</p>
              <input type="file" ref={fileInputRef} onChange={handleCapture} accept="image/*" capture="environment" className="hidden" />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden shadow-inner">
              <img src={state.currentImage} className="w-full h-48 object-cover" alt="Preview" />
              <button onClick={() => setState(prev => ({...prev, currentImage: null}))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" /></svg>
              </button>
            </div>
          )}
        </div>

        {state.error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-xl text-xs font-bold border border-red-200">
            ERRO: {state.error}
          </div>
        )}

        {state.result && <AnalysisResult analysis={state.result} image={state.currentImage} />}
      </main>

      {/* O PDF que fica escondido mas é usado na geração */}
      {state.result && <AnalysisResult analysis={state.result} image={state.currentImage} />}

      {/* Footer Mobile */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-4 bg-white/80 backdrop-blur border-t z-50 no-print">
        <div className="flex gap-2">
          {!state.result ? (
            <button
              onClick={runAnalysis}
              disabled={!state.currentImage || state.isAnalyzing}
              className={`flex-grow h-14 rounded-xl font-black uppercase tracking-tight text-sm shadow-lg flex items-center justify-center gap-2 ${
                !state.currentImage || state.isAnalyzing ? 'bg-slate-200 text-slate-400' : 'bg-amber-500 text-slate-900 active:scale-95 transition-all'
              }`}
            >
              {state.isAnalyzing ? "Processando IA..." : "Auditar Segurança"}
            </button>
          ) : (
            <>
              <button
                id="export-btn"
                onClick={handleExportPDF}
                className="flex-grow h-14 bg-slate-900 text-white rounded-xl font-black uppercase text-sm shadow-lg flex items-center justify-center gap-2"
              >
                Exportar Laudo PDF
              </button>
              <button onClick={reset} className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" /></svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
