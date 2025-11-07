import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Save, X, Image, Palette } from 'lucide-react';
import { IconPicker } from './IconPicker';

interface LegendEditorProps {
  selectedKeyId: string | null;
  currentLegend: string;
  onLegendChange: (keyId: string, legend: string) => void;
  onClose: () => void;
  onImageSelect?: (keyId: string, imageData: string) => void;
  onIconSelect?: (keyId: string, iconName: string, iconType: 'solid' | 'regular' | 'brand') => void;
}

const LegendEditor: React.FC<LegendEditorProps> = ({
  selectedKeyId,
  currentLegend,
  onLegendChange,
  onClose,
  onImageSelect,
  onIconSelect,
}) => {
  const [legend, setLegend] = useState(currentLegend);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSave = () => {
    if (selectedKeyId) {
      onLegendChange(selectedKeyId, legend);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleIconSelect = (iconName: string, iconType: 'solid' | 'regular' | 'brand') => {
    if (selectedKeyId && onIconSelect) {
      onIconSelect(selectedKeyId, iconName, iconType);
      onClose();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedKeyId && onImageSelect) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        onImageSelect(selectedKeyId, imageData);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!selectedKeyId) return null;

  return (
    <Card className="mb-6 border-primary/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Type className="h-5 w-5" />
          Edit Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="legend-input">Key Legend</Label>
          <Input
            id="legend-input"
            value={legend}
            onChange={(e) => setLegend(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter key text..."
            className="bg-background"
            autoFocus
          />
        </div>

        {/* Content Type Selection */}
        <div className="space-y-2">
          <Label>Content Type</Label>
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              size="sm" 
              className="flex-1"
              variant="default"
            >
              <Type className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button 
              onClick={() => setShowIconPicker(true)} 
              size="sm" 
              className="flex-1"
              variant="outline"
            >
              <Palette className="h-4 w-4 mr-2" />
              Icon
            </Button>
            <Button 
              onClick={() => document.getElementById('image-upload')?.click()} 
              size="sm" 
              className="flex-1"
              variant="outline"
            >
              <Image className="h-4 w-4 mr-2" />
              Image
            </Button>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline" size="sm" className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Press Enter to save, Escape to cancel
        </p>
      </CardContent>
      
      {showIconPicker && (
        <IconPicker
          onIconSelect={handleIconSelect}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </Card>
  );
};

export default LegendEditor;