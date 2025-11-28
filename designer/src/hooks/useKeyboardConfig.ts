import { useState, useCallback } from 'react';
import { KeyboardConfig, LayoutType, KeycapLayer, LayoutStandard } from '@/types/keyboard';
import { keyboardLayouts } from '@/data/layouts';
import { useLayerManagement } from './useLayerManagement';
import { ThemeType, getTheme, interpolateColor, calculatePositionFactor } from '@/data/themes';

export const useKeyboardConfig = () => {
  const [config, setConfig] = useState<KeyboardConfig>({
    layout: keyboardLayouts['60%-ANSI'] || keyboardLayouts['60%'] || Object.values(keyboardLayouts)[0],
    globalSettings: {
      theme: 'dark',
      font: 'Arial',
    },
    selectedKeys: [],
    groups: {},
    allLayouts: { ...keyboardLayouts },
    currentLayoutType: '60%',
    layoutStandard: 'ANSI',
    currentTheme: 'none',
  });

  // History stacks for undo/redo
  const [past, setPast] = useState<KeyboardConfig[]>([]);
  const [future, setFuture] = useState<KeyboardConfig[]>([]);
  const [batchActive, setBatchActive] = useState<boolean>(false);
  const [pendingSnapshot, setPendingSnapshot] = useState<KeyboardConfig | null>(null);

  const [editingKeyId, setEditingKeyId] = useState<string | null>(null);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  // SVG is now the only rendering mode; toggle removed

  // A setter that records history for any actual state change
  const setConfigWithHistory = useCallback((updater: React.SetStateAction<KeyboardConfig>) => {
    setConfig(prev => {
      const next = typeof updater === 'function' ? (updater as (p: KeyboardConfig) => KeyboardConfig)(prev) : updater;
      // Only record when reference actually changes
      if (next !== prev) {
        if (batchActive) {
          if (pendingSnapshot === null) {
            setPendingSnapshot(JSON.parse(JSON.stringify(prev)) as KeyboardConfig);
          }
        } else {
          const snapshot: KeyboardConfig = JSON.parse(JSON.stringify(prev));
          setPast(p => {
            const updated = [...p, snapshot];
            return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
          });
          setFuture([]);
        }
      }
      return next;
    });
  }, [batchActive, pendingSnapshot]);

  const beginBatch = useCallback(() => {
    setBatchActive(true);
    setPendingSnapshot(null);
  }, []);

  const endBatch = useCallback(() => {
    setBatchActive(false);
    if (pendingSnapshot) {
      setPast(p => {
        const updated = [...p, pendingSnapshot];
        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
      });
      setFuture([]);
      setPendingSnapshot(null);
    }
  }, [pendingSnapshot]);

  const { addLayer: originalAddLayer, deleteLayer: originalDeleteLayer, reorderLayer: originalReorderLayer, updateLayer: originalUpdateLayer } = useLayerManagement(config, setConfigWithHistory);

  // recordChange is no longer needed because setConfigWithHistory handles it centrally

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setFuture(f => [...f, JSON.parse(JSON.stringify(config)) as KeyboardConfig]);
    setPast(p => p.slice(0, p.length - 1));
    // Restore snapshot while preserving current selection
    setConfig(current => ({ ...previous, selectedKeys: current.selectedKeys } as KeyboardConfig));
  }, [past, config]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const nextFromFuture = future[future.length - 1];
    setPast(p => [...p, JSON.parse(JSON.stringify(config)) as KeyboardConfig]);
    setFuture(f => f.slice(0, f.length - 1));
    // Restore snapshot while preserving current selection
    setConfig(current => ({ ...nextFromFuture, selectedKeys: current.selectedKeys } as KeyboardConfig));
  }, [future, config]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  // Override addLayer to automatically select the new layer
  const addLayer = useCallback((keyId: string, type: 'text' | 'image' | 'icon') => {
    const newLayerId = originalAddLayer(keyId, type);
    setSelectedLayerId(newLayerId);
    return newLayerId;
  }, [originalAddLayer]);

  const updateLayer = useCallback((keyId: string, layerId: string, updates: Partial<KeycapLayer>) => {
    originalUpdateLayer(keyId, layerId, updates);
  }, [originalUpdateLayer]);

  const deleteLayer = useCallback((keyId: string, layerId: string) => {
    originalDeleteLayer(keyId, layerId);
  }, [originalDeleteLayer]);

  const reorderLayer = useCallback((keyId: string, layerId: string, direction: 'up' | 'down') => {
    originalReorderLayer(keyId, layerId, direction);
  }, [originalReorderLayer]);

  const changeLayout = useCallback((layoutType: LayoutType) => {
    setConfigWithHistory(prev => {
      const key = `${layoutType}-${prev.layoutStandard}`;
      const existing = prev.allLayouts[key] || prev.allLayouts[layoutType] || keyboardLayouts[key] || keyboardLayouts[layoutType];
      return {
        ...prev,
        layout: existing,
        currentLayoutType: layoutType,
        selectedKeys: [],
        allLayouts: {
          ...prev.allLayouts,
          [key]: existing,
        },
      };
    });
  }, []);

  const setLayoutStandard = useCallback((standard: LayoutStandard) => {
    setConfigWithHistory(prev => {
      const key = `${prev.currentLayoutType}-${standard}`;
      const nextLayout = prev.allLayouts[key] || keyboardLayouts[key] || prev.layout;
      return {
        ...prev,
        layoutStandard: standard,
        layout: nextLayout,
        selectedKeys: [],
        allLayouts: {
          ...prev.allLayouts,
          [key]: nextLayout,
        },
      };
    });
  }, []);

  const selectKey = useCallback((keyId: string, multiSelect = false) => {
    setConfig(prev => ({
      ...prev,
      selectedKeys: multiSelect
        ? prev.selectedKeys.includes(keyId)
          ? prev.selectedKeys.filter(id => id !== keyId)
          : [...prev.selectedKeys, keyId]
        : [keyId],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      selectedKeys: [],
    }));
  }, []);

  const updateKeycapColor = useCallback((keyIds: string[], color: string) => {
    setConfigWithHistory(prev => {
      const updatedKeys = prev.layout.keys.map(key =>
        keyIds.includes(key.id) ? { ...key, color } : key
      );
      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: updatedLayout,
        },
      };
    });
  }, []);

  const updateKeycapTextColor = useCallback((keyIds: string[], textColor: string) => {
    setConfigWithHistory(prev => {
      const updatedKeys = prev.layout.keys.map(key =>
        keyIds.includes(key.id) ? { ...key, textColor } : key
      );
      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: updatedLayout,
        },
      };
    });
  }, []);

  // Preview (no-history) updates used for live dragging in color pickers
  const previewKeycapColor = useCallback((keyIds: string[], color: string) => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key =>
        keyIds.includes(key.id) ? { ...key, color } : key
      );
      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: updatedLayout,
        },
      };
    });
  }, []);

  const previewKeycapTextColor = useCallback((keyIds: string[], textColor: string) => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key =>
        keyIds.includes(key.id) ? { ...key, textColor } : key
      );
      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: updatedLayout,
        },
      };
    });
  }, []);

  const getKeyLayers = useCallback((keyId: string): KeycapLayer[] => {
    const key = config.layout.keys.find(k => k.id === keyId);
    return key?.layers || [];
  }, [config.layout.keys]);

  const selectLayer = useCallback((layerId: string | null) => {
    setSelectedLayerId(layerId);
  }, []);

  const startEditingKey = useCallback((keyId: string) => {
    setEditingKeyId(keyId);
  }, []);

  const stopEditingKey = useCallback(() => {
    setEditingKeyId(null);
  }, []);

  const getSelectedKey = useCallback(() => {
    if (editingKeyId) {
      return config.layout.keys.find(key => key.id === editingKeyId);
    }
    return null;
  }, [config.layout.keys, editingKeyId]);

  const getSelectedKeys = useCallback(() => {
    return config.layout.keys.filter(key => config.selectedKeys.includes(key.id));
  }, [config.layout.keys, config.selectedKeys]);

  const selectKeys = useCallback((keyIds: string[]) => {
    setConfig(prev => ({
      ...prev,
      selectedKeys: keyIds,
    }));
  }, []);

  const saveGroup = useCallback((groupName: string, keyIds: string[]) => {
    setConfigWithHistory(prev => ({
      ...prev,
      groups: {
        ...prev.groups,
        [groupName]: keyIds,
      },
    }));
  }, []);

  const loadGroup = useCallback((groupName: string) => {
    const groupKeys = config.groups[groupName];
    if (groupKeys) {
      selectKeys(groupKeys);
    }
  }, [config.groups, selectKeys]);

  const deleteGroup = useCallback((groupName: string) => {
    setConfigWithHistory(prev => {
      const newGroups = { ...prev.groups };
      delete newGroups[groupName];
      return {
        ...prev,
        groups: newGroups,
      };
    });
  }, []);

  const renameGroup = useCallback((oldName: string, newName: string) => {
    if (oldName === newName || !newName.trim()) return;
    setConfigWithHistory(prev => {
      const newGroups = { ...prev.groups };
      if (newGroups[oldName]) {
        newGroups[newName.trim()] = newGroups[oldName];
        delete newGroups[oldName];
      }
      return {
        ...prev,
        groups: newGroups,
      };
    });
  }, []);

  const resetLayout = useCallback(() => {
    setConfigWithHistory(prev => {
      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      const originalLayout = keyboardLayouts[currentLayoutKey] || keyboardLayouts[prev.currentLayoutType] || keyboardLayouts['60%-ANSI'];
      
      return {
        ...prev,
        layout: originalLayout,
        selectedKeys: [],
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: originalLayout,
        },
      };
    });
    setEditingKeyId(null);
    setSelectedLayerId(null);
  }, []);

  const applyTheme = useCallback((themeId: ThemeType) => {
    const theme = getTheme(themeId);
    if (!theme) return;

    setConfigWithHistory(prev => {
      const layout = { ...prev.layout };
      // Start with empty groups - clear previous theme groups
      const newGroups: Record<string, string[]> = {};
      
      if (theme.type === 'solid') {
        // Solid theme: tüm tuşlara aynı renk
        layout.keys = layout.keys.map(key => ({
          ...key,
          color: theme.colors.start,
          textColor: theme.textColor || key.textColor,
        }));
      } else if (theme.type === 'gradient') {
        if (theme.mode === 'global') {
          // Global gradient: gradyan yönüne göre gruplar oluştur ve grup bazlı renk uygula
          // direction: 'horizontal' -> sıralar (rows), 'vertical' -> sütunlar (columns)
          const direction = theme.colors.direction || 'horizontal';
          if (direction === 'horizontal') {
            // Group by row index (y)
            const rowMap = new Map<number, string[]>();
            layout.keys.forEach(k => {
              const y = Math.round(k.y);
              const arr = rowMap.get(y) || [];
              arr.push(k.id);
              rowMap.set(y, arr);
            });
            const rows = Array.from(rowMap.keys()).sort((a,b) => a-b);
            rows.forEach((rowIdx, i) => {
              const t = rows.length <= 1 ? 0 : i / (rows.length - 1);
              const color = interpolateColor(theme.colors.start, theme.colors.end, t);
              const ids = rowMap.get(rowIdx) || [];
              layout.keys = layout.keys.map(k => ids.includes(k.id) ? { ...k, color, textColor: theme.textColor || k.textColor } : k);
              newGroups[`Gradient-H-${i+1}`] = ids;
            });
          } else {
            // Group by column index (x)
            const colMap = new Map<number, string[]>();
            layout.keys.forEach(k => {
              const x = Math.round(k.x);
              const arr = colMap.get(x) || [];
              arr.push(k.id);
              colMap.set(x, arr);
            });
            const cols = Array.from(colMap.keys()).sort((a,b) => a-b);
            cols.forEach((colIdx, i) => {
              const t = cols.length <= 1 ? 0 : i / (cols.length - 1);
              const color = interpolateColor(theme.colors.start, theme.colors.end, t);
              const ids = colMap.get(colIdx) || [];
              layout.keys = layout.keys.map(k => ids.includes(k.id) ? { ...k, color, textColor: theme.textColor || k.textColor } : k);
              newGroups[`Gradient-V-${i+1}`] = ids;
            });
          }
        } else if (theme.mode === 'position-based') {
          // Position-based gradient: her tuşun pozisyonuna göre renk hesapla
          const layoutWidth = layout.width;
          const layoutHeight = layout.height;
          
          layout.keys = layout.keys.map(key => {
            const factor = calculatePositionFactor(
              key.x,
              key.y,
              layoutWidth,
              layoutHeight,
              theme.colors.direction || 'diagonal'
            );
            const interpolatedColor = interpolateColor(theme.colors.start, theme.colors.end, factor);
            
            return {
              ...key,
              color: interpolatedColor,
              textColor: theme.textColor || key.textColor,
            };
          });
        }
      } else if ((theme as any).type === 'two-color') {
        // Two-color: edge keys (top row, bottom row, left column, right column) one group; middle another
        const keys = layout.keys;
        const minX = Math.min(...keys.map(k => k.x));
        const maxX = Math.max(...keys.map(k => k.x + k.width));
        const minY = Math.min(...keys.map(k => k.y));
        const maxY = Math.max(...keys.map(k => k.y + k.height));
        const edgeIds: string[] = [];
        const centerIds: string[] = [];
        keys.forEach(k => {
          const isTop = Math.abs(k.y - minY) < 0.01;
          const isBottom = Math.abs((k.y + k.height) - maxY) < 0.01;
          const isLeft = Math.abs(k.x - minX) < 0.01;
          const isRight = Math.abs((k.x + k.width) - maxX) < 0.01;
          if (isTop || isBottom || isLeft || isRight) edgeIds.push(k.id); else centerIds.push(k.id);
        });
        layout.keys = layout.keys.map(k => {
          if (edgeIds.includes(k.id)) {
            return { ...k, color: (theme as any).colors.start, textColor: theme.textColor || k.textColor };
          }
          if (centerIds.includes(k.id)) {
            return { ...k, color: (theme as any).colors.end, textColor: theme.textColor || k.textColor };
          }
          return k;
        });
        newGroups['TwoColor-Edge'] = edgeIds;
        newGroups['TwoColor-Center'] = centerIds;
      }

      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      return {
        ...prev,
        layout,
        currentTheme: themeId,
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: layout,
        },
        groups: newGroups,
      };
    });
  }, []);

  const updateLayersBatch = useCallback((items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }>) => {
    if (!items || items.length === 0) return;
    setConfigWithHistory(prev => {
      const itemsByKey = new Map<string, Array<{ layerId: string; updates: Partial<KeycapLayer> }>>();
      items.forEach(it => {
        const arr = itemsByKey.get(it.keyId) || [];
        arr.push({ layerId: it.layerId, updates: it.updates });
        itemsByKey.set(it.keyId, arr);
      });

      const updatedKeys = prev.layout.keys.map(key => {
        const updatesForKey = itemsByKey.get(key.id);
        if (!updatesForKey || updatesForKey.length === 0) return key;
        const newLayers = (key.layers || []).map(layer => {
          const match = updatesForKey.find(u => u.layerId === layer.id);
          return match ? { ...layer, ...match.updates } : layer;
        });
        return { ...key, layers: newLayers };
      });

      const currentLayoutKey = `${prev.currentLayoutType}-${prev.layoutStandard}`;
      const updatedLayout = { ...prev.layout, keys: updatedKeys };
      return {
        ...prev,
        layout: updatedLayout,
        allLayouts: {
          ...prev.allLayouts,
          [currentLayoutKey]: updatedLayout,
        },
      };
    });
  }, [setConfigWithHistory]);

  const hydrateFromLayoutData = useCallback((layoutData: any, layoutType?: LayoutType, standard?: LayoutStandard) => {
    setConfigWithHistory(prev => {
      // Accept both shapes:
      // 1) Full object previously saved: { layout, globalSettings, groups, currentLayoutType, layoutStandard, ... }
      // 2) Raw layout object: { id, name, keys, width, height }
      const candidateLayout = layoutData?.layout ?? layoutData
      const hasKeys = candidateLayout && Array.isArray(candidateLayout.keys)

      const nextLayout = hasKeys ? candidateLayout : prev.layout
      const nextCurrentLayoutType = (layoutData?.currentLayoutType || layoutType || prev.currentLayoutType) as LayoutType
      const nextLayoutStandard = (layoutData?.layoutStandard || standard || prev.layoutStandard) as LayoutStandard

      return {
        ...prev,
        layout: nextLayout,
        currentLayoutType: nextCurrentLayoutType,
        layoutStandard: nextLayoutStandard,
        selectedKeys: Array.isArray(prev.selectedKeys) ? [] : [],
        allLayouts: {
          ...prev.allLayouts,
        },
      } as any
    })
  }, [setConfigWithHistory])

  return {
    config,
    editingKeyId,
    selectedLayerId,
    canUndo,
    canRedo,
    undo,
    redo,
    beginBatch,
    endBatch,
    changeLayout,
    setLayoutStandard,
    selectKey,
    selectKeys,
    clearSelection,
    updateKeycapColor,
    updateKeycapTextColor,
    previewKeycapColor,
    previewKeycapTextColor,
    startEditingKey,
    stopEditingKey,
    getSelectedKey,
    getSelectedKeys,
    saveGroup,
    loadGroup,
    deleteGroup,
    renameGroup,
    resetLayout,
    // Layer management
    addLayer,
    deleteLayer,
    reorderLayer,
    updateLayer,
    getKeyLayers,
    selectLayer,
    // Theme management
    applyTheme,
    updateLayersBatch,
    hydrateFromLayoutData,
  };
};