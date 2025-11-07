import { KeycapConfig } from '@/types/keyboard';

/**
 * Filters keys based on the selected preset
 * This implements the Thock Factory approach where one JSON structure is used
 * and keys are hidden/shown based on the preset selection using the 'hidden' property
 */
export const filterKeysByPreset = (allKeys: KeycapConfig[], preset: string): KeycapConfig[] => {
  // For now, just return all keys - the Thock Factory JSON already has the correct 'hidden' property
  // that determines which keys should be visible for each preset
  // The preset selection should update the JSON's hidden properties, not filter the keys
  return allKeys;
};

/**
 * Gets the available presets
 */
export const getAvailablePresets = (): string[] => {
  return [
    '60% Compact',
    '65% Compact', 
    '75% Compact',
    'Tenkeyless',
    'Full Size',
    '100% Full Size'
  ];
};
