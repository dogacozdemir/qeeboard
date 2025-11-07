import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Type, Save, X, Upload, Image, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

interface EnhancedLegendEditorProps {
  selectedKeyId: string | null;
  currentLegend: string;
  onLegendChange?: (keyId: string, legend: string) => void;
  onLegendSettingsChange?: (
    keyId: string,
    settings: {
      legend: string;
      legendMode: 'text' | 'image';
      legendImage?: string | null;
      legendFont?: string;
      legendFontSize?: number;
      legendOffsetX?: number;
      legendOffsetY?: number;
      legendAlignment?: 'left' | 'center' | 'right';
      legendVerticalAlignment?: 'top' | 'center' | 'bottom';
      legendRotation?: number;
      legendMirrorX?: boolean;
      legendMirrorY?: boolean;
    }
  ) => void;
  onClose: () => void;
}

const fonts = [
  'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
  'Verdana', 'Georgia', 'Palatino', 'Garamond',
  'Comic Sans MS', 'Impact', 'Lucida Console', 'Tahoma'
];

const EnhancedLegendEditor: React.FC<EnhancedLegendEditorProps> = ({
  selectedKeyId,
  currentLegend,
  onLegendChange,
  onLegendSettingsChange,
  onClose,
}) => {
  const [legend, setLegend] = useState(currentLegend);
  const [font, setFont] = useState('Arial');
  const [fontSize, setFontSize] = useState([14]);
  const [positionX, setPositionX] = useState([0]);
  const [positionY, setPositionY] = useState([0]);
  const [useImage, setUseImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [verticalAlignment, setVerticalAlignment] = useState<'top' | 'center' | 'bottom'>('center');
  const [rotation, setRotation] = useState([0]);
  const [mirrorX, setMirrorX] = useState(false);
  const [mirrorY, setMirrorY] = useState(false);

  const updateSettings = (overrides: any = {}) => {
    if (selectedKeyId && onLegendSettingsChange) {
      onLegendSettingsChange(selectedKeyId, {
        legend,
        legendMode: useImage ? 'image' : 'text',
        legendImage: useImage ? imageDataUrl : null,
        legendFont: font,
        legendFontSize: fontSize[0],
        legendOffsetX: positionX[0],
        legendOffsetY: positionY[0],
        legendAlignment: alignment,
        legendVerticalAlignment: verticalAlignment,
        legendRotation: rotation[0],
        legendMirrorX: mirrorX,
        legendMirrorY: mirrorY,
        ...overrides,
      });
    } else if (selectedKeyId && onLegendChange) {
      onLegendChange(selectedKeyId, legend);
    }
  };

  // Real-time updates
  useEffect(() => {
    updateSettings();
  }, [legend, font, fontSize, positionX, positionY, useImage, imageDataUrl, alignment, verticalAlignment, rotation, mirrorX, mirrorY]);

  const handleLegendChange = (value: string) => {
    setLegend(value);
  };

  const handleFontChange = (value: string) => {
    setFont(value);
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
  };

  const handlePositionXChange = (value: number[]) => {
    setPositionX(value);
  };

  const handlePositionYChange = (value: number[]) => {
    setPositionY(value);
  };

  const handleModeChange = (isImage: boolean) => {
    setUseImage(isImage);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUseImage(true);
      
      // Convert to data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageDataUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!selectedKeyId) return null;

  return (
    <Card className="mb-6 border-primary/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Type className="h-5 w-5" />
          Enhanced Legend Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Text or Image Toggle */}
        <div className="flex gap-2">
          <Button
            variant={!useImage ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange(false)}
            className="flex-1"
          >
            <Type className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button
            variant={useImage ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange(true)}
            className="flex-1"
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
        </div>

        {!useImage ? (
          <>
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="legend-input">Key Legend</Label>
              <Input
                id="legend-input"
                value={legend}
                onChange={(e) => handleLegendChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter key text..."
                className="bg-background"
                autoFocus
              />
            </div>

            {/* Font Selection */}
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={font} onValueChange={handleFontChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((fontName) => (
                    <SelectItem key={fontName} value={fontName}>
                      <span style={{ fontFamily: fontName }}>{fontName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label>Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={handleFontSizeChange}
                max={24}
                min={8}
                step={1}
                className="w-full"
              />
            </div>
          </>
        ) : (
          <>
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload image
                  </p>
                </Label>
                {imageFile && (
                  <div className="mt-2">
                    <p className="text-xs text-foreground mb-2">
                      Selected: {imageFile.name}
                    </p>
                    {imageDataUrl && (
                      <img 
                        src={imageDataUrl} 
                        alt="Preview" 
                        className="w-8 h-8 object-contain mx-auto border rounded"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Alignment Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horizontal Alignment</Label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <Button
                  key={align}
                  variant={alignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAlignment(align)}
                  className="flex-1 capitalize"
                >
                  {align}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Vertical Alignment</Label>
            <div className="flex gap-2">
              {(['top', 'center', 'bottom'] as const).map((align) => (
                <Button
                  key={align}
                  variant={verticalAlignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVerticalAlignment(align)}
                  className="flex-1 capitalize"
                >
                  {align}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>X Position: {positionX[0]}</Label>
            <Slider
              value={positionX}
              onValueChange={handlePositionXChange}
              max={300}
              min={-300}
              step={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Y Position: {positionY[0]}</Label>
            <Slider
              value={positionY}
              onValueChange={handlePositionYChange}
              max={200}
              min={-200}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Rotation Control */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            Rotation: {rotation[0]}°
          </Label>
          <Slider
            value={rotation}
            onValueChange={setRotation}
            max={180}
            min={-180}
            step={5}
            className="w-full"
          />
        </div>

        {/* Mirror Controls */}
        <div className="space-y-2">
          <Label>Mirror Options</Label>
          <div className="flex gap-2">
            <Button
              variant={mirrorX ? "default" : "outline"}
              size="sm"
              onClick={() => setMirrorX(!mirrorX)}
              className="flex-1"
            >
              <FlipHorizontal className="h-4 w-4 mr-2" />
              Horizontal
            </Button>
            <Button
              variant={mirrorY ? "default" : "outline"}
              size="sm"
              onClick={() => setMirrorY(!mirrorY)}
              className="flex-1"
            >
              <FlipVertical className="h-4 w-4 mr-2" />
              Vertical
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Changes are applied in real-time. Press Escape to close.
        </p>
      </CardContent>
    </Card>
  );
};

export default EnhancedLegendEditor;