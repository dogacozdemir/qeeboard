import React from 'react';
import { ThemeType, THEMES } from '@/data/themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme?: ThemeType;
  onThemeChange?: (themeId: ThemeType) => void;
  bare?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme = 'none',
  onThemeChange,
  bare = false,
}) => {
  const allThemes = Object.values(THEMES);
  const selectedThemeData = THEMES[selectedTheme as keyof typeof THEMES];

  return (
    <div className={bare ? "" : "bg-card border border-border rounded-lg shadow-elevated p-4"}>
        <div className="flex items-center gap-2 w-full">
        <Palette className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Select value={selectedTheme} onValueChange={(v) => onThemeChange?.(v as ThemeType)}>
            <SelectTrigger className="w-full h-8 text-sm border-border bg-background text-foreground">
              <SelectValue>
                {selectedThemeData ? (
                    <span>{selectedThemeData.label}</span>
                ) : (
                  'Select Theme'
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-card border-border max-h-[400px]">
              {allThemes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id} className="text-foreground">
                  <div className="flex flex-col items-start w-full">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{theme.label}</span>
                      {theme.type === 'gradient' && (
                        <span className="text-xs text-muted-foreground ml-2 px-1.5 py-0.5 bg-muted rounded">
                          {theme.mode === 'global' ? 'Global' : 'Position'}
                        </span>
                      )}
                    </div>
                    {/* optional description removed in new theme API */}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
    </div>
  );
};

export default ThemeSelector;
