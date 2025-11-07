import React, { useState, useEffect } from 'react';
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig';
import { layoutOptions } from '@/data/layouts';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import KeyboardPreview from '@/components/KeyboardPreview';
import Keyboard3D from '@/components/Keyboard3D';
import DragSelection from '@/components/DragSelection';
import FloatingToolbar from '@/components/FloatingToolbar';
import LayerManager from '@/components/LayerManager';
import ExportPanel from '@/components/ExportPanel';
import { Box, Monitor, Download, FileImage, RotateCcw, Undo2, Redo2, FolderOpen } from 'lucide-react';
import CartDropdown from '@/components/CartDropdown';
import ProfileDropdown from '@/components/ProfileDropdown';
import SaveConfigButton from '@/components/SaveConfigButton';
import SavedConfigsModal from '@/components/SavedConfigsModal';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { KeycapLayer } from '@/types/keyboard';
import WelcomeScreen from '@/components/WelcomeScreen';
import { apiGet, apiPut, apiPost, getUserIdFromToken } from '@/lib/api';
import BackgroundPanel from '@/components/BackgroundPanel';
import CasePanel from '@/components/CasePanel';
import UIPanel from '@/components/UIPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [view3D, setView3D] = useState(false);
  const [backgroundOpen, setBackgroundOpen] = useState(false);
  const [caseOpen, setCaseOpen] = useState(false);
  const [uiOpen, setUiOpen] = useState(false);
  const [allahModOpen, setAllahModOpen] = useState(false);
  const [backgroundSettings, setBackgroundSettings] = useState<{ mode: 'solid'|'gradient'|'texture'|'default'; solid?: string; from?: string; to?: string; angle?: number; texture?: string; textureUrl?: string; textureScale?: number; textureRepeat?: 'repeat'|'no-repeat'; overlayTexture?: string; overlayOpacity?: number }>(()=>{
    try { return JSON.parse(localStorage.getItem('qb_bg_settings')||'') || { mode: 'default' } } catch { return { mode: 'default' } }
  });
  const [caseSettings, setCaseSettings] = useState<{ mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number }>(()=>{
    try { return JSON.parse(localStorage.getItem('qb_case_settings')||'') || { mode: 'default' } } catch { return { mode: 'default' } }
  });
  const [uiSettings, setUiSettings] = useState<{ header: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number }; footer: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number }; sidebar: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number }; toolbar: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number } }>(()=>{
    try { return JSON.parse(localStorage.getItem('qb_ui_settings')||'') || { header: { mode: 'default' }, footer: { mode: 'default' }, sidebar: { mode: 'default' }, toolbar: { mode: 'default' } } } catch { return { header: { mode: 'default' }, footer: { mode: 'default' }, sidebar: { mode: 'default' }, toolbar: { mode: 'default' } } }
  });

  useEffect(()=>{
    try { localStorage.setItem('qb_bg_settings', JSON.stringify(backgroundSettings)) } catch {}
  }, [backgroundSettings])

  useEffect(()=>{
    try { localStorage.setItem('qb_case_settings', JSON.stringify(caseSettings)) } catch {}
  }, [caseSettings])

  useEffect(()=>{
    try { localStorage.setItem('qb_ui_settings', JSON.stringify(uiSettings)) } catch {}
  }, [uiSettings])
  
  function getPatternStyle(id: string, opacity: number): { backgroundImage?: string; backgroundSize?: string; backgroundPosition?: string } {
    if (!id || id === 'none') return {}
    switch (id) {
      case 'grid-light':
        return {
          backgroundImage:
            `linear-gradient(rgba(229,231,235,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(229,231,235,${opacity}) 1px, transparent 1px)`,
          backgroundSize: '16px 16px, 16px 16px'
        }
      case 'grid-dark':
        return {
          backgroundImage:
            `linear-gradient(rgba(31,41,55,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(31,41,55,${opacity}) 1px, transparent 1px)`,
          backgroundSize: '16px 16px, 16px 16px'
        }
      case 'carbon':
        return {
          backgroundImage:
            `radial-gradient(rgba(17,17,17,${opacity}) 15%, transparent 16%), radial-gradient(rgba(17,17,17,${opacity}) 15%, transparent 16%)`,
          backgroundPosition: '0 0, 6px 6px',
          backgroundSize: '12px 12px'
        }
      case 'wood-light':
        return {
          backgroundImage:
            `repeating-linear-gradient(90deg, rgba(181,141,99,${opacity}), rgba(181,141,99,${opacity}) 12px, rgba(165,120,78,${opacity}) 12px, rgba(165,120,78,${opacity}) 24px)`
        }
      case 'wood-dark':
        return {
          backgroundImage:
            `repeating-linear-gradient(90deg, rgba(58,47,42,${opacity}), rgba(58,47,42,${opacity}) 8px, rgba(46,38,34,${opacity}) 8px, rgba(46,38,34,${opacity}) 16px)`
        }
      case 'paper':
        return {
          backgroundImage:
            `repeating-linear-gradient(0deg, rgba(0,0,0,${opacity*0.05}) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(0,0,0,${opacity*0.05}) 0 1px, transparent 1px 16px)`
        }
      case 'dots':
        return {
          backgroundImage:
            `radial-gradient(circle, rgba(0,0,0,${opacity*0.3}) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }
      case 'diagonal':
        return {
          backgroundImage:
            `repeating-linear-gradient(45deg, rgba(0,0,0,${opacity*0.1}) 0, rgba(0,0,0,${opacity*0.1}) 2px, transparent 2px, transparent 10px)`,
          backgroundSize: '14px 14px'
        }
      default:
        return {}
    }
  }

  function getBackgroundStyle(): React.CSSProperties {
    const s = backgroundSettings
    if (!s || s.mode === 'default') return {}
    
    if (s.mode === 'solid' && s.solid) {
      return { background: s.solid }
    }
    
    if (s.mode === 'gradient' && s.from && s.to) {
      const overlay = s.overlayTexture && s.overlayTexture !== 'none' ? getPatternStyle(s.overlayTexture, s.overlayOpacity ?? 0.35) : {}
      const bgImages = [overlay.backgroundImage, `linear-gradient(${s.angle ?? 135}deg, ${s.from}, ${s.to})`].filter(Boolean)
      if (bgImages.length === 0) return {}
      
      return {
        backgroundImage: bgImages.join(', '),
        backgroundSize: overlay.backgroundSize ? `${overlay.backgroundSize}, auto` : 'auto',
        backgroundPosition: overlay.backgroundPosition ? `${overlay.backgroundPosition}, 0 0` : '0 0'
      }
    }
    
    if (s.mode === 'texture' && s.texture) {
      switch (s.texture) {
        case 'grid-light':
          return {
            backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 24px 24px',
            backgroundColor: '#fafafa'
          }
        case 'grid-dark':
          return {
            backgroundImage: `linear-gradient(#374151 1px, transparent 1px), linear-gradient(90deg, #374151 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 24px 24px',
            backgroundColor: '#1f2937'
          }
        case 'carbon':
          return {
            backgroundImage: `radial-gradient(#111 15%, transparent 16%), radial-gradient(#111 15%, transparent 16%)`,
            backgroundPosition: '0 0, 8px 8px',
            backgroundSize: '16px 16px',
            backgroundColor: '#1f2937'
          }
        case 'wood-light':
          return {
            backgroundImage: `repeating-linear-gradient(90deg, #b58d63, #b58d63 12px, #a5784e 12px, #a5784e 24px)`,
            backgroundColor: '#d4a574'
          }
        case 'wood-dark':
          return {
            backgroundImage: `repeating-linear-gradient(90deg, #3a2f2a, #3a2f2a 10px, #2e2622 10px, #2e2622 20px)`,
            backgroundColor: '#2e2622'
          }
        case 'paper':
          return {
            backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 16px)`,
            backgroundColor: '#fafafa'
          }
        case 'custom':
          if (s.textureUrl) {
            return {
              backgroundImage: `url(${s.textureUrl})`,
              backgroundSize: `${s.textureScale || 600}px`,
              backgroundRepeat: s.textureRepeat || 'repeat',
              backgroundPosition: 'center center'
            }
          }
          return {}
        case 'dots':
          return {
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundColor: '#fafafa'
          }
        case 'diagonal':
          return {
            backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)`,
            backgroundSize: '14px 14px',
            backgroundColor: '#fafafa'
          }
        default:
          return {}
      }
    }
    
    return {}
  }
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const force = params.get('welcome');
      if (force === '1') return true;
      if (force === '0') return false;
      return localStorage.getItem('onboarding_done') !== '1';
    } catch {
      return true;
    }
  });
  const [currentConfigId, setCurrentConfigId] = useState<number | null>(null);
  const [currentConfigName, setCurrentConfigName] = useState<string | null>(null);
  const [showSavedConfigs, setShowSavedConfigs] = useState(false);
  const [savedConfigsRefreshTrigger, setSavedConfigsRefreshTrigger] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const { toast } = useToast();
  
  // Project name değişikliği için debounce
  const [pendingNameUpdate, setPendingNameUpdate] = useState<string | null>(null);
  const [lastSavedName, setLastSavedName] = useState<string | null>(null);
  
  useEffect(() => {
    if (pendingNameUpdate !== null && currentConfigId) {
      const timeoutId = setTimeout(async () => {
        const nameToSave = pendingNameUpdate.trim();
        
        // Boş string kontrolü
        if (!nameToSave) {
          // Boş ise eski değere geri dön
          setCurrentConfigName(lastSavedName);
          setPendingNameUpdate(null);
          return;
        }
        
        try {
          // Sadece name'i güncelle, layoutData'yı değiştirme
          await apiPut(`/api/configs/${currentConfigId}`, {
            name: nameToSave,
          });
          setCurrentConfigName(nameToSave);
          setLastSavedName(nameToSave);
          
          // Preview'ı yeniden generate et
          try {
            await apiPost(`/api/configs/${currentConfigId}/preview`, {});
            // Preview generate edildikten sonra saved configs modal'ını yenile
            setSavedConfigsRefreshTrigger(prev => prev + 1);
          } catch (previewError) {
            // Preview generation is optional, don't fail the name update
            console.warn('Preview generation failed:', previewError);
          }
        } catch (error: any) {
          console.error('Failed to update project name:', error);
          // Hata durumunda eski değere geri dön
          setCurrentConfigName(lastSavedName);
        }
        setPendingNameUpdate(null);
      }, 1000); // 1 saniye debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [pendingNameUpdate, currentConfigId, lastSavedName]);
  
  // Config yüklendiğinde veya kaydedildiğinde lastSavedName'i güncelle
  useEffect(() => {
    if (currentConfigName && currentConfigId) {
      setLastSavedName(currentConfigName);
    }
  }, [currentConfigId]); // Sadece config ID değiştiğinde (yüklendiğinde)
  
  const handleProjectNameChange = (newName: string) => {
    // UI'ı hemen güncelle
    setCurrentConfigName(newName);
    // API güncellemesi için debounce
    if (currentConfigId) {
      setPendingNameUpdate(newName);
    }
  };
  
  const {
    config,
    editingKeyId,
    selectedLayerId,
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
    resetLayout,
    canUndo,
    canRedo,
    undo,
    redo,
    beginBatch,
    hydrateFromLayoutData,
    endBatch,
    addLayer,
    deleteLayer,
    reorderLayer,
    updateLayer,
    getKeyLayers,
    selectLayer,
    applyTheme,
    updateLayersBatch,
  } = useKeyboardConfig();

  const selectedKeys = getSelectedKeys();
  const editingKey = getSelectedKey();
  const currentKeyLayers = editingKeyId ? getKeyLayers(editingKeyId) : [];
  const selectedLayer = selectedLayerId 
    ? currentKeyLayers.find(l => l.id === selectedLayerId) 
    : null;

  // Multi-selection stats and selected layer IDs
  // If multiple keys are selected, treat as multi-selection (even if editingKeyId is set)
  const isMultiSelection = config.selectedKeys.length > 1;
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([]);
  const [previewKeys, setPreviewKeys] = useState<string[]>([]);
  
  // Use previewKeys if available (during drag selection), otherwise use config.selectedKeys
  const activeKeys = previewKeys.length > 0 ? previewKeys : config.selectedKeys;
  
  // Calculate stats for all selected keys (including single selection and preview)
  const multiSelectionStats = activeKeys.length > 0 ? (() => {
    let textCount = 0;
    let iconCount = 0;
    let imageCount = 0;
    activeKeys.forEach(keyId => {
      const layers = getKeyLayers(keyId);
      layers.forEach(layer => {
        if (layer.type === 'text') textCount++;
        else if (layer.type === 'icon') iconCount++;
        else if (layer.type === 'image') imageCount++;
      });
    });
    return { text: textCount, icon: iconCount, image: imageCount };
  })() : null;

  // Clear editingKeyId when multi-selection is active
  useEffect(() => {
    if (isMultiSelection && editingKeyId) {
      stopEditingKey();
    }
  }, [isMultiSelection, editingKeyId, stopEditingKey]);

  // Auto-select all layers when multi-selection starts (if no specific layer type is selected)
  // Also update when previewKeys change (during drag selection)
  useEffect(() => {
    const keysToUse = previewKeys.length > 0 ? previewKeys : config.selectedKeys;
    const isPreviewMultiSelection = previewKeys.length > 1;
    const isActualMultiSelection = config.selectedKeys.length > 1;
    
    if (isPreviewMultiSelection || isActualMultiSelection) {
      // Auto-select all layers from all selected keys when multi-selection starts
      const allLayerIds: string[] = [];
      keysToUse.forEach(keyId => {
        const layers = getKeyLayers(keyId);
        layers.forEach(layer => allLayerIds.push(layer.id));
      });
      // Only update if we have layers and selectedLayerIds is empty or different
      if (allLayerIds.length > 0) {
        // Check if current selectedLayerIds matches all layers
        const currentMatchesAll = allLayerIds.length === selectedLayerIds.length && 
          allLayerIds.every(id => selectedLayerIds.includes(id));
        if (!currentMatchesAll) {
          setSelectedLayerIds(allLayerIds);
        }
      } else {
        setSelectedLayerIds([]);
      }
    } else if (keysToUse.length === 1 && editingKeyId) {
      // Single selection: auto-select all layers from the selected key
      const layers = getKeyLayers(editingKeyId);
      const layerIds = layers.map(l => l.id);
      if (layerIds.length > 0) {
        // Only update if different
        const currentMatches = layerIds.length === selectedLayerIds.length && 
          layerIds.every(id => selectedLayerIds.includes(id));
        if (!currentMatches) {
          setSelectedLayerIds(layerIds);
        }
      } else {
        setSelectedLayerIds([]);
      }
    } else if (keysToUse.length === 0) {
      // Clear selected layer IDs when no keys are selected
      setSelectedLayerIds([]);
    }
  }, [isMultiSelection, config.selectedKeys.join(','), editingKeyId, previewKeys.join(',')]);

  const handleKeySelect = (keyId: string, event?: React.MouseEvent) => {
    const multiSelect = event?.ctrlKey || event?.metaKey;
    if (multiSelect) {
      selectKey(keyId, multiSelect);
      // Clear editingKeyId when multi-selection is active
      if (editingKeyId) {
        stopEditingKey();
      }
    } else {
      // Single click - select and start editing only if not already in multi-selection
      if (config.selectedKeys.length > 1) {
        // If already in multi-selection, just add to selection
        selectKey(keyId, false);
        stopEditingKey();
      } else {
        // Single selection - select and start editing
      selectKey(keyId, false);
      startEditingKey(keyId);
      
      // Auto-select the first layer if the key has layers
      const keyLayers = getKeyLayers(keyId);
      if (keyLayers.length > 0) {
        selectLayer(keyLayers[0].id);
      } else {
        selectLayer(null);
        }
      }
    }
  };

  const handleDragSelection = (keyIds: string[]) => {
    selectKeys(keyIds);
  };

  const handleKeyDoubleClick = (keyId: string) => {
    startEditingKey(keyId);
  };

  const handleLayerSelect = (layerId: string) => {
    if (layerId === '') {
      selectLayer(null); // Clear layer selection
    } else {
      selectLayer(layerId);
    }
  };

  // Clear layer selection when no keys are selected
  useEffect(() => {
    if (config.selectedKeys.length === 0) {
      selectLayer(null);
    }
  }, [config.selectedKeys.length, selectLayer]);

  // Keyboard shortcuts: Cmd/Ctrl+Z (undo), Shift+Cmd/Ctrl+Z (redo)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canUndo, canRedo, undo, redo]);

  const handleColorChange = (color: string) => {
    if (config.selectedKeys.length > 0) {
      // If selectedLayerIds is provided in multi-selection, only preview keycaps that have selected layers
      if (isMultiSelection && selectedLayerIds.length > 0) {
        const keyIdsWithSelectedLayers: string[] = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          const hasSelectedLayer = layers.some(layer => selectedLayerIds.includes(layer.id));
          if (hasSelectedLayer) {
            keyIdsWithSelectedLayers.push(keyId);
          }
        });
        if (keyIdsWithSelectedLayers.length > 0) {
          previewKeycapColor(keyIdsWithSelectedLayers, color);
        }
      } else {
        // Fallback: preview all selected keycaps (old behavior)
      previewKeycapColor(config.selectedKeys, color);
      }
    }
  };

  const handleTextColorChange = (textColor: string) => {
    if (config.selectedKeys.length > 0) {
      // Preview is handled differently - we don't preview layer colors, only keycap textColor
      // So keep old behavior for preview
      previewKeycapTextColor(config.selectedKeys, textColor);
    }
  };

  const handleColorCommit = (color: string) => {
    if (config.selectedKeys.length > 0) {
      // If selectedLayerIds is provided in multi-selection, only update keycaps that have selected layers
      if (isMultiSelection && selectedLayerIds.length > 0) {
        const keyIdsWithSelectedLayers: string[] = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          const hasSelectedLayer = layers.some(layer => selectedLayerIds.includes(layer.id));
          if (hasSelectedLayer) {
            keyIdsWithSelectedLayers.push(keyId);
          }
        });
        if (keyIdsWithSelectedLayers.length > 0) {
          updateKeycapColor(keyIdsWithSelectedLayers, color);
        }
      } else if (editingKeyId && selectedLayer) {
        // Single selection with a layer selected - update that keycap's color
        updateKeycapColor([editingKeyId], color);
      } else {
        // Fallback: update all selected keycaps (old behavior)
      updateKeycapColor(config.selectedKeys, color);
      }
    }
  };

  const handleTextColorCommit = (textColor: string) => {
    console.log('handleTextColorCommit called:', { 
      textColor, 
      selectedLayerIds, 
      selectedLayerIdsLength: selectedLayerIds.length,
      editingKeyId, 
      selectedLayer, 
      selectedLayerId,
      selectedKeysCount: config.selectedKeys.length,
      isMultiSelection 
    });
    
    if (config.selectedKeys.length > 0) {
      // If selectedLayerIds is provided (multi-selection or single with layer type selected), update only those layers' color
      if (selectedLayerIds.length > 0) {
        console.log('Branch 1: Updating selected layers');
        const items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          console.log(`Key ${keyId} has ${layers.length} layers:`, layers.map(l => ({ id: l.id, type: l.type })));
          layers.forEach(layer => {
            if (selectedLayerIds.includes(layer.id)) {
              items.push({ keyId, layerId: layer.id, updates: { color: textColor } });
            }
          });
        });
        console.log('Items to update:', items);
        if (items.length > 0) {
          updateLayersBatch(items);
          console.log('updateLayersBatch called');
        } else {
          console.warn('No items to update!');
        }
      } else if (editingKeyId && selectedLayer) {
        // Single selection with a specific layer selected - update that layer's color
        console.log('Branch 2: Updating single layer', editingKeyId, selectedLayer.id);
        updateLayer(editingKeyId, selectedLayer.id, { color: textColor });
        console.log('updateLayer called');
      } else {
        // Fallback: update keycap textColor (old behavior)
        console.log('Branch 3: Fallback - updating keycap textColor');
      updateKeycapTextColor(config.selectedKeys, textColor);
        console.log('updateKeycapTextColor called');
      }
    } else {
      console.warn('No selected keys!');
    }
  };

  const handleMultiLayerUpdate = (keyIds: string[], layerId: string, updates: any) => {
    const items = keyIds.map(keyId => ({ keyId, layerId, updates }));
    updateLayersBatch(items);
  };

  const handleBatchLayerUpdates = (items: Array<{ keyId: string; layerId: string; updates: any }>) => {
    updateLayersBatch(items);
  };

  const getCurrentColor = () => {
    if (selectedKeys.length === 1) {
      return selectedKeys[0].color;
    }
    return '#2D3748'; // Default color
  };

  const getCurrentTextColor = () => {
    if (selectedKeys.length === 1) {
      return selectedKeys[0].textColor;
    }
    return '#FFFFFF'; // Default text color
  };

  const handleAddToCart = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      toast({ title: 'Hata', description: 'Sepete eklemek için giriş yapmanız gerekiyor', variant: 'destructive' });
      return;
    }

    // Eğer config kaydedilmemişse önce kaydet
    let configIdToUse = currentConfigId;
    if (!configIdToUse) {
      // Otomatik olarak kaydet
      try {
        const layoutData = {
          layout: config.layout,
          globalSettings: config.globalSettings,
          groups: config.groups,
          currentLayoutType: config.currentLayoutType,
          layoutStandard: config.layoutStandard,
          currentTheme: config.currentTheme,
        };

        // Varsayılan isim ile kaydet
        const defaultName = `Tasarım ${new Date().toLocaleDateString('tr-TR')}`;
        const res = await apiPost('/api/configs', {
          userId,
          name: defaultName,
          description: null,
          layoutData,
        });
        
        configIdToUse = res.data?.id;
        if (configIdToUse) {
          setCurrentConfigId(configIdToUse);
          setCurrentConfigName(defaultName);
          setLastSavedName(defaultName);
          
          // Preview generate et
          try {
            await apiPost(`/api/configs/${configIdToUse}/preview`, {});
            setSavedConfigsRefreshTrigger(prev => prev + 1);
          } catch (e) {
            console.warn('Preview generation failed:', e);
          }
        } else {
          throw new Error('Config kaydedilemedi');
        }
      } catch (error: any) {
        toast({ 
          title: 'Hata', 
          description: error.message || 'Tasarım kaydedilemedi. Lütfen önce kaydedin.', 
          variant: 'destructive' 
        });
        return;
      }
    }

    setAddingToCart(true);
    try {
      // Listing oluştur veya mevcut olanı kullan - Backend otomatik kontrol ediyor
      // 4500TL = 450000 kuruş
      const listingRes = await apiPost('/api/listings', {
        configId: configIdToUse,
        sellerId: userId,
        priceCents: 450000, // 4500TL
        currency: 'TRY',
        stock: 1,
        isActive: true
      });
      
      const listingId = listingRes.data?.id;
      if (!listingId) {
        throw new Error('Listing oluşturulamadı');
      }

      // Config'in preview'ı yoksa generate et
      try {
        const configRes = await apiGet(`/api/configs/${configIdToUse}`);
        if (!configRes.data?.previewUrl) {
          // Preview yoksa generate et
          await apiPost(`/api/configs/${configIdToUse}/preview`, {});
          // Preview generate edildikten sonra kısa bir bekleme
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (previewError) {
        console.warn('Preview check/generation failed:', previewError);
        // Preview hatası sepete eklemeyi engellemesin
      }

      // Sepete ekle
      await apiPost('/api/cart/items', {
        userId,
        listingId,
        quantity: 1
      });

      toast({ title: 'Başarılı', description: 'Tasarım sepete eklendi!' });
      
      // CartDropdown'ı yenilemek için event dispatch et
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({ 
        title: 'Hata', 
        description: error.message || 'Sepete ekleme başarısız', 
        variant: 'destructive' 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        onComplete={({ layoutType, themeId }) => {
          changeLayout(layoutType);
          if (themeId && themeId !== 'none') {
            applyTheme(themeId as any);
          }
          try { localStorage.setItem('onboarding_done', '1'); } catch {}
          setShowWelcome(false);
        }}
        onResumeExisting={async (configId:number)=>{
          try {
            const res = await apiGet(`/api/configs/${configId}`)
            const cfg = res?.data
            if (cfg?.layoutData) {
              // Best effort: keep current type/standard, hydrate with saved layout
              hydrateFromLayoutData(cfg.layoutData, cfg.layoutData?.currentLayoutType, cfg.layoutData?.layoutStandard)
              setCurrentConfigId(configId)
              setCurrentConfigName(cfg?.name || null)
              try { localStorage.setItem('onboarding_done', '1'); } catch {}
              setShowWelcome(false)
            }
          } catch {}
        }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
    >
        {/* Header */}
        <header 
          className="border-b border-border backdrop-blur h-12 relative z-20"
          style={{
            ...(uiSettings?.header?.mode === 'default' 
              ? { backgroundColor: 'rgba(26, 29, 36, 0.5)' } 
              : uiSettings?.header?.mode === 'solid' && uiSettings?.header?.solid
              ? { backgroundColor: uiSettings.header.solid }
              : uiSettings?.header?.mode === 'gradient' && uiSettings?.header?.from && uiSettings?.header?.to
              ? { 
                  background: `linear-gradient(${uiSettings.header.angle || 135}deg, ${uiSettings.header.from}, ${uiSettings.header.to})`
                }
              : { backgroundColor: 'rgba(26, 29, 36, 0.5)' }
            ),
          }}
        >
        <div className="w-full h-full">
          <div className="flex items-center justify-between h-full max-w-full pl-16 xl:pl-12 relative">
            {/* Left side - Logo and main actions */}
            <div className="flex items-center gap-3 h-full">
              <button
                aria-label="Ana sayfa"
                className="h-full"
                onClick={() => {
                  try {
                    const host = (()=>{ try { return localStorage.getItem('qb_host_origin') } catch { return null } })()
                    const defaultHost = (location.port === '8080') ? 'http://localhost:5173' : location.origin
                    const base = host || defaultHost
                    const target = `${base.replace(/\/$/, '')}/`
                    if (window.top && window.top !== window) window.top.location.assign(target)
                    else window.location.assign(target)
                  } catch {
                    const fallback = (location.port === '8080') ? 'http://localhost:5173/' : '/'
                    window.location.assign(fallback)
                  }
                }}
                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
              >
                <img 
                  src="/designer/qeeboard.png" 
                  alt="QeeBoard" 
                  className="h-full w-auto object-contain"
                />
              </button>
              
              {/* Main actions - Logo'nun hemen sağında */}
              <SaveConfigButton 
                config={config} 
                currentConfigId={currentConfigId} 
                currentConfigName={currentConfigName}
                onSaved={(id, name) => {
                  setCurrentConfigId(id)
                  setCurrentConfigName(name)
                  setLastSavedName(name) // Kaydedildiğinde lastSavedName'i güncelle
                  // Preview generate edildikten sonra saved configs modal'ını yenile
                  setSavedConfigsRefreshTrigger(prev => prev + 1)
                }} 
              />
              <Button
                variant="ghost"
                size="icon"
                disabled={!canUndo}
                onClick={undo}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
                title="Undo (Cmd/Ctrl+Z)"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!canRedo}
                onClick={redo}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40"
                title="Redo (Shift+Cmd/Ctrl+Z)"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetLayout}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Reset Layout"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSavedConfigs(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                title="Kayıtlı Tasarımlarım"
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Center - Add to Cart Button */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingToCart ? 'Ekleniyor...' : 'SEPETE EKLE - 4500TL'}
              </Button>
            </div>
            
            {/* Right side - Other actions */}
            <div className="flex items-center gap-3">
              {/* Export Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Export Configuration"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <ExportPanel config={config} />
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open('/svg-demo', '_blank')}
                className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                title="SVG Keycap Generator"
              >
                <FileImage className="h-4 w-4" />
              </Button>
              <CartDropdown />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>


        {/* Main Content */}
        <div className="w-full flex-1 min-h-0 flex overflow-hidden relative z-10">
            {/* Left Panel - Unified Sidebar */}
            <div 
              className="w-64 xl:w-80 flex-shrink-0 h-full overflow-y-auto relative z-20 backdrop-blur-sm"
              style={{
                ...(uiSettings?.sidebar?.mode === 'default' 
                  ? { backgroundColor: 'rgba(20, 22, 26, 0.8)' } 
                  : uiSettings?.sidebar?.mode === 'solid' && uiSettings?.sidebar?.solid
                  ? { backgroundColor: uiSettings.sidebar.solid }
                  : uiSettings?.sidebar?.mode === 'gradient' && uiSettings?.sidebar?.from && uiSettings?.sidebar?.to
                  ? { 
                      background: `linear-gradient(${uiSettings.sidebar.angle || 135}deg, ${uiSettings.sidebar.from}, ${uiSettings.sidebar.to})`
                    }
                  : { backgroundColor: 'rgba(20, 22, 26, 0.8)' }
                ),
              }}
            >
              <UnifiedSidebar
              projectName={currentConfigName}
              onProjectNameChange={handleProjectNameChange}
              layouts={layoutOptions}
              selectedLayout={config.currentLayoutType}
              onLayoutChange={changeLayout}
              layoutStandard={config.layoutStandard}
              onLayoutStandardChange={(std) => setLayoutStandard(std)}
              groups={config.groups}
              selectedKeys={activeKeys}
              onSaveGroup={saveGroup}
              onLoadGroup={loadGroup}
              onDeleteGroup={deleteGroup}
              editingKeyId={isMultiSelection ? null : editingKeyId}
              currentKeyLayers={isMultiSelection ? [] : currentKeyLayers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={selectLayer}
              onLayerReorder={(layerId, direction) => editingKeyId && reorderLayer(editingKeyId, layerId, direction)}
              onLayerDelete={(layerId) => editingKeyId && deleteLayer(editingKeyId, layerId)}
              onAddTextLayer={() => {
                editingKeyId && addLayer(editingKeyId, 'text');
              }}
              onAddImageLayer={() => {
                editingKeyId && addLayer(editingKeyId, 'image');
              }}
                onAddIconLayer={() => {
                  if (editingKeyId) {
                    addLayer(editingKeyId, 'icon' as any);
                  }
                }}
                isMultiSelection={previewKeys.length > 1 || isMultiSelection}
                multiSelectionStats={multiSelectionStats}
                selectedLayerIds={selectedLayerIds}
                getKeyLayers={getKeyLayers}
                onSelectAllLayers={() => {
                  // Select all layers from all selected keys (use activeKeys which includes previewKeys)
                  const allLayerIds: string[] = [];
                  activeKeys.forEach(keyId => {
                    const layers = getKeyLayers(keyId);
                    layers.forEach(layer => allLayerIds.push(layer.id));
                  });
                  setSelectedLayerIds(allLayerIds);
                  // Also select first layer for compatibility
                  if (allLayerIds.length > 0) {
                    selectLayer(allLayerIds[0]);
                  }
                }}
                onSelectTextLayers={() => {
                  // Select only text layers from all selected keys
                  const textLayerIds: string[] = [];
                  activeKeys.forEach(keyId => {
                    const layers = getKeyLayers(keyId);
                    layers.forEach(layer => {
                      if (layer.type === 'text') textLayerIds.push(layer.id);
                    });
                  });
                  setSelectedLayerIds(textLayerIds);
                  // Also select first layer for compatibility
                  if (textLayerIds.length > 0) {
                    selectLayer(textLayerIds[0]);
                  }
                }}
                onSelectIconLayers={() => {
                  // Select only icon layers from all selected keys
                  const iconLayerIds: string[] = [];
                  activeKeys.forEach(keyId => {
                    const layers = getKeyLayers(keyId);
                    layers.forEach(layer => {
                      if (layer.type === 'icon') iconLayerIds.push(layer.id);
                    });
                  });
                  setSelectedLayerIds(iconLayerIds);
                  // Also select first layer for compatibility
                  if (iconLayerIds.length > 0) {
                    selectLayer(iconLayerIds[0]);
                  }
                }}
                onSelectImageLayers={() => {
                  // Select only image layers from all selected keys
                  const imageLayerIds: string[] = [];
                  activeKeys.forEach(keyId => {
                    const layers = getKeyLayers(keyId);
                    layers.forEach(layer => {
                      if (layer.type === 'image') imageLayerIds.push(layer.id);
                    });
                  });
                  setSelectedLayerIds(imageLayerIds);
                  // Also select first layer for compatibility
                  if (imageLayerIds.length > 0) {
                    selectLayer(imageLayerIds[0]);
                  }
                }}
                currentTheme={config.currentTheme}
                onThemeChange={applyTheme}
            />
          </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 min-w-0 min-h-0 p-0 relative z-10">
              {/* Floating Toolbar - Positioned absolutely to float over content */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                  <FloatingToolbar
                    selectedColor={getCurrentColor()}
                    selectedTextColor={getCurrentTextColor()}
                    onColorChange={handleColorChange}
                    onTextColorChange={handleTextColorChange}
                    onColorCommit={handleColorCommit as any}
                    onTextColorCommit={handleTextColorCommit as any}
                    selectedKeysCount={config.selectedKeys.length}
                    editingKey={editingKey}
                    selectedKeys={selectedKeys}
                    selectedLayer={selectedLayer}
                    selectedLayerIds={selectedLayerIds}
                    getKeyLayers={getKeyLayers}
                    onLayerUpdate={updateLayer}
                    onLegendChange={(keyId, layerId, content) => {
                      updateLayer(keyId, layerId, { content });
                    }}
                    onMultiLayerUpdate={handleMultiLayerUpdate}
                    onAddLayer={addLayer}
                    onBatchLayerUpdates={handleBatchLayerUpdates}
                    onBatchStart={beginBatch}
                    onBatchEnd={endBatch}
                    toolbarSettings={uiSettings?.toolbar}
                  />
                </div>
              </div>
              
              <div className="h-full flex items-center justify-center">
                
                {/* Preview Area */}
                {view3D ? (
                  <Keyboard3D
                    layout={config.layout}
                    selectedKeys={config.selectedKeys}
                    onKeySelect={(keyId, e) => handleKeySelect(keyId, e)}
                    onKeyDoubleClick={handleKeyDoubleClick}
                    view3D={view3D}
                    onView3DToggle={() => setView3D(false)}
                  />
                ) : (
                  <DragSelection
                    layout={config.layout}
                    selectedKeys={config.selectedKeys}
                    onKeysSelect={handleDragSelection}
                    onPreviewKeysChange={setPreviewKeys}
                    backgroundStyle={getBackgroundStyle()}
                  >
                    <KeyboardPreview
                      layout={config.layout}
                      selectedKeys={config.selectedKeys}
                      onKeySelect={handleKeySelect}
                      onKeyDoubleClick={handleKeyDoubleClick}
                      editingKeyId={editingKeyId}
                      currentKeyLayers={currentKeyLayers}
                      selectedLayerId={selectedLayerId}
                      onLayerSelect={handleLayerSelect}
                      onAddTextLayer={() => {
                        editingKeyId && addLayer(editingKeyId, 'text');
                      }}
                      onAddImageLayer={() => {
                        editingKeyId && addLayer(editingKeyId, 'image');
                      }}
                      onAddIconLayer={() => {
                        if (editingKeyId) {
                          addLayer(editingKeyId, 'icon' as any);
                        }
                      }}
                      currentTheme={config.currentTheme}
                      view3D={view3D}
                      onView3DToggle={() => setView3D(!view3D)}
                      caseSettings={caseSettings}
                    />
                  </DragSelection>
                )}
                
              </div>
            </div>
          </div>

        {/* Saved Configs Modal */}
        <SavedConfigsModal
          open={showSavedConfigs}
          onOpenChange={setShowSavedConfigs}
          refreshTrigger={savedConfigsRefreshTrigger}
          onLoadConfig={(savedConfig) => {
            if (savedConfig.layoutData) {
              hydrateFromLayoutData(
                savedConfig.layoutData,
                savedConfig.layoutData?.currentLayoutType,
                savedConfig.layoutData?.layoutStandard
              )
              setCurrentConfigId(savedConfig.id)
              setCurrentConfigName(savedConfig.name)
            }
          }}
        />

        {/* Footer */}
        <footer 
          className="border-t border-border backdrop-blur mt-auto relative z-20"
          style={{
            ...(uiSettings?.footer?.mode === 'default' 
              ? { backgroundColor: 'rgba(15, 17, 22, 0.3)' } 
              : uiSettings?.footer?.mode === 'solid' && uiSettings?.footer?.solid
              ? { backgroundColor: uiSettings.footer.solid }
              : uiSettings?.footer?.mode === 'gradient' && uiSettings?.footer?.from && uiSettings?.footer?.to
              ? { 
                  background: `linear-gradient(${uiSettings.footer.angle || 135}deg, ${uiSettings.footer.from}, ${uiSettings.footer.to})`
                }
              : { backgroundColor: 'rgba(15, 17, 22, 0.3)' }
            ),
          }}
        >
          <div className="w-full py-3">
            <div className="text-center text-sm text-muted-foreground">
           Ⓒ2025 Qeeboard - Terms of Use | Privacy Policy | Contact | Support
            </div>
          </div>
        </footer>

        {/* ALLAH MOD ON Button - Bottom Right */}
        <div className="fixed bottom-4 right-4 z-50">
          <Popover open={allahModOpen} onOpenChange={setAllahModOpen}>
            <PopoverTrigger asChild>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105"
                title="ALLAH MOD"
              >
                ALLAH MOD ON
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4" align="end">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold mb-4">Dinamik Renk Ayarları</h3>
                <div className="flex flex-col gap-2">
                  <Popover open={backgroundOpen} onOpenChange={setBackgroundOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors w-full flex items-center gap-2"
                        title="Arka Plan"
                      >
                        {/* simple palette icon via SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2a10 10 0 0 0-10 10 6 6 0 0 0 6 6h1a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3c4.418 0 8-3.582 8-8A10 10 0 0 0 12 2Zm-3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>
                        <span>Arka Plan</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-4" align="end">
                      <BackgroundPanel value={backgroundSettings} onChange={setBackgroundSettings} />
                    </PopoverContent>
                  </Popover>
                  <Popover open={caseOpen} onOpenChange={setCaseOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors w-full flex items-center gap-2"
                        title="Klavye Kasa Rengi"
                      >
                        {/* Box icon for case */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        <span>Klavye Kasa Rengi</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-4" align="end">
                      <CasePanel value={caseSettings} onChange={setCaseSettings} />
                    </PopoverContent>
                  </Popover>
                  <Popover open={uiOpen} onOpenChange={setUiOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors w-full flex items-center gap-2"
                        title="UI Renkleri"
                      >
                        {/* Layout icon for UI */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
                        <span>UI Renkleri</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-4 max-h-[600px] overflow-y-auto" align="end">
                      <UIPanel value={uiSettings} onChange={setUiSettings} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
    </div>
  );
};

export default Index;
