
import { JobType } from './types';

export const JOB_REQUIREMENTS: Record<JobType, string> = {
  [JobType.CONSTRUCTION]: "Capacete de segurança, botas com biqueira, colete refletivo, luvas de proteção, protetor auricular.",
  [JobType.ELECTRICAL]: "EPIs dielétricos (não condutivos), capacete classe B, vestimenta retardante de chama (classe de risco 2), luvas isolantes, botas sem metais.",
  [JobType.HEIGHTS]: "Cinturão de segurança tipo paraquedista, talabarte, capacete com jugular, botas antiderrapantes, luvas.",
  [JobType.CHEMICAL]: "Avental impermeável, luvas de nitrilo ou neoprene, máscara com filtro químico, óculos de ampla visão (goggles), botas impermeáveis.",
  [JobType.WELDING]: "Máscara de solda (escurecimento automático), avental de raspa, luvas de cano longo (raspa), perneiras, bota de segurança, protetor auricular.",
  [JobType.GENERAL]: "Óculos de proteção, luvas de vaqueta, botas de segurança, uniforme padrão."
};

export const ANALYSIS_SYSTEM_INSTRUCTION = `
Você é um Engenheiro de Segurança do Trabalho especialista em Normas Regulamentadoras (NRs).
Sua tarefa é analisar uma foto de um trabalhador em um contexto específico e verificar a conformidade dos EPIs (Equipamentos de Proteção Individual).

REGRAS DE ANÁLISE:
1. Identifique se existe um ser humano/trabalhador na foto.
2. Com base no CONTEXTO DE TRABALHO fornecido, identifique quais EPIs estão sendo usados.
3. Compare com os requisitos da NR correspondente (ex: NR-6 para EPIs gerais, NR-35 para Altura, NR-10 para Elétrica).
4. Verifique se o EPI está posicionado corretamente (ex: capacete sem jugular em altura é incorreto).
5. Forneça uma pontuação de conformidade de 0 a 100.
6. Determine o veredito: 'approved' (tudo certo), 'restricted' (faltam itens não críticos ou uso levemente incorreto), 'critical' (risco iminente de acidente grave).

RESPOSTA:
Você DEVE responder APENAS em JSON seguindo a estrutura:
{
  "workerDetected": boolean,
  "jobContext": string,
  "identifiedPPE": [{"name": string, "status": "present"|"missing"|"incorrect", "observation": string}],
  "missingCriticalPPE": [string],
  "complianceScore": number,
  "relevantNRs": [string],
  "finalVerdict": "approved"|"restricted"|"critical",
  "recommendations": [string]
}
`;
