export interface KeycapLayer {
  id: string;
  type: 'text' | 'image' | 'icon';
  content: string; // text content, image data URL, or icon name
  font?: string;
  fontSize?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  rotation?: number;
  mirrorX?: boolean;
  mirrorY?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface KeycapConfig {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  textColor: string;
  group?: string;
  layers: KeycapLayer[];
}

export interface KeyboardLayout {
  id: string;
  name: string;
  keys: KeycapConfig[];
  totalKeys: number;
  width: number;
  height: number;
}

import type { ThemeType } from '@/data/themes';

export interface KeyboardConfig {
  layout: KeyboardLayout;
  globalSettings: {
    theme: string;
    font: string;
  };
  selectedKeys: string[];
  groups: Record<string, string[]>;
  // Cache layouts by composite key `${layoutType}-${layoutStandard}`
  allLayouts: Record<string, KeyboardLayout>;
  currentLayoutType: LayoutType;
  layoutStandard: LayoutStandard;
  currentTheme?: ThemeType;
}

export type LayoutType = '60%' | '65%' | '65% #2' | '75% #1' | '75% #2' | 'TKL' | 'Full';

export type LayoutStandard = 'ANSI' | 'ISO';

export interface LayoutOption {
  id: LayoutType;
  name: string;
  description: string;
  keyCount: number;
}