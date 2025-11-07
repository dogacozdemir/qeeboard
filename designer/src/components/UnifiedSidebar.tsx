import React from 'react';
import CompactLayoutSelector from '@/components/CompactLayoutSelector';
import LayerManager from '@/components/LayerManager';
import ThemeSelector from '@/components/ThemeSelector';
import GroupManager from '@/components/GroupManager';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LayoutType, KeycapLayer, LayoutStandard } from '@/types/keyboard';
import { ThemeType } from '@/data/themes';

interface UnifiedSidebarProps {
  // Project name
  projectName?: string | null;
  onProjectNameChange?: (name: string) => void;
  // Layout selector props
  layouts: Array<{
    id: LayoutType;
    name: string;
    description: string;
    keyCount: number;
  }>;
  selectedLayout: LayoutType;
  onLayoutChange: (layoutType: LayoutType) => void;
  // New: ANSI/ISO selector
  layoutStandard?: LayoutStandard;
  onLayoutStandardChange?: (standard: LayoutStandard) => void;

  // Group manager props
  groups: Record<string, string[]>;
  selectedKeys: string[];
  onSaveGroup: (groupName: string, keyIds: string[]) => void;
  onLoadGroup: (groupName: string) => void;
  onDeleteGroup: (groupName: string) => void;

  // Layer management props
  editingKeyId?: string | null;
  currentKeyLayers?: KeycapLayer[];
  selectedLayerId?: string | null;
  onLayerSelect?: (layerId: string) => void;
  onLayerReorder?: (layerId: string, direction: 'up' | 'down') => void;
  onLayerDelete?: (layerId: string) => void;
  onAddTextLayer?: () => void;
  onAddImageLayer?: () => void;
  onAddIconLayer?: () => void;
  // Multi-selection props
  isMultiSelection?: boolean;
  multiSelectionStats?: { text: number; icon: number; image: number } | null;
  selectedLayerIds?: string[];
  getKeyLayers?: (keyId: string) => KeycapLayer[];
  onSelectAllLayers?: () => void;
  onSelectTextLayers?: () => void;
  onSelectIconLayers?: () => void;
  onSelectImageLayers?: () => void;
  // Theme props
  currentTheme?: ThemeType;
  onThemeChange?: (themeId: ThemeType) => void;
}

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  projectName,
  onProjectNameChange,
  layouts,
  selectedLayout,
  onLayoutChange,
  layoutStandard = 'ANSI',
  onLayoutStandardChange,
  groups,
  selectedKeys,
  onSaveGroup,
  onLoadGroup,
  onDeleteGroup,
  editingKeyId,
  currentKeyLayers = [],
  selectedLayerId,
  onLayerSelect,
  onLayerReorder,
  onLayerDelete,
  onAddTextLayer,
  onAddImageLayer,
  onAddIconLayer,
  isMultiSelection,
  multiSelectionStats,
  selectedLayerIds,
  getKeyLayers,
  onSelectAllLayers,
  onSelectTextLayers,
  onSelectIconLayers,
  onSelectImageLayers,
  currentTheme,
  onThemeChange,
}) => {
  return (
    <Card className="w-full h-full bg-card/80 backdrop-blur-sm border-border/50 border-r border-b-0 border-l-0 border-t-0 rounded-none">
      <div className="p-6 space-y-6 h-full overflow-y-auto">
        {/* Project Name & Layout in a shared container */}
        <Card className="bg-card border-border">
          <CardContent className="pt-4 space-y-3">
            {/* Project Name */}
            {projectName !== null && projectName !== undefined && (
              <div className="space-y-2">
                <Input
                  id="project-name"
                  name="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => onProjectNameChange?.(e.target.value)}
                  placeholder="Proje adı yok"
                  autoComplete="off"
                  data-form-type="other"
                  className="h-8 text-sm"
                />
              </div>
            )}
            
            {/* Layout with ISO/ANSI on the right */}
            <CompactLayoutSelector
              layouts={layouts}
              selectedLayout={selectedLayout}
              onLayoutChange={onLayoutChange}
              layoutStandard={layoutStandard}
              onLayoutStandardChange={onLayoutStandardChange}
              bare
            />
            
            {/* Theme */}
            <ThemeSelector
              selectedTheme={currentTheme}
              onThemeChange={onThemeChange}
              bare
            />
          </CardContent>
        </Card>

        <Separator className="bg-border/60" />

        {/* Layer Management Section */}
        <div className="space-y-3">
          <LayerManager
            layers={currentKeyLayers}
            selectedLayerId={selectedLayerId}
            onLayerSelect={onLayerSelect}
            onLayerReorder={onLayerReorder}
            onLayerDelete={onLayerDelete}
            onAddTextLayer={onAddTextLayer}
            onAddImageLayer={onAddImageLayer}
            onAddIconLayer={onAddIconLayer}
            selectedKeys={selectedKeys}
            isMultiSelection={isMultiSelection}
            multiSelectionStats={multiSelectionStats}
            selectedLayerIds={selectedLayerIds}
            getKeyLayers={getKeyLayers}
            onSelectAllLayers={onSelectAllLayers}
            onSelectTextLayers={onSelectTextLayers}
            onSelectIconLayers={onSelectIconLayers}
            onSelectImageLayers={onSelectImageLayers}
          />
        </div>

        <Separator className="bg-border/60" />

        {/* Key Groups Section */}
        <GroupManager
          groups={groups}
          selectedKeys={selectedKeys}
          onSaveGroup={onSaveGroup}
          onLoadGroup={onLoadGroup}
          onDeleteGroup={onDeleteGroup}
        />

      </div>
    </Card>
  );
};

export default UnifiedSidebar;
