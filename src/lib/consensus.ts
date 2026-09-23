import { Choice } from '@/types/bounty';
export function consensus(answers: Choice[]) {
 const counts: Record<string, number> = {};
 answers.forEach(a => { counts[a] = (counts[a] ?? 0) + 1; });
 const winner = Object.entries(counts).filter(([a]) => a !== 'Unclear').sort((a,b) => b[1]-a[1])[0];
 const resolved = Boolean(winner && winner[1] > answers.length / 2);
 return { answer: resolved ? winner![0] as Choice : undefined, agreement: winner ? winner[1] / answers.length : 0, counts };
}
