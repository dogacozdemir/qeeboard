import React from 'react';
import { KeycapLayer } from '@/types/keyboard';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { X, FlipHorizontal, FlipVertical } from 'lucide-react';

interface LayerEditorProps {
  layer: KeycapLayer;
  onLayerChange: (updates: Partial<KeycapLayer>) => void;
  onClose: () => void;
}

const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];

const LayerEditor: React.FC<LayerEditorProps> = ({ layer, onLayerChange, onClose }) => {
  const updateField = (field: keyof KeycapLayer, value: any) => {
    onLayerChange({ [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('content', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Edit Layer</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {layer.type === 'text' ? (
        <>
          <div>
            <Label>Text Content</Label>
            <Input
              value={layer.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder="Enter text"
            />
          </div>

          <div>
            <Label>Font</Label>
            <Select
              value={layer.font || 'Arial'}
              onValueChange={(value) => updateField('font', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map(font => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Font Size: {layer.fontSize || 14}px</Label>
            <Slider
              value={[layer.fontSize || 14]}
              onValueChange={([value]) => updateField('fontSize', value)}
              min={8}
              max={48}
              step={1}
            />
          </div>
        </>
      ) : (
        <div>
          <Label>Image</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />
          {layer.content && (
            <img src={layer.content} alt="Layer" className="mt-2 max-h-20 rounded" />
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Horizontal</Label>
          <Select
            value={layer.alignment || 'center'}
            onValueChange={(value: any) => updateField('alignment', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Vertical</Label>
          <Select
            value={layer.verticalAlignment || 'center'}
            onValueChange={(value: any) => updateField('verticalAlignment', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>X Offset: {layer.offsetX || 0}px</Label>
        <Slider
          value={[layer.offsetX || 0]}
          onValueChange={([value]) => updateField('offsetX', value)}
          min={-30}
          max={30}
          step={1}
        />
      </div>

      <div>
        <Label>Y Offset: {layer.offsetY || 0}px</Label>
        <Slider
          value={[layer.offsetY || 0]}
          onValueChange={([value]) => updateField('offsetY', value)}
          min={-30}
          max={30}
          step={1}
        />
      </div>

      <div>
        <Label>Rotation: {layer.rotation || 0}°</Label>
        <Slider
          value={[layer.rotation || 0]}
          onValueChange={([value]) => updateField('rotation', value)}
          min={-180}
          max={180}
          step={1}
        />
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={layer.mirrorX ? 'default' : 'outline'}
          onClick={() => updateField('mirrorX', !layer.mirrorX)}
        >
          <FlipHorizontal className="h-4 w-4 mr-1" />
          Mirror X
        </Button>
        <Button
          size="sm"
          variant={layer.mirrorY ? 'default' : 'outline'}
          onClick={() => updateField('mirrorY', !layer.mirrorY)}
        >
          <FlipVertical className="h-4 w-4 mr-1" />
          Mirror Y
        </Button>
      </div>
    </Card>
  );
};

export default LayerEditor;
