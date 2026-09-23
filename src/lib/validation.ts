import { getScenario } from '@/data/demo-scenarios';
export function validateScenario(id: string) { if (!getScenario(id)) throw new Error('Unknown scenarioId'); return true; }
export const transitions: Record<string, string[]> = { draft:['awaiting_payment'], awaiting_payment:['queued'], queued:['collecting'], collecting:['resolved','unresolved'] };
export function canTransition(from: string, to: string) { return transitions[from]?.includes(to) ?? false; }
