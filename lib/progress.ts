export type Player = 'dad' | 'guazai';
export type Completions = Record<string, boolean>;
export type FamilyProgress = { version: 2; dad: Completions; guazai: Completions };
export const progressKey = 'guige-guitar-family-progress-v2';
export const legacyKey = 'guige-guitar-plan-completed';

function clean(value: unknown): Completions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key, done]) => /^(?:[1-9]|1[0-2])-[1-7]$/.test(key) && done === true));
}

export function readProgress(current: string | null, legacy: string | null): FamilyProgress {
  if (current) {
    try {
      const value = JSON.parse(current);
      if (value?.version === 2) return { version: 2, dad: clean(value.dad), guazai: clean(value.guazai) };
    } catch { /* Fall back to the preserved legacy record. */ }
  }
  try { return { version: 2, dad: clean(JSON.parse(legacy ?? '{}')), guazai: {} }; }
  catch { return { version: 2, dad: {}, guazai: {} }; }
}

export function toggleProgress(progress: FamilyProgress, player: Player, session: string): FamilyProgress {
  const entries = { ...progress[player] };
  if (entries[session]) delete entries[session];
  else entries[session] = true;
  return { ...progress, [player]: entries };
}

export function countProgress(entries: Completions, week?: number): number {
  return Object.entries(entries).filter(([key, done]) => done && (week === undefined || key.startsWith(`${week}-`))).length;
}

export function sharedCount(progress: FamilyProgress): number {
  return Object.keys(progress.dad).filter((key) => progress.dad[key] && progress.guazai[key]).length;
}
