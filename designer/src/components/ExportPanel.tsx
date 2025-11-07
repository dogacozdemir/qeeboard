import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileJson, Palette } from 'lucide-react';
import { KeyboardConfig } from '@/types/keyboard';
import { useToast } from '@/hooks/use-toast';

interface ExportPanelProps {
  config: KeyboardConfig;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ config }) => {
  const { toast } = useToast();

  const exportConfig = () => {
    const exportData = {
      ...config,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `keycap-config-${config.layout.id}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "Your keycap configuration has been saved as a JSON file.",
    });
  };

  const exportSummary = () => {
    const summary = {
      layout: config.layout.name,
      totalKeys: config.layout.totalKeys,
      customizedKeys: config.layout.keys.filter(key => 
        key.color !== '#2D3748' || (key.layers && key.layers.length > 1)
      ).length,
      groups: Object.keys(config.groups).length,
    };

    const summaryStr = `Keycap Configuration Summary
Layout: ${summary.layout}
Total Keys: ${summary.totalKeys}
Customized Keys: ${summary.customizedKeys}
Groups: ${summary.groups}

Generated: ${new Date().toLocaleString()}`;

    const dataBlob = new Blob([summaryStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `keycap-summary-${config.layout.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Summary Exported",
      description: "Configuration summary has been saved as a text file.",
    });
  };

  const getDefaultLegend = (current: string) => {
    // Simple check for default legends
    return current;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Download className="h-5 w-5" />
          Export Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-muted-foreground">Layout</div>
            <div className="font-medium">{config.layout.name}</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-muted-foreground">Total Keys</div>
            <div className="font-medium">{config.layout.totalKeys}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={exportConfig} className="w-full">
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON Configuration
          </Button>
          
          <Button onClick={exportSummary} variant="outline" className="w-full">
            <Palette className="h-4 w-4 mr-2" />
            Export Summary
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          JSON files can be imported later to restore your configuration.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;