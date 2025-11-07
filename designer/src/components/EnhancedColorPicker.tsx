import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, Droplet, Pipette } from 'lucide-react';

interface EnhancedColorPickerProps {
  selectedColor: string;
  selectedTextColor: string;
  onColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  selectedKeysCount: number;
}

const EnhancedColorPicker: React.FC<EnhancedColorPickerProps> = ({
  selectedColor,
  selectedTextColor,
  onColorChange,
  onTextColorChange,
  selectedKeysCount,
}) => {
  const [isEyedropping, setIsEyedropping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const startEyedropper = async () => {
    if (!('EyeDropper' in window)) {
      // Fallback for browsers without EyeDropper API
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
          setIsEyedropping(true);
        }
      } catch (err) {
        console.error('Error accessing screen:', err);
      }
      return;
    }

    try {
      // @ts-ignore - EyeDropper is not yet in TypeScript types
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      onColorChange(result.sRGBHex);
    } catch (err) {
      console.error('Error with eyedropper:', err);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEyedropping || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get pixel color at click position
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    onColorChange(hex);
    
    // Stop eyedropping
    if (video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsEyedropping(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Palette className="h-5 w-5" />
          Enhanced Color Customization
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
            <Droplet className="h-4 w-4" />
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
            <Button
              variant="outline"
              size="sm"
              onClick={startEyedropper}
              className="px-3"
              title="Eyedropper Tool"
            >
              <Pipette className="h-4 w-4" />
            </Button>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                startEyedropper().then(() => {
                  // This would need to be handled differently for text color
                });
              }}
              className="px-3"
              title="Eyedropper Tool"
            >
              <Pipette className="h-4 w-4" />
            </Button>
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

        {/* Eyedropper Modal */}
        {isEyedropping && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="mb-4">Click on any color to pick it</p>
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="border border-white cursor-crosshair"
                onClick={handleCanvasClick}
              />
              <video
                ref={videoRef}
                className="hidden"
                autoPlay
                muted
              />
              <Button
                variant="outline"
                onClick={() => setIsEyedropping(false)}
                className="mt-4"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedColorPicker;