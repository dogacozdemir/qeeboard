import React, { useState } from 'react';
import SVGKeycap from './SVGKeycap';
import { KeycapConfig, KeycapLayer } from '@/types/keyboard';

const SVGKeycapExample: React.FC = () => {
  const [selectedKeycap, setSelectedKeycap] = useState<string>('key1');

  // Example keycap configurations
  const exampleKeycaps: KeycapConfig[] = [
    {
      id: 'key1',
      row: 0,
      col: 0,
      width: 1,
      height: 1,
      x: 0,
      y: 0,
      color: '#1990ff', // Primary blue
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
    },
    {
      id: 'key2',
      row: 0,
      col: 1,
      width: 1,
      height: 1,
      x: 1,
      y: 0,
      color: '#ff6b35', // Orange accent
      textColor: '#ffffff',
      layers: [
        {
          id: 'layer2',
          type: 'text',
          content: 'S',
          fontSize: 16,
          color: '#ffffff',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: true,
        }
      ]
    },
    {
      id: 'key3',
      row: 0,
      col: 2,
      width: 1,
      height: 1,
      x: 2,
      y: 0,
      color: '#2d3748', // Dark gray
      textColor: '#ffffff',
      layers: [
        {
          id: 'layer3',
          type: 'text',
          content: 'D',
          fontSize: 16,
          color: '#ffffff',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: true,
        }
      ]
    },
    {
      id: 'key4',
      row: 0,
      col: 3,
      width: 2,
      height: 1,
      x: 3,
      y: 0,
      color: '#4a5568', // Medium gray
      textColor: '#ffffff',
      layers: [
        {
          id: 'layer4',
          type: 'text',
          content: 'Space',
          fontSize: 12,
          color: '#ffffff',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: false,
        }
      ]
    },
    {
      id: 'key5',
      row: 1,
      col: 0,
      width: 1,
      height: 1,
      x: 0,
      y: 1,
      color: '#e53e3e', // Red
      textColor: '#ffffff',
      layers: [
        {
          id: 'layer5',
          type: 'text',
          content: 'Ctrl',
          fontSize: 10,
          color: '#ffffff',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: true,
        }
      ]
    },
    {
      id: 'key6',
      row: 1,
      col: 1,
      width: 1,
      height: 1,
      x: 1,
      y: 1,
      color: '#38a169', // Green
      textColor: '#ffffff',
      layers: [
        {
          id: 'layer6',
          type: 'text',
          content: 'Alt',
          fontSize: 10,
          color: '#ffffff',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: true,
        }
      ]
    },
    {
      id: 'key7',
      row: 1,
      col: 2,
      width: 1,
      height: 1,
      x: 2,
      y: 1,
      color: '#805ad5', // Purple
      textColor: '#ffffff',
      layers: [
        {
          id: 'layer7',
          type: 'text',
          content: 'Fn',
          fontSize: 10,
          color: '#ffffff',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: true,
        }
      ]
    },
    {
      id: 'key8',
      row: 1,
      col: 3,
      width: 1,
      height: 1,
      x: 3,
      y: 1,
      color: '#d69e2e', // Yellow
      textColor: '#000000',
      layers: [
        {
          id: 'layer8',
          type: 'text',
          content: '⌘',
          fontSize: 14,
          color: '#000000',
          alignment: 'center',
          verticalAlignment: 'center',
          bold: true,
        }
      ]
    }
  ];

  const handleKeycapClick = (keycapId: string) => {
    setSelectedKeycap(keycapId);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          SVG Keycap Examples
        </h1>
        <p className="text-muted-foreground mb-8">
          Click on any keycap to see it selected. These SVG keycaps match the exact design from your webapp.
        </p>

        {/* Keycap Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {exampleKeycaps.map((keycap) => (
            <div
              key={keycap.id}
              className="flex justify-center items-center p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => handleKeycapClick(keycap.id)}
            >
              <SVGKeycap
                keycap={keycap}
                scale={1.5}
                showBorder={selectedKeycap === keycap.id}
                borderColor="#1990ff"
                className="transition-all duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Selected Keycap Details */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Selected Keycap Details
          </h2>
          {(() => {
            const selected = exampleKeycaps.find(k => k.id === selectedKeycap);
            if (!selected) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Properties</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div><span className="font-medium">ID:</span> {selected.id}</div>
                    <div><span className="font-medium">Color:</span> {selected.color}</div>
                    <div><span className="font-medium">Text Color:</span> {selected.textColor}</div>
                    <div><span className="font-medium">Size:</span> {selected.width}×{selected.height}</div>
                    <div><span className="font-medium">Position:</span> ({selected.x}, {selected.y})</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Layers</h3>
                  <div className="space-y-2">
                    {selected.layers.map((layer, index) => (
                      <div key={layer.id} className="text-sm text-muted-foreground">
                        <div className="font-medium">Layer {index + 1}:</div>
                        <div className="ml-2">
                          <div>Type: {layer.type}</div>
                          <div>Content: "{layer.content}"</div>
                          {layer.fontSize && <div>Font Size: {layer.fontSize}px</div>}
                          {layer.color && <div>Color: {layer.color}</div>}
                          {layer.alignment && <div>Alignment: {layer.alignment}</div>}
                          {layer.bold && <div>Bold: {layer.bold ? 'Yes' : 'No'}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            How to Use SVGKeycap
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-medium text-foreground mb-2">Basic Usage:</h3>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`import SVGKeycap from './components/SVGKeycap';
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
              <h3 className="font-medium text-foreground mb-2">Props:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><code className="bg-muted px-1 rounded">keycap</code> - KeycapConfig object with all keycap data</li>
                <li><code className="bg-muted px-1 rounded">scale</code> - Scale factor (default: 1)</li>
                <li><code className="bg-muted px-1 rounded">showBorder</code> - Show selection border (default: false)</li>
                <li><code className="bg-muted px-1 rounded">borderColor</code> - Border color when selected (default: '#1990ff')</li>
                <li><code className="bg-muted px-1 rounded">className</code> - Additional CSS classes</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Exact visual match with your webapp's KeycapPreview component</li>
                <li>Multi-layer support for text and images</li>
                <li>Automatic color brightness adjustment for base layer</li>
                <li>Gradient effects and shadows</li>
                <li>Full text styling support (bold, italic, underline)</li>
                <li>Text alignment and positioning</li>
                <li>Image clipping and scaling</li>
                <li>Transform support (rotation, mirroring)</li>
                <li>Responsive scaling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVGKeycapExample;
