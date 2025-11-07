import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Droplets } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  selectedTextColor: string;
  onColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  selectedKeysCount: number;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  selectedTextColor,
  onColorChange,
  onTextColorChange,
  selectedKeysCount,
}) => {
  const presetColors = [
    '#1a1a1a', '#2d3748', '#4a5568', '#718096',
    '#2b6cb0', '#3182ce', '#4299e1', '#63b3ed',
    '#d53f8c', '#e53e3e', '#f56500', '#ed8936',
    '#38a169', '#48bb78', '#68d391', '#9f7aea',
  ];

  const presetTextColors = [
    '#ffffff', '#f7fafc', '#edf2f7', '#e2e8f0',
    '#1a202c', '#2d3748', '#4a5568', '#718096',
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="h-5 w-5" />
          Color Customization
        </CardTitle>
        {selectedKeysCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Editing {selectedKeysCount} selected key{selectedKeysCount > 1 ? 's' : ''}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keycap Color */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Keycap Color
          </Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-12 h-10 p-1 border border-border rounded"
            />
            <Input
              type="text"
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="flex-1"
              placeholder="#2d3748"
            />
          </div>
          <div className="grid grid-cols-8 gap-1">
            {presetColors.map((color) => (
              <Button
                key={color}
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 border-2"
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label>Legend Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedTextColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-12 h-10 p-1 border border-border rounded"
            />
            <Input
              type="text"
              value={selectedTextColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="flex-1"
              placeholder="#ffffff"
            />
          </div>
          <div className="grid grid-cols-8 gap-1">
            {presetTextColors.map((color) => (
              <Button
                key={color}
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 border-2"
                style={{ backgroundColor: color }}
                onClick={() => onTextColorChange(color)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;