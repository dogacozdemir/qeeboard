import React from 'react';
import { LayoutType, LayoutOption } from '@/types/keyboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface LayoutSelectorProps {
  layouts: LayoutOption[];
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  layouts,
  selectedLayout,
  onLayoutChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-foreground">Keyboard Layout</CardTitle>
        <CardDescription>Choose your keyboard size and layout</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {layouts.map((layout) => (
          <Button
            key={layout.id}
            variant={selectedLayout === layout.id ? "default" : "outline"}
            className="w-full justify-between h-auto p-4"
            onClick={() => onLayoutChange(layout.id)}
          >
            <div className="text-left">
              <div className="font-medium">{layout.name}</div>
              <div className="text-xs text-muted-foreground">
                {layout.description}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {layout.keyCount} keys
              </span>
              {selectedLayout === layout.id && (
                <Check className="h-4 w-4" />
              )}
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default LayoutSelector;