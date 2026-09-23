export type ScenarioId = 'shopping-expiry' | 'browser-checkout' | 'marketing-product-visible' | 'marketplace-variant';
export type Choice = 'Yes' | 'No' | 'Unclear' | 'Same' | 'Different';
export type BountyStatus = 'draft' | 'awaiting_payment' | 'queued' | 'collecting' | 'resolved' | 'unresolved';
export type Scenario = { id: ScenarioId; category: string; title: string; question: string; context: string; choices: Choice[]; outcome: Choice[]; media: string };
export type Bounty = Scenario & { bountyId: string; requiredAnswers: 3; priceUsdcMicros: number; status: BountyStatus; answers: Choice[]; result?: { answer?: Choice; agreement: number; counts: Record<string, number> } };
