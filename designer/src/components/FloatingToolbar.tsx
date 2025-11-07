import React, { useState, useCallback, useEffect, useRef } from 'react';
import { apiGet, apiPost, apiDelete, getUserIdFromToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Type,
  Bold,
  Italic,
  Underline,
  Pipette,
  ArrowUp,
  ArrowDown,
  Minus,
  Image,
  Upload,
  Move,
  Maximize2,
  MoveVertical,
  MoveHorizontal
} from 'lucide-react';
import { IconPicker } from './IconPicker';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { KeycapLayer } from '@/types/keyboard';

interface FloatingToolbarProps {
  selectedColor: string;
  selectedTextColor: string;
  onColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onColorCommit?: (color: string) => void;
  onTextColorCommit?: (color: string) => void;
  selectedKeysCount: number;
  editingKey: any;
  selectedKeys: any[];
  selectedLayer: KeycapLayer | null;
  selectedLayerIds?: string[];
  getKeyLayers?: (keyId: string) => KeycapLayer[];
  onLayerUpdate: (keyId: string, layerId: string, updates: Partial<KeycapLayer>) => void;
  onLegendChange: (keyId: string, layerId: string, content: string) => void;
  onMultiLayerUpdate: (keyIds: string[], layerId: string, updates: Partial<KeycapLayer>) => void;
  onAddLayer: (keyId: string, type: 'text' | 'image' | 'icon') => string;
  onBatchLayerUpdates?: (items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }>) => void;
  onBatchStart?: () => void;
  onBatchEnd?: () => void;
  toolbarSettings?: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number };
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  selectedColor,
  selectedTextColor,
  onColorChange,
  onTextColorChange,
  selectedKeysCount,
  editingKey,
  selectedKeys,
  selectedLayer,
  selectedLayerIds = [],
  getKeyLayers,
  onLayerUpdate,
  onLegendChange,
  onMultiLayerUpdate,
  onAddLayer,
  onBatchLayerUpdates,
  onBatchStart,
  onBatchEnd,
  onColorCommit,
  onTextColorCommit,
  toolbarSettings,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [showTextInput, setShowTextInput] = useState(false);
  
  // Load saved colors from database on mount
  useEffect(() => {
    const loadSavedColors = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      
      try {
        const res = await apiGet(`/api/saved-colors?userId=${userId}`);
        if (res.success && Array.isArray(res.data)) {
          setSavedColors(res.data);
        }
      } catch (error) {
        console.error('Failed to load saved colors:', error);
      }
    };
    
    loadSavedColors();
  }, []);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showXSlider, setShowXSlider] = useState(false);
  const [showYSlider, setShowYSlider] = useState(false);
  const [showRotSlider, setShowRotSlider] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  // Local color state to avoid committing on each drag
  const [localKeycapColor, setLocalKeycapColor] = useState<string | null>(null);
  const [localLegendColor, setLocalLegendColor] = useState<string | null>(null);
  
  // Refs for click outside detection
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  // Local state for sliders to prevent re-renders during dragging
  const [localPositionX, setLocalPositionX] = useState([0]);
  const [localPositionY, setLocalPositionY] = useState([0]);
  const [localRotation, setLocalRotation] = useState([0]);
  const [localFontSize, setLocalFontSize] = useState([14]);
  
  // Local state for text input
  const [localTextValue, setLocalTextValue] = useState('');

  // Helper function to determine if we're in multiselect mode
  const isMultiselect = selectedKeysCount > 1;

  // Sync local state with selectedLayer when it changes
  useEffect(() => {
    if (selectedLayer) {
      setLocalPositionX([selectedLayer.offsetX || 0]);
      setLocalPositionY([selectedLayer.offsetY || 0]);
      setLocalRotation([selectedLayer.rotation || 0]);
      setLocalFontSize([selectedLayer.fontSize || 14]);
    }
  }, [selectedLayer]);

  // Initialize text value when text input panel opens
  useEffect(() => {
    if (showTextInput) {
      if (isMultiselect) {
        // For multiselect, start with empty value
        setLocalTextValue('');
      } else if (selectedLayer) {
        // For single select, show current layer content
        setLocalTextValue(selectedLayer.content || '');
      } else {
        setLocalTextValue('');
      }
    }
  }, [showTextInput, isMultiselect, selectedLayer]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        if (showColorPicker) {
          onBatchEnd && onBatchEnd();
        }
        setShowColorPicker(false);
        setShowTextInput(false);
        setShowImageUpload(false);
        setShowXSlider(false);
        setShowYSlider(false);
        setShowRotSlider(false);
        setShowSizeSlider(false);
        setShowIconPicker(false);
        // Clear text input when panel closes
        setLocalTextValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Georgia',
    'Palatino',
    'Garamond',
    'Comic Sans MS',
    'Impact',
    'Lucida Console',
    'Tahoma'
  ];

  const presetColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#808080', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
  ];

  // Dynamic inner area for sliders based on selected key size (full innerSquare coverage)
  const unitPx = 48;
  const targetKeyForBounds = isMultiselect ? selectedKeys?.[0] : editingKey;
  const innerWidthPx = targetKeyForBounds ? (targetKeyForBounds.width || 1) * unitPx - 12 : unitPx - 12;
  const innerHeightPx = targetKeyForBounds ? (targetKeyForBounds.height || 1) * unitPx - 12 : unitPx - 12;
  
  // Helper function to get the target keys for operations
  const getTargetKeys = () => {
    if (isMultiselect) {
      return selectedKeys;
    }
    return editingKey ? [editingKey] : [];
  };
  
  // Helper function to ensure all keys have at least one layer
  const ensureLayersExist = (targetKeys: any[], layerType: 'text' | 'image' | 'icon' = 'text') => {
    targetKeys.forEach(key => {
      const layers = key.layers || [];
      if (layers.length === 0) {
        // Create a new layer for keys that don't have any layers
        onAddLayer(key.id, layerType);
      }
    });
  };

  // Helper function to apply updates to multiple keys
  const applyToMultipleKeys = (updates: Partial<KeycapLayer>) => {
    const targetKeys = getTargetKeys();
    if (targetKeys.length === 0) return;
    
    if (isMultiselect) {
      const items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> = [];
      
      // If selectedLayerIds is provided and has items, only update those specific layers
      if (selectedLayerIds.length > 0 && getKeyLayers) {
        targetKeys.forEach(key => {
          const layers = getKeyLayers(key.id);
          layers.forEach(layer => {
            if (selectedLayerIds.includes(layer.id)) {
              items.push({ keyId: key.id, layerId: layer.id, updates });
            }
          });
        });
      } else {
        // Fallback: update first layer of each key (old behavior)
      targetKeys.forEach(key => {
        const layers = key.layers || [];
        if (layers.length > 0) {
          items.push({ keyId: key.id, layerId: layers[0].id, updates });
        }
      });
      }
      
      if (items.length > 0) {
        if (onBatchLayerUpdates) onBatchLayerUpdates(items);
        else items.forEach(it => onLayerUpdate(it.keyId, it.layerId, updates));
      }
    } else if (editingKey && selectedLayer) {
      onLayerUpdate(editingKey.id, selectedLayer.id, updates);
    }
  };


  // Debounced update to parent component
  useEffect(() => {
    if (editingKey && selectedLayer && onLayerUpdate) {
      const timeoutId = setTimeout(() => {
        const updates: Partial<KeycapLayer> = {
          offsetX: localPositionX[0],
          offsetY: localPositionY[0],
          rotation: localRotation[0],
        };
        
        // Only include font size if the layer already has a font size set or if it's been manually changed
        if (selectedLayer.fontSize !== undefined || localFontSize[0] !== 14) {
          updates.fontSize = localFontSize[0];
        }
        
        onLayerUpdate(editingKey.id, selectedLayer.id, updates);
      }, 10); // Small delay to prevent excessive updates
      return () => clearTimeout(timeoutId);
    }
  }, [localPositionX, localPositionY, localRotation, localFontSize, editingKey, selectedLayer, onLayerUpdate]);

  const startEyedropper = useCallback(async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        onColorChange(result.sRGBHex);
      } catch (err) {
        console.log('EyeDropper failed:', err);
      }
    }
  }, [onColorChange]);

  const handleAlignmentChange = useCallback((alignment: 'left' | 'center' | 'right') => {
    applyToMultipleKeys({ alignment });
  }, [applyToMultipleKeys]);

  const handleVerticalAlignmentChange = useCallback((alignment: 'top' | 'center' | 'bottom') => {
    applyToMultipleKeys({ verticalAlignment: alignment });
  }, [applyToMultipleKeys]);

  const handleMirrorChange = useCallback((axis: 'X' | 'Y', value: boolean) => {
    applyToMultipleKeys({ [`mirror${axis}`]: value });
  }, [applyToMultipleKeys]);

  const handleFontChange = useCallback((font: string) => {
    applyToMultipleKeys({ font });
  }, [applyToMultipleKeys]);

  const handlePositionXChange = useCallback((value: number[]) => {
    setLocalPositionX(value);
    applyToMultipleKeys({ offsetX: value[0] });
  }, [applyToMultipleKeys]);

  const handlePositionYChange = useCallback((value: number[]) => {
    setLocalPositionY(value);
    applyToMultipleKeys({ offsetY: value[0] });
  }, [applyToMultipleKeys]);

  const handleRotationChange = useCallback((value: number[]) => {
    setLocalRotation(value);
    applyToMultipleKeys({ rotation: value[0] });
  }, [applyToMultipleKeys]);

  const handleFontSizeChange = useCallback((value: number[]) => {
    setLocalFontSize(value);
  }, []);

  const handleTextStyleChange = useCallback((style: 'bold' | 'italic' | 'underline') => {
    const currentStyle = selectedLayer?.[style] || false;
    applyToMultipleKeys({ [style]: !currentStyle });
  }, [applyToMultipleKeys, selectedLayer]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const targetKeys = getTargetKeys();
          if (isMultiselect) {
            // Ensure all keys have image layers before applying changes
            ensureLayersExist(targetKeys, 'image');
            const updates = { 
              content: event.target.result as string,
              type: 'image' as const
            };
            applyToMultipleKeys(updates);
          } else {
            const updates = { 
              content: event.target.result as string,
              type: 'image' as const
            };
            applyToMultipleKeys(updates);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }, [applyToMultipleKeys, isMultiselect, getTargetKeys, ensureLayersExist]);

  // Show toolbar even when no key is selected (for layout changes, etc.)
  // if (selectedKeysCount === 0) return null;

  const toolbarStyle = toolbarSettings?.mode === 'default' 
    ? { backgroundColor: 'hsl(var(--card))' } 
    : toolbarSettings?.mode === 'solid' && toolbarSettings?.solid
    ? { backgroundColor: toolbarSettings.solid }
    : toolbarSettings?.mode === 'gradient' && toolbarSettings?.from && toolbarSettings?.to
    ? { 
        background: `linear-gradient(${toolbarSettings.angle || 135}deg, ${toolbarSettings.from}, ${toolbarSettings.to})`
      }
    : { backgroundColor: 'hsl(var(--card))' };

  return (
    <div className="w-fit mx-auto" ref={toolbarRef}>
      <div className="border border-border rounded-lg shadow-elevated p-2 sm:p-3" style={toolbarStyle}>
        {/* Main Toolbar Row - Responsive Layout */}
        <div className="flex items-center justify-start gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Color Section */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <Label className="text-xs font-medium text-foreground hidden sm:block">Color</Label>
            <div className="flex items-center gap-1.5 relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextOpen = !showColorPicker;
                  // Begin batch on open, end batch on close
                  if (nextOpen) { onBatchStart && onBatchStart(); } else { onBatchEnd && onBatchEnd(); }
                  setShowColorPicker(nextOpen);
                  if (nextOpen) {
                    // initialize local colors
                    setLocalKeycapColor(selectedColor);
                    setLocalLegendColor(selectedTextColor);
                  } else {
                    setLocalKeycapColor(null);
                    setLocalLegendColor(null);
                  }
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowXSlider(false);
                  setShowYSlider(false);
                  setShowRotSlider(false);
                  setShowSizeSlider(false);
                }}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              {showColorPicker && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 w-auto inline-block">
                  {/* Side-by-side color pickers */}
                  <div className="flex items-start gap-2 mb-3">
                    {/* Keycap */}
                    <div className="space-y-1">
                      <Label className="block text-xs font-medium text-foreground mb-1">Keycap</Label>
                      <div className="relative inline-block">
                        <Input
                          type="color"
                          value={localKeycapColor ?? selectedColor}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLocalKeycapColor(v);
                            onColorChange(v);
                          }}
                          onPointerUp={() => { if (localKeycapColor) { onColorCommit && onColorCommit(localKeycapColor); } }}
                          onBlur={() => { if (localKeycapColor) { onColorCommit && onColorCommit(localKeycapColor); } }}
                          className="w-14 h-12 p-1 border-border bg-background"
                        />
                        <button
                          className="absolute -top-1 -right-1 h-3 w-3 rounded bg-card border border-border text-[9px] leading-3 flex items-center justify-center hover:bg-muted"
                          onClick={async () => {
                            const userId = getUserIdFromToken();
                            if (!userId) return;
                            
                            if (savedColors.includes(selectedColor)) return;
                            
                            try {
                              await apiPost('/api/saved-colors', {
                                userId,
                                color: selectedColor
                              });
                              setSavedColors([...savedColors, selectedColor]);
                            } catch (error) {
                              console.error('Failed to save color:', error);
                            }
                          }}
                          title="Save color"
                          aria-label="Save keycap color"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="space-y-1">
                      <Label className="block text-xs font-medium text-foreground mb-1">Legend</Label>
                      <div className="relative inline-block">
                        <Input
                          type="color"
                          value={localLegendColor ?? selectedTextColor}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLocalLegendColor(v);
                            onTextColorChange(v);
                            // Also commit immediately for color inputs
                            if (v && onTextColorCommit) {
                              onTextColorCommit(v);
                            }
                          }}
                          onPointerUp={(e) => { 
                            const colorToCommit = (e.target as HTMLInputElement).value;
                            setLocalLegendColor(colorToCommit);
                            if (colorToCommit && onTextColorCommit) { 
                              onTextColorCommit(colorToCommit); 
                            } 
                          }}
                          onBlur={(e) => { 
                            const colorToCommit = (e.target as HTMLInputElement).value;
                            setLocalLegendColor(colorToCommit);
                            if (colorToCommit && onTextColorCommit) { 
                              onTextColorCommit(colorToCommit); 
                            } 
                          }}
                          className="w-14 h-12 p-1 border-border bg-background"
                        />
                        <button
                          className="absolute -top-1 -right-1 h-3 w-3 rounded bg-card border border-border text-[9px] leading-3 flex items-center justify-center hover:bg-muted"
                          onClick={async () => {
                            const userId = getUserIdFromToken();
                            if (!userId) return;
                            
                            if (savedColors.includes(selectedTextColor)) return;
                            
                            try {
                              await apiPost('/api/saved-colors', {
                                userId,
                                color: selectedTextColor
                              });
                              setSavedColors([...savedColors, selectedTextColor]);
                            } catch (error) {
                              console.error('Failed to save color:', error);
                            }
                          }}
                          title="Save color"
                          aria-label="Save legend color"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Saved colors grid: rows of 8, '+' on empty slots, '×' to delete */}
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Saved colors</Label>
                    {(() => {
                      const count = savedColors.length <= 6 ? 6 : Math.ceil(savedColors.length / 8) * 8;
                      const cells = Array.from({ length: count }, (_, i) => i);
                      const perRow = count <= 6 ? 3 : 8;
                      const rows: number[][] = [];
                      for (let i = 0; i < cells.length; i += perRow) {
                        rows.push(cells.slice(i, i + perRow));
                      }
                      return (
                        <div className="space-y-0">
                          {rows.map((row, rIdx) => (
                            <div key={rIdx} className="flex gap-2">
                              {row.map((i) => {
                                const color = savedColors[i];
                                if (color) {
                                  return (
                                    <div key={i} className="relative">
                                      <button
                                        className="h-8 w-8 p-0 m-0 rounded-none border-0"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                          onColorChange(color);
                                          onColorCommit && onColorCommit(color);
                                        }}
                                        title={color}
                                      />
                                      <button
                                        className="absolute -top-1 -right-1 h-3 w-3 rounded bg-card border border-border text-[9px] leading-3 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={async () => {
                                          const userId = getUserIdFromToken();
                                          if (!userId) return;
                                          
                                          try {
                                            await apiDelete('/api/saved-colors', {
                                              userId,
                                              color
                                            });
                                            setSavedColors(savedColors.filter((_, idx) => idx !== i));
                                          } catch (error) {
                                            console.error('Failed to delete color:', error);
                                          }
                                        }}
                                        aria-label="Remove saved color"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  );
                                }
                                return (
                                  <button
                                    key={i}
                                    className="h-8 w-8 p-0 m-0 rounded-none border border-dashed border-border text-[9px] text-muted-foreground hover:bg-muted/40"
                                    onClick={async () => {
                                      const userId = getUserIdFromToken();
                                      if (!userId) return;
                                      
                                      if (savedColors.includes(selectedColor)) return;
                                      
                                      try {
                                        await apiPost('/api/saved-colors', {
                                          userId,
                                          color: selectedColor
                                        });
                                      const next = [...savedColors];
                                      next[i] = selectedColor;
                                      setSavedColors(next);
                                      } catch (error) {
                                        console.error('Failed to save color:', error);
                                      }
                                    }}
                                    title="Save to this slot"
                                  >
                                    +
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-border" />

          {/* Aligning, Positioning & Sizing Section */}
          <div className="flex flex-col items-center gap-1.5 relative flex-shrink-0">
            <Label className="text-xs font-medium text-foreground hidden sm:block">
              {isMultiselect ? `Multi-Select (${selectedKeysCount}) - First Layer` : 'Align & Position'}
            </Label>
            <div className="flex gap-1 flex-wrap sm:flex-nowrap">
              {/* Horizontal Alignment */}
              {(['left', 'center', 'right'] as const).map((align) => (
                <Button
                  key={align}
                  variant={selectedLayer?.alignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAlignmentChange(align)}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
                >
                  {align === 'left' && <AlignLeft className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />}
                  {align === 'center' && <AlignCenter className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />}
                  {align === 'right' && <AlignRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />}
                </Button>
              ))}
              
              {/* Vertical Alignment */}
              {(['top', 'center', 'bottom'] as const).map((align) => (
                <Button
                  key={align}
                  variant={selectedLayer?.verticalAlignment === align ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVerticalAlignmentChange(align)}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
                >
                  {align === 'top' && <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />}
                  {align === 'center' && <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />}
                  {align === 'bottom' && <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />}
                </Button>
              ))}
              
              {/* Transform Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotationChange([(selectedLayer?.rotation || 0) + 90])}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <RotateCw className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              <Button
                variant={selectedLayer?.mirrorX ? "default" : "outline"}
                size="sm"
                onClick={() => handleMirrorChange('X', !selectedLayer?.mirrorX)}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <FlipHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              <Button
                variant={selectedLayer?.mirrorY ? "default" : "outline"}
                size="sm"
                onClick={() => handleMirrorChange('Y', !selectedLayer?.mirrorY)}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <FlipVertical className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              
              {/* Position Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowXSlider(!showXSlider);
                  setShowYSlider(false);
                  setShowRotSlider(false);
                  setShowColorPicker(false);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowSizeSlider(false);
                }}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <MoveHorizontal className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowYSlider(!showYSlider);
                  setShowXSlider(false);
                  setShowRotSlider(false);
                  setShowColorPicker(false);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowSizeSlider(false);
                }}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <MoveVertical className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRotSlider(!showRotSlider);
                  setShowXSlider(false);
                  setShowYSlider(false);
                  setShowColorPicker(false);
                  setShowTextInput(false);
                  setShowImageUpload(false);
                  setShowSizeSlider(false);
                }}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
              >
                <RotateCw className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
              </Button>
            </div>
            
            {/* Individual Slider Panels */}
            {showXSlider && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground">X Position: {localPositionX[0].toFixed(1)}</Label>
                  <Slider
                    value={localPositionX}
                    onValueChange={handlePositionXChange}
                    max={Math.round(innerWidthPx)}
                    min={-Math.round(innerWidthPx)}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            
            {showYSlider && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground">Y Position: {localPositionY[0].toFixed(1)}</Label>
                  <Slider
                    value={localPositionY}
                    onValueChange={handlePositionYChange}
                    max={Math.round(innerHeightPx)}
                    min={-Math.round(innerHeightPx)}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            {showRotSlider && (
              <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                <div className="space-y-1">
                  <Label className="text-xs text-foreground">Rotation: {localRotation[0].toFixed(0)}°</Label>
                  <Slider
                    value={localRotation}
                    onValueChange={handleRotationChange}
                    max={180}
                    min={-180}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vertical Separator */}
          <div className="h-6 w-px bg-border" />

          {/* Text Section */}
            <div className="flex flex-col items-center gap-1.5 relative flex-shrink-0">
              <Label className="text-xs font-medium text-foreground hidden sm:block">Text</Label>
            <div className="flex flex-col gap-1.5">
              {/* Main Controls Row */}
              <div className="flex gap-1 items-center flex-wrap sm:flex-nowrap">
                {/* Font Selection */}
                <Select value={selectedLayer?.font || 'Arial'} onValueChange={handleFontChange}>
                  <SelectTrigger className="w-28 sm:w-32 h-9 text-xs border-border bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font} className="text-xs text-foreground">
                        <span style={{ fontFamily: font }}>{font}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Text Style Buttons */}
                <Button
                  variant={selectedLayer?.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('bold')}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-sm font-bold border-border hover:bg-muted"
                >
                  B
                </Button>
                <Button
                  variant={selectedLayer?.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('italic')}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-sm italic border-border hover:bg-muted"
                >
                  I
                </Button>
                <Button
                  variant={selectedLayer?.underline ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTextStyleChange('underline')}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-sm underline border-border hover:bg-muted"
                >
                  U
                </Button>
                
                {/* Size Control */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSizeSlider(!showSizeSlider);
                    setShowTextInput(false);
                    setShowImageUpload(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                  }}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
                >
                  <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </Button>
                
                {/* Text Mode Button */}
                <Button
                  variant={selectedLayer?.type !== 'image' ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    applyToMultipleKeys({ type: 'text' });
                    setShowTextInput(!showTextInput);
                    setShowImageUpload(false);
                    setShowSizeSlider(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                  }}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
                >
                  <Type className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </Button>
                
                {/* Image Mode Button */}
                <Button
                  variant={showImageUpload ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    // Don't change layer type immediately - only when image is uploaded
                    setShowImageUpload(!showImageUpload);
                    setShowTextInput(false);
                    setShowSizeSlider(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                    setShowIconPicker(false);
                  }}
                  className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
                >
                  <Image className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                </Button>

                {/* Icon Mode Dropdown */}
                <Popover open={showIconPicker} onOpenChange={(o) => {
                  setShowIconPicker(o);
                  if (o) {
                    setShowTextInput(false);
                    setShowImageUpload(false);
                    setShowSizeSlider(false);
                    setShowColorPicker(false);
                    setShowXSlider(false);
                    setShowYSlider(false);
                    setShowRotSlider(false);
                    applyToMultipleKeys({ type: 'icon' });
                  }
                }}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={showIconPicker ? "default" : "outline"}
                      size="sm"
                      className="h-9 w-9 sm:h-10 sm:w-10 p-0 border-border hover:bg-muted"
                    >
                      <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[740px]" align="start">
                    <IconPicker
                      variant="dropdown"
                      onIconSelect={(iconName, iconType) => {
                        const targetKeys = getTargetKeys();
                        const content = `${iconType || 'solid'}:${iconName}`;
                        if (targetKeys.length > 0) {
                          if (isMultiselect) {
                            ensureLayersExist(targetKeys, 'icon');
                            const items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> = [];
                            
                            // If selectedLayerIds is provided and has items, only update those specific layers
                            if (selectedLayerIds.length > 0 && getKeyLayers) {
                              targetKeys.forEach(key => {
                                const layers = getKeyLayers(key.id);
                                layers.forEach(layer => {
                                  if (selectedLayerIds.includes(layer.id)) {
                                    items.push({ keyId: key.id, layerId: layer.id, updates: { content } });
                                  }
                                });
                              });
                            } else {
                              // Fallback: update first layer of each key (old behavior)
                            targetKeys.forEach(key => {
                              const layers = key.layers || [];
                              if (layers.length > 0) {
                                items.push({ keyId: key.id, layerId: layers[0].id, updates: { content } });
                              }
                            });
                            }
                            
                            if (onBatchLayerUpdates) onBatchLayerUpdates(items);
                            else items.forEach(it => onLayerUpdate(it.keyId, it.layerId, { content }));
                          } else if (editingKey && selectedLayer) {
                            onLegendChange(editingKey.id, selectedLayer.id, content);
                          }
                        }
                        setShowIconPicker(false);
                      }}
                      onClose={() => setShowIconPicker(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Text Input Panel */}
              {showTextInput && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[250px]">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Text Input</Label>
                    <Input
                      value={localTextValue}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setLocalTextValue(newValue);
                        
                        const targetKeys = getTargetKeys();
                        if (targetKeys.length > 0) {
                          if (isMultiselect) {
                            ensureLayersExist(targetKeys, 'text');
                            const items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> = [];
                            
                            // If selectedLayerIds is provided and has items, only update those specific layers
                            if (selectedLayerIds.length > 0 && getKeyLayers) {
                              targetKeys.forEach(key => {
                                const layers = getKeyLayers(key.id);
                                layers.forEach(layer => {
                                  if (selectedLayerIds.includes(layer.id)) {
                                    items.push({ keyId: key.id, layerId: layer.id, updates: { content: newValue } });
                                  }
                                });
                              });
                            } else {
                              // Fallback: update first layer of each key (old behavior)
                            targetKeys.forEach(key => {
                              const layers = key.layers || [];
                              if (layers.length > 0) {
                                items.push({ keyId: key.id, layerId: layers[0].id, updates: { content: newValue } });
                              }
                            });
                            }
                            
                            if (onBatchLayerUpdates) onBatchLayerUpdates(items);
                            else items.forEach(it => onLayerUpdate(it.keyId, it.layerId, { content: newValue }));
                          } else if (editingKey && selectedLayer) {
                            onLegendChange(editingKey.id, selectedLayer.id, newValue);
                          }
                        }
                      }}
                      placeholder={isMultiselect ? "Enter text for all selected keys..." : "Enter key text..."}
                      className="h-6 text-xs border-border bg-background text-foreground"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              
              {/* Image Upload Panel */}
              {showImageUpload && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[250px]">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Image Upload</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer flex items-center gap-1 h-6 px-2 border border-border rounded-md bg-background hover:bg-muted text-xs text-foreground">
                      <Upload className="h-3 w-3" /> Upload Image
                    </Label>
                    {selectedLayer?.content && selectedLayer?.type === 'image' && selectedLayer.content.trim() !== '' && (
                      <div className="mt-1">
                        <img src={selectedLayer.content} alt="Preview" className="w-12 h-12 object-contain border border-border rounded" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Icon Picker Panel */}
              {showIconPicker && (
                <div className="absolute top-full mt-1 left-0 z-50">
                  <IconPicker
                    onIconSelect={(iconName) => {
                      const targetKeys = getTargetKeys();
                      if (targetKeys.length > 0) {
                        if (isMultiselect) {
                          // Ensure all keys have icon layers before applying changes
                          ensureLayersExist(targetKeys, 'icon');
                          targetKeys.forEach(key => {
                            const layers = key.layers || [];
                            if (layers.length > 0) {
                              onLegendChange(key.id, layers[0].id, iconName);
                            }
                          });
                        } else if (editingKey && selectedLayer) {
                          onLegendChange(editingKey.id, selectedLayer.id, iconName);
                        }
                      }
                      setShowIconPicker(false);
                    }}
                    onClose={() => setShowIconPicker(false)}
                  />
                </div>
              )}
              
              {/* Size Slider Panel */}
              {showSizeSlider && (
                <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-elevated p-3 z-50 min-w-[180px]">
                  <div className="space-y-1">
                    <Label className="text-xs text-foreground">Font Size: {localFontSize[0].toFixed(1)}px</Label>
                    <Slider
                      value={localFontSize}
                      onValueChange={handleFontSizeChange}
                      max={24}
                      min={8}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FloatingToolbar;