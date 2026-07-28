// Dynamic language system. LANG is a live binding — call setLang() and all imports update.

import { BASE, type LangPack } from './en';
import { ES } from './es';

const packs: Record<string, Partial<LangPack>> = { es: ES };

function merge(base: LangPack, partial: Partial<LangPack>): LangPack {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(partial) as (keyof LangPack)[]) {
    const val = partial[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = { ...(base[key] as Record<string, unknown>), ...(val as Record<string, unknown>) };
    } else if (val !== undefined) {
      result[key] = val;
    }
  }
  return result as unknown as LangPack;
}

// Auto-detect on first load. init() may override this after loadPrefs().
const detected = navigator.language.startsWith('es') ? 'es' : null;
export let LANG: LangPack = detected ? merge(BASE, packs[detected]) : BASE;

export function setLang(code: string): void {
  const partial = packs[code];
  LANG = partial ? merge(BASE, partial) : BASE;
}

export type { LangPack };
