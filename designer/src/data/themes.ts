export type ThemeCategory = 'none' | 'gradient-global' | 'gradient-position' | 'two-color';

export type GradientDirection = 'horizontal' | 'vertical' | 'diagonal';

export type ThemeType =
  | 'none'
  | 'solid/black'
  | 'solid/white'
  | 'two-color/midnight'
  | 'two-color/candy'
  | 'gradient/global/sunset'
  | 'gradient/global/ocean'
  | 'gradient/position/sunset'
  | 'gradient/position/ocean';

export type ThemeDefinition =
  | {
      id: ThemeType;
      label: string;
      type: 'solid';
      textColor?: string;
      colors: { start: string };
    }
  | {
      id: ThemeType;
      label: string;
      type: 'gradient';
      mode: 'global' | 'position-based';
      textColor?: string;
      colors: { start: string; end: string; direction?: GradientDirection };
    }
  | {
      id: ThemeType;
      label: string;
      type: 'two-color';
      textColor?: string;
      colors: { start: string; end: string };
    };

export const THEMES: Record<ThemeType, ThemeDefinition> = {
  'none': {
    id: 'none',
    label: 'Tema yok',
    type: 'solid',
    colors: { start: '#2D3748' },
    textColor: '#FFFFFF',
  },
  'solid/black': {
    id: 'solid/black',
    label: 'Siyah (Düz)',
    type: 'solid',
    colors: { start: '#111111' },
    textColor: '#FFFFFF',
  },
  'solid/white': {
    id: 'solid/white',
    label: 'Beyaz (Düz)',
    type: 'solid',
    colors: { start: '#FFFFFF' },
    textColor: '#111111',
  },
  'two-color/midnight': {
    id: 'two-color/midnight',
    label: 'Midnight (İki renkli)',
    // Apply logic will treat two-color presets as solid for now
    type: 'solid',
    colors: { start: '#0f172a' },
    textColor: '#e2e8f0',
  },
  'two-color/candy': {
    id: 'two-color/candy',
    label: 'Candy (İki renkli)',
    type: 'solid',
    colors: { start: '#f43f5e' },
    textColor: '#ffffff',
  },
  'gradient/global/sunset': {
    id: 'gradient/global/sunset',
    label: 'Sunset (Global)',
    type: 'gradient',
    mode: 'global',
    colors: { start: '#ff7e5f', end: '#feb47b', direction: 'diagonal' },
    textColor: '#1a1a1a',
  },
  'gradient/global/sunset-vertical': {
    id: 'gradient/global/sunset-vertical' as ThemeType,
    label: 'Sunset (Global Vertical)',
    type: 'gradient',
    mode: 'global',
    colors: { start: '#ff7e5f', end: '#feb47b', direction: 'vertical' },
    textColor: '#1a1a1a',
  },
  'gradient/global/ocean': {
    id: 'gradient/global/ocean',
    label: 'Ocean (Global)',
    type: 'gradient',
    mode: 'global',
    colors: { start: '#2193b0', end: '#6dd5ed', direction: 'horizontal' },
    textColor: '#0f172a',
  },
  // Vertical variants for global presets
  'gradient/global/ocean-vertical': {
    id: 'gradient/global/ocean-vertical' as ThemeType,
    label: 'Ocean (Global Vertical)',
    type: 'gradient',
    mode: 'global',
    colors: { start: '#2193b0', end: '#6dd5ed', direction: 'vertical' },
    textColor: '#0f172a',
  },
  'gradient/position/sunset': {
    id: 'gradient/position/sunset',
    label: 'Sunset (Pozisyona göre)',
    type: 'gradient',
    mode: 'position-based',
    colors: { start: '#ff7e5f', end: '#feb47b', direction: 'diagonal' },
    textColor: '#1a1a1a',
  },
  'gradient/position/ocean': {
    id: 'gradient/position/ocean',
    label: 'Ocean (Pozisyona göre)',
    type: 'gradient',
    mode: 'position-based',
    colors: { start: '#2193b0', end: '#6dd5ed', direction: 'horizontal' },
    textColor: '#0f172a',
  },
  // Two-color themes (edge vs center)
  'two-color/midnight': {
    id: 'two-color/midnight',
    label: 'Midnight (İki renkli)',
    type: 'two-color',
    colors: { start: '#0f172a', end: '#334155' },
    textColor: '#e2e8f0',
  },
  'two-color/candy': {
    id: 'two-color/candy',
    label: 'Candy (İki renkli)',
    type: 'two-color',
    colors: { start: '#f43f5e', end: '#f59e0b' },
    textColor: '#ffffff',
  },
};

export function getTheme(id: ThemeType): ThemeDefinition | undefined {
  return THEMES[id];
}

export function getThemesByCategory(category: ThemeCategory): ThemeDefinition[] {
  switch (category) {
    case 'none':
      return [THEMES['none']];
    case 'gradient-global':
      return [THEMES['gradient/global/sunset'], THEMES['gradient/global/ocean']];
    case 'gradient-position':
      return [THEMES['gradient/position/sunset'], THEMES['gradient/position/ocean']];
    case 'two-color':
      return [THEMES['two-color/midnight'], THEMES['two-color/candy']];
  }
}

export function interpolateColor(start: string, end: string, factor: number): string {
  const s = hexToRgb(start);
  const e = hexToRgb(end);
  if (!s || !e) return start;
  const t = easeStrong(factor);
  const r = Math.round(s.r + (e.r - s.r) * t);
  const g = Math.round(s.g + (e.g - s.g) * t);
  const b = Math.round(s.b + (e.b - s.b) * t);
  return rgbToHex(r, g, b);
}

export function calculatePositionFactor(
  keyX: number,
  keyY: number,
  layoutWidth: number,
  layoutHeight: number,
  direction: GradientDirection
): number {
  const nx = keyX / Math.max(1, layoutWidth);
  const ny = keyY / Math.max(1, layoutHeight);
  if (direction === 'horizontal') return nx;
  if (direction === 'vertical') return ny;
  return Math.min(1, (nx + ny) / 2);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  if (Number.isNaN(bigint)) return null;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function easeStrong(t: number): number {
  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  t = clamp(t);
  if (t <= 0.5) {
    return 0.5 * Math.pow(2 * t, 0.6);
  }
  return 1 - 0.5 * Math.pow(2 * (1 - t), 0.6);
}
// Removed legacy duplicate theme API below to avoid redeclaration errors
