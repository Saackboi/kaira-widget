// Control interface and registry. Each control file self-registers on import.

export type ControlSection = 'vision' | 'reading' | 'navigation';

export type ControlType = 'toggle' | 'cycle' | 'custom';

export interface Control {
  id: string;
  label: string;
  icon: string;
  section: ControlSection;
  type: ControlType;
  css?: string;
  apply: (on: boolean | string) => void;
  syncUI?: () => void;
  cycleNext?: () => void;
  buildUI?: () => HTMLElement;
}

export const registry: Control[] = [];

export function register(control: Control): void {
  registry.push(control);
}
