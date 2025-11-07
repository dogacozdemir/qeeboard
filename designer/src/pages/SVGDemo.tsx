import React, { useState } from 'react';
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig';
import SVGKeycap from '@/components/SVGKeycap';
import { generateSVGKeycap, createSimpleKeycap, downloadSVGKeycap } from '@/utils/svgKeycapGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const SVGDemo: React.FC = () => {
  const { config } = useKeyboardConfig();
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [customText, setCustomText] = useState('Custom');
  const [customColor, setCustomColor] = useState('#1990ff');
  const [svgOutput, setSvgOutput] = useState('');

  const selectedKey = selectedKeyId ? config.layout.keys.find(k => k.id === selectedKeyId) : null;

  const handleKeySelect = (keyId: string) => {
    setSelectedKeyId(keyId);
    const key = config.layout.keys.find(k => k.id === keyId);
    if (key) {
      const svg = generateSVGKeycap(key, { scale: 2, showBorder: true });
      setSvgOutput(svg);
    }
  };

  const handleGenerateCustom = () => {
    const customKeycap = createSimpleKeycap(customText, customColor, '#ffffff', {
      fontSize: 16,
      bold: true
    });
    const svg = generateSVGKeycap(customKeycap, { scale: 2, showBorder: true });
    setSvgOutput(svg);
  };

  const handleDownloadSVG = () => {
    if (selectedKey) {
      downloadSVGKeycap(selectedKey, `${selectedKey.id}-keycap.svg`, { scale: 2 });
    }
  };

  const handleDownloadCustomSVG = () => {
    const customKeycap = createSimpleKeycap(customText, customColor, '#ffffff', {
      fontSize: 16,
      bold: true
    });
    downloadSVGKeycap(customKeycap, `${customText.toLowerCase()}-keycap.svg`, { scale: 2 });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">SVG Keycap Generator</h1>
          <p className="text-muted-foreground">
            Generate SVG keycaps that match your webapp's design exactly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyboard Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Select a Keycap</CardTitle>
              <CardDescription>
                Click on any keycap from your current keyboard layout to generate its SVG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-card border border-border rounded-lg p-8 overflow-auto">
                <div className="relative" style={{ minHeight: '400px' }}>
                  {config.layout.keys.map((keycap) => (
                    <div
                      key={keycap.id}
                      className="absolute cursor-pointer transition-all duration-200 hover:scale-105"
                      style={{
                        left: keycap.x * 48 + 2,
                        top: keycap.y * 48 + 2,
                        width: keycap.width * 48 - 4,
                        height: keycap.height * 48 - 4,
                      }}
                      onClick={() => handleKeySelect(keycap.id)}
                    >
                      <SVGKeycap
                        keycap={keycap}
                        scale={1}
                        showBorder={selectedKeyId === keycap.id}
                        borderColor="#1990ff"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Selected Keycap Info */}
            {selectedKey && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Keycap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div><span className="font-medium">ID:</span> {selectedKey.id}</div>
                    <div><span className="font-medium">Color:</span> {selectedKey.color}</div>
                    <div><span className="font-medium">Size:</span> {selectedKey.width}×{selectedKey.height}</div>
                    <div><span className="font-medium">Layers:</span> {selectedKey.layers.length}</div>
                  </div>
                  <Button onClick={handleDownloadSVG} className="w-full">
                    Download SVG
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Custom Keycap Generator */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Keycap</CardTitle>
                <CardDescription>
                  Create a custom keycap with your own text and color
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-text">Text</Label>
                  <Input
                    id="custom-text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Enter keycap text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-color">Color</Label>
                  <Input
                    id="custom-color"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                  />
                </div>
                <Button onClick={handleGenerateCustom} className="w-full">
                  Generate SVG
                </Button>
                <Button onClick={handleDownloadCustomSVG} variant="outline" className="w-full">
                  Download Custom SVG
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SVG Output */}
        {svgOutput && (
          <Card>
            <CardHeader>
              <CardTitle>Generated SVG</CardTitle>
              <CardDescription>
                Copy the SVG code below or download the file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-4 bg-muted rounded-lg">
                <div 
                  dangerouslySetInnerHTML={{ __html: svgOutput }}
                  className="scale-150"
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="svg-code">SVG Code</Label>
                <Textarea
                  id="svg-code"
                  value={svgOutput}
                  readOnly
                  className="font-mono text-sm"
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              How to use the SVG keycap components in your projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">React Component</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`import SVGKeycap from '@/components/SVGKeycap';
import { KeycapConfig } from '@/types/keyboard';

const keycap: KeycapConfig = {
  id: 'my-key',
  row: 0,
  col: 0,
  width: 1,
  height: 1,
  x: 0,
  y: 0,
  color: '#1990ff',
  textColor: '#ffffff',
  layers: [
    {
      id: 'layer1',
      type: 'text',
      content: 'A',
      fontSize: 16,
      color: '#ffffff',
      alignment: 'center',
      verticalAlignment: 'center',
      bold: true,
    }
  ]
};

<SVGKeycap 
  keycap={keycap} 
  scale={1.5} 
  showBorder={true}
  borderColor="#1990ff"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Standalone SVG Generation</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`import { generateSVGKeycap, createSimpleKeycap } from '@/utils/svgKeycapGenerator';

// Generate SVG string
const keycap = createSimpleKeycap('Enter', '#1990ff', '#ffffff');
const svgString = generateSVGKeycap(keycap, { scale: 2 });

// Use in HTML
document.getElementById('keycap-container').innerHTML = svgString;`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Download SVG File</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`import { downloadSVGKeycap, createSimpleKeycap } from '@/utils/svgKeycapGenerator';

const keycap = createSimpleKeycap('Space', '#4a5568', '#ffffff', {
  width: 2,
  fontSize: 12
});

downloadSVGKeycap(keycap, 'space-key.svg', { scale: 2 });`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SVGDemo;
