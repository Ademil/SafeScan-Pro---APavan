
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg border-b-4 border-amber-500">
      <div className="flex items-center gap-3">
        <div className="bg-amber-500 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">SafeScan Pro - APavan</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Inspeção de Segurança Industrial</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
