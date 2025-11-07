import React from 'react';
import { LayoutType, LayoutOption, LayoutStandard } from '@/types/keyboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Keyboard } from 'lucide-react';

interface CompactLayoutSelectorProps {
  layouts: LayoutOption[];
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  layoutStandard?: LayoutStandard;
  onLayoutStandardChange?: (standard: LayoutStandard) => void;
  bare?: boolean;
}

const CompactLayoutSelector: React.FC<CompactLayoutSelectorProps> = ({
  layouts,
  selectedLayout,
  onLayoutChange,
  layoutStandard = 'ANSI',
  onLayoutStandardChange,
  bare = false,
}) => {
  const selectedLayoutData = layouts.find(layout => layout.id === selectedLayout);

  return (
    <div className={bare ? "" : "bg-card border border-border rounded-lg shadow-elevated p-4"}>
      <div className="flex items-center gap-2 w-full">
        <Keyboard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select value={selectedLayout} onValueChange={onLayoutChange}>
          <SelectTrigger className="flex-1 h-8 text-sm border-border bg-background text-foreground">
            <SelectValue>
              {selectedLayoutData ? (
                <span>{selectedLayoutData.name}</span>
              ) : (
                'Select Layout'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {layouts.map((layout) => (
              <SelectItem key={layout.id} value={layout.id} className="text-foreground">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{layout.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {layout.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onLayoutStandardChange && (
          <Select value={layoutStandard} onValueChange={(v) => onLayoutStandardChange(v as LayoutStandard)}>
            <SelectTrigger className="h-8 w-20 text-xs border-border bg-background text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANSI" className="text-xs">ANSI</SelectItem>
              <SelectItem value="ISO" className="text-xs">ISO</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default CompactLayoutSelector;
