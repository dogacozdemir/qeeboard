import { useCallback } from 'react';
import { KeycapLayer, KeyboardConfig } from '@/types/keyboard';

export const useLayerManagement = (
  config: KeyboardConfig,
  setConfig: React.Dispatch<React.SetStateAction<KeyboardConfig>>
) => {
  const addLayer = useCallback((keyId: string, type: 'text' | 'image' | 'icon') => {
    const newLayerId = `layer-${Date.now()}-${Math.random()}`;
    
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key => {
        if (key.id === keyId) {
          const newLayer: KeycapLayer = {
            id: newLayerId,
            type,
            content: type === 'text' ? 'New Text' : undefined,
            alignment: 'center',
            verticalAlignment: 'center',
            fontSize: 14,
            offsetX: 0,
            offsetY: -4, // Move text to inner square center (4px up from keycap center)
            rotation: 0,
            mirrorX: false,
            mirrorY: false,
          };
          return {
            ...key,
            layers: [...(key.layers || []), newLayer],
          };
        }
        return key;
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
    
    return newLayerId;
  }, [setConfig]);

  const deleteLayer = useCallback((keyId: string, layerId: string) => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key => {
        if (key.id === keyId) {
          return {
            ...key,
            layers: (key.layers || []).filter(layer => layer.id !== layerId),
          };
        }
        return key;
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
  }, [setConfig]);

  const reorderLayer = useCallback((keyId: string, layerId: string, direction: 'up' | 'down') => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key => {
        if (key.id === keyId) {
          const layers = [...(key.layers || [])];
          const index = layers.findIndex(l => l.id === layerId);
          
          if (index === -1) return key;
          
          if (direction === 'up' && index > 0) {
            [layers[index], layers[index - 1]] = [layers[index - 1], layers[index]];
          } else if (direction === 'down' && index < layers.length - 1) {
            [layers[index], layers[index + 1]] = [layers[index + 1], layers[index]];
          }
          
          return { ...key, layers };
        }
        return key;
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
  }, [setConfig]);

  const updateLayer = useCallback((keyId: string, layerId: string, updates: Partial<KeycapLayer>) => {
    setConfig(prev => {
      const updatedKeys = prev.layout.keys.map(key => {
        if (key.id === keyId) {
          return {
            ...key,
            layers: (key.layers || []).map(layer =>
              layer.id === layerId ? { ...layer, ...updates } : layer
            ),
          };
        }
        return key;
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
  }, [setConfig]);

  return {
    addLayer,
    deleteLayer,
    reorderLayer,
    updateLayer,
  };
};
