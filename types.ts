
export enum JobType {
  CONSTRUCTION = 'Construção Civil',
  ELECTRICAL = 'Serviços em Eletricidade (NR-10)',
  HEIGHTS = 'Trabalho em Altura (NR-35)',
  CHEMICAL = 'Manipulação Química',
  WELDING = 'Soldagem e Corte',
  GENERAL = 'Manutenção Geral'
}

export interface PPEItem {
  name: string;
  status: 'present' | 'missing' | 'incorrect';
  observation: string;
}

export interface SafetyAnalysis {
  workerDetected: boolean;
  jobContext: string;
  identifiedPPE: PPEItem[];
  missingCriticalPPE: string[];
  complianceScore: number; // 0-100
  relevantNRs: string[];
  finalVerdict: 'approved' | 'restricted' | 'critical';
  recommendations: string[];
}

export interface AppState {
  currentImage: string | null;
  selectedJob: JobType;
  isAnalyzing: boolean;
  result: SafetyAnalysis | null;
  error: string | null;
}
