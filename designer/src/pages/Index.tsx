import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig';
import { layoutOptions } from '@/data/layouts';
import UnifiedSidebar from '@/components/UnifiedSidebar';
import KeyboardPreview from '@/components/KeyboardPreview';
import Keyboard3D from '@/components/Keyboard3D';
import DragSelection from '@/components/DragSelection';
import FloatingToolbar from '@/components/FloatingToolbar';
import LayerManager from '@/components/LayerManager';
import ExportPanel from '@/components/ExportPanel';
import { Box, Monitor, Download, FileImage, RotateCcw, Undo2, Redo2, FolderOpen, Users, Eye } from 'lucide-react';
import CartDropdown from '@/components/CartDropdown';
import ProfileDropdown from '@/components/ProfileDropdown';
import SaveConfigButton from '@/components/SaveConfigButton';
import SavedConfigsModal from '@/components/SavedConfigsModal';
import ShareButton from '@/components/ShareButton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { KeycapLayer } from '@/types/keyboard';
import WelcomeScreen from '@/components/WelcomeScreen';
import { apiGet, apiPut, apiPost, getUserIdFromToken } from '@/lib/api';
import { API_URL } from '@/lib/api';
import BackgroundPanel from '@/components/BackgroundPanel';
import CasePanel from '@/components/CasePanel';
import UIPanel from '@/components/UIPanel';
import { useToast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';

const Index = () => {
  const [view3D, setView3D] = useState(false);
  const [toolbarOpenSection, setToolbarOpenSection] = useState<'text' | 'icon' | 'image' | null>(null);
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
  
  // WebSocket for collaboration
  const [socket, setSocket] = useState<Socket | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [collaborationRole, setCollaborationRole] = useState<'VIEWER' | 'EDITOR' | null>(null);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const isApplyingRemoteUpdate = useRef<boolean>(false);
  
  // Store socket instance and collaboration state in refs for reliable access in auto-save
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const shareTokenRef = useRef<string | null>(null);
  const collaborationRoleRef = useRef<'VIEWER' | 'EDITOR' | null>(null);
  const isCollaboratingRef = useRef<boolean>(false);
  
  // Throttled commit for color changes (performance optimization)
  const COLOR_COMMIT_THROTTLE_MS = 80; // Throttle color commits to max once per 80ms
  const colorCommitThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const textColorCommitThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const pendingColorCommitRef = useRef<{ keyIds: string[]; color: string } | null>(null);
  const pendingTextColorCommitRef = useRef<{ items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> } | { keyId: string; layerId: string; color: string } | { keyIds: string[]; textColor: string } | null>(null);
  
  // Project name değişikliği için debounce
  const [pendingNameUpdate, setPendingNameUpdate] = useState<string | null>(null);
  const [lastSavedName, setLastSavedName] = useState<string | null>(null);
  
  // Cleanup throttles on unmount
  useEffect(() => {
    return () => {
      if (colorCommitThrottleRef.current) {
        clearTimeout(colorCommitThrottleRef.current);
      }
      if (textColorCommitThrottleRef.current) {
        clearTimeout(textColorCommitThrottleRef.current);
      }
    };
  }, []);
  
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
    updateKeycapColor: originalUpdateKeycapColor,
    updateKeycapTextColor: originalUpdateKeycapTextColor,
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
    canUndo,
    canRedo,
    undo,
    redo,
    beginBatch,
    hydrateFromLayoutData,
    endBatch,
    addLayer: originalAddLayer,
    deleteLayer: originalDeleteLayer,
    reorderLayer: originalReorderLayer,
    updateLayer: originalUpdateLayer,
    getKeyLayers,
    selectLayer,
    applyTheme,
    updateLayersBatch: originalUpdateLayersBatch,
  } = useKeyboardConfig();

  // Wrapper functions that check collaboration role (VIEWER can't edit)
  const isReadOnly = isCollaborating && collaborationRole === 'VIEWER';
  
  const updateKeycapColor = isReadOnly ? () => {} : originalUpdateKeycapColor;
  const updateKeycapTextColor = isReadOnly ? () => {} : originalUpdateKeycapTextColor;
  const addLayer = isReadOnly ? () => {} : originalAddLayer;
  const deleteLayer = isReadOnly ? () => {} : originalDeleteLayer;
  const reorderLayer = isReadOnly ? () => {} : originalReorderLayer;
  const updateLayer = isReadOnly ? () => {} : originalUpdateLayer;
  const updateLayersBatch = isReadOnly ? () => {} : originalUpdateLayersBatch;

  // Load config and shareToken from URL parameter (after hydrateFromLayoutData is available)
  // This runs on mount and when URL params change (e.g., page refresh)
  useEffect(() => {
    if (!hydrateFromLayoutData) return;
    
    const params = new URLSearchParams(window.location.search);
    const configIdParam = params.get('configId');
    const shareTokenParam = params.get('shareToken');
    
    // Set shareToken from URL if available (this will trigger socket connection)
    if (shareTokenParam && shareTokenParam !== shareToken) {
      setShareToken(shareTokenParam);
    }
    
    if (configIdParam) {
      const configId = parseInt(configIdParam);
      if (!isNaN(configId)) {
        // Load config if URL has configId and it's different from current, or if currentConfigId is null
        // This handles both initial load and page refresh
        if (configId !== currentConfigId) {
          (async () => {
            try {
              const res = await apiGet(`/api/configs/${configId}`);
              const cfg = res?.data;
              if (cfg?.layoutData) {
                // Mark as remote update to prevent auto-save during initial load
                isApplyingRemoteUpdate.current = true;
                
                hydrateFromLayoutData(
                  cfg.layoutData, 
                  cfg.layoutData?.currentLayoutType, 
                  cfg.layoutData?.layoutStandard
                );
                
                // Update lastSavedConfigRef to match the loaded data
                const loadedLayoutData = {
                  layout: cfg.layoutData.layout,
                  globalSettings: cfg.layoutData.globalSettings,
                  groups: cfg.layoutData.groups,
                  currentLayoutType: cfg.layoutData.currentLayoutType,
                  layoutStandard: cfg.layoutData.layoutStandard,
                  currentTheme: cfg.layoutData.currentTheme
                };
                lastSavedConfigRef.current = JSON.stringify(loadedLayoutData);
                
                setCurrentConfigId(configId);
                setCurrentConfigName(cfg?.name || null);
                try { localStorage.setItem('onboarding_done', '1'); } catch {}
                setShowWelcome(false);
                
                // Reset flag after load
                setTimeout(() => {
                  isApplyingRemoteUpdate.current = false;
                }, 200);
              }
            } catch (error) {
              console.error('[Config Load] Failed to load config:', error);
            }
          })();
        }
      }
    }
  }, [hydrateFromLayoutData, shareToken, currentConfigId]); // Include currentConfigId to detect changes

  // WebSocket connection for collaboration (after hydrateFromLayoutData is available)
  useEffect(() => {
    if (!shareToken || !hydrateFromLayoutData) return;
    
    // Don't require currentConfigId - it will be set from share:sync

    const userId = getUserIdFromToken();
    const socketInstance = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    // Store socket in state IMMEDIATELY so auto-save can use it
    setSocket(socketInstance);
    socketRef.current = socketInstance; // Also store in ref for immediate access
    shareTokenRef.current = shareToken; // Store shareToken in ref

    socketInstance.on('connect', () => {
      socketInstance.emit('share:join', { token: shareToken, userId: userId || undefined });
    });

    socketInstance.on('share:sync', (data: { configId: number; layoutData: any; role: 'VIEWER' | 'EDITOR' }) => {
      // Set collaboration state FIRST (before loading data)
      setCollaborationRole(data.role);
      setIsCollaborating(true);
      
      // Update refs immediately for auto-save to use
      collaborationRoleRef.current = data.role;
      isCollaboratingRef.current = true;
      
      // Set currentConfigId from sync if not set
      if (data.configId && !currentConfigId) {
        setCurrentConfigId(data.configId);
      }
      
      if (data.layoutData) {
        // Mark as remote update to prevent auto-save during sync
        isApplyingRemoteUpdate.current = true;
        
        hydrateFromLayoutData(
          data.layoutData,
          data.layoutData?.currentLayoutType,
          data.layoutData?.layoutStandard
        );
        
        // Update lastSavedConfigRef to match the synced data
        const syncedLayoutData = {
          layout: data.layoutData.layout,
          globalSettings: data.layoutData.globalSettings,
          groups: data.layoutData.groups,
          currentLayoutType: data.layoutData.currentLayoutType,
          layoutStandard: data.layoutData.layoutStandard,
          currentTheme: data.layoutData.currentTheme
        };
        lastSavedConfigRef.current = JSON.stringify(syncedLayoutData);
        
        // Reset flag after sync
        setTimeout(() => {
          isApplyingRemoteUpdate.current = false;
        }, 200);
      }
    });

    socketInstance.on('share:update', (data: { layoutData: any; updatedBy: number | null }) => {
      // Ignore updates from self
      if (data.updatedBy === userId) {
        return;
      }
      
      // Mark that we're applying a remote update (to prevent auto-save loop)
      isApplyingRemoteUpdate.current = true;
      
      // Apply update immediately - hydrateFromLayoutData now updates all fields
      if (data.layoutData) {
        hydrateFromLayoutData(
          data.layoutData,
          data.layoutData?.currentLayoutType,
          data.layoutData?.layoutStandard
        );
        
        // Update lastSavedConfigRef to match the remote update
        const remoteLayoutData = {
          layout: data.layoutData.layout,
          globalSettings: data.layoutData.globalSettings,
          groups: data.layoutData.groups,
          currentLayoutType: data.layoutData.currentLayoutType,
          layoutStandard: data.layoutData.layoutStandard,
          currentTheme: data.layoutData.currentTheme
        };
        lastSavedConfigRef.current = JSON.stringify(remoteLayoutData);
        
        // Reset flag after a short delay to allow state update to complete
        setTimeout(() => {
          isApplyingRemoteUpdate.current = false;
        }, 100);
      }
    });

    socketInstance.on('share:user-joined', (data: { socketId: string; userId: number | null; role: 'VIEWER' | 'EDITOR' }) => {
      // User join notifications removed for smoother UX
    });

    socketInstance.on('share:user-left', (data: { socketId: string }) => {
      // User leave notifications removed for smoother UX
    });

    socketInstance.on('share:error', (data: { message: string }) => {
      toast({
        title: 'Hata',
        description: data.message,
        variant: 'destructive'
      });
    });

    socketInstance.on('disconnect', () => {
      setIsCollaborating(false);
    });

    // Socket is already set above, no need to set again here

    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsCollaborating(false);
      // Clean up throttle timeout
      if (socketEmitThrottleRef.current) {
        clearTimeout(socketEmitThrottleRef.current);
        socketEmitThrottleRef.current = null;
      }
    };
  }, [shareToken, hydrateFromLayoutData, toast, currentConfigId]);

  // Track last saved config to avoid unnecessary saves
  const lastSavedConfigRef = useRef<string | null>(null);
  const lastSocketEmitRef = useRef<string | null>(null);
  const socketEmitThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const lastSocketEmitTimeRef = useRef<number>(0);
  const SOCKET_THROTTLE_MS = 150; // Throttle socket emits to max once per 150ms
  const DB_DEBOUNCE_MS = 500; // Debounce database saves to 500ms

  // Update refs when state changes
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);
  useEffect(() => {
    shareTokenRef.current = shareToken;
  }, [shareToken]);
  useEffect(() => {
    collaborationRoleRef.current = collaborationRole;
  }, [collaborationRole]);
  useEffect(() => {
    isCollaboratingRef.current = isCollaborating;
  }, [isCollaborating]);

  // Memoize layoutData to avoid recalculating on every render
  // Only include actual content data, exclude UI state like selectedKeys
  const layoutData = useMemo(() => ({
    layout: config.layout,
    globalSettings: config.globalSettings,
    groups: config.groups,
    currentLayoutType: config.currentLayoutType,
    layoutStandard: config.layoutStandard,
    currentTheme: config.currentTheme
  }), [
    config.layout,
    config.globalSettings,
    config.groups,
    config.currentLayoutType,
    config.layoutStandard,
    config.currentTheme
  ]);

  // Memoize config hash to avoid recalculating JSON.stringify on every render
  const configHash = useMemo(() => JSON.stringify(layoutData), [layoutData]);

  // Throttled socket emit function
  const emitSocketUpdate = useCallback((layoutDataToSend: typeof layoutData) => {
    const currentSocket = socketRef.current;
    const currentShareToken = shareTokenRef.current;
    const currentRole = collaborationRoleRef.current;
    const currentIsCollaborating = isCollaboratingRef.current;

    if (!currentSocket || !currentShareToken || currentRole !== 'EDITOR' || !currentIsCollaborating) {
      return;
    }

    const now = Date.now();
    const timeSinceLastEmit = now - lastSocketEmitTimeRef.current;
    const hashToSend = JSON.stringify(layoutDataToSend);

    // If same hash, skip
    if (lastSocketEmitRef.current === hashToSend) {
      return;
    }

    // If enough time has passed, emit immediately
    if (timeSinceLastEmit >= SOCKET_THROTTLE_MS) {
      currentSocket.emit('share:update', {
        token: currentShareToken,
        layoutData: layoutDataToSend
      });
      lastSocketEmitRef.current = hashToSend;
      lastSocketEmitTimeRef.current = now;
      
      // Clear any pending throttle
      if (socketEmitThrottleRef.current) {
        clearTimeout(socketEmitThrottleRef.current);
        socketEmitThrottleRef.current = null;
      }
    } else {
      // Schedule emit after throttle period
      if (socketEmitThrottleRef.current) {
        clearTimeout(socketEmitThrottleRef.current);
      }
      
      socketEmitThrottleRef.current = setTimeout(() => {
        const finalHash = JSON.stringify(layoutDataToSend);
        if (lastSocketEmitRef.current !== finalHash) {
          currentSocket.emit('share:update', {
            token: currentShareToken,
            layoutData: layoutDataToSend
          });
          lastSocketEmitRef.current = finalHash;
          lastSocketEmitTimeRef.current = Date.now();
        }
        socketEmitThrottleRef.current = null;
      }, SOCKET_THROTTLE_MS - timeSinceLastEmit);
    }
  }, []);

  // Auto-save and send updates to WebSocket when config changes
  useEffect(() => {
    if (!currentConfigId) return;
    
    // Don't auto-save if we're applying a remote update (to avoid loops)
    if (isApplyingRemoteUpdate.current) {
      return;
    }

    // Skip if hash hasn't changed (memoized hash comparison)
    if (lastSavedConfigRef.current === configHash) {
      return;
    }

    // Throttled socket emit for real-time collaboration
    emitSocketUpdate(layoutData);

    // Debounced database save
    const timeoutId = setTimeout(async () => {
      // Double-check flag before saving
      if (isApplyingRemoteUpdate.current) {
        return;
      }

      // Double-check hash hasn't changed
      const currentHash = JSON.stringify(layoutData);
      if (lastSavedConfigRef.current === currentHash) {
        return;
      }

      // Auto-save to database
      try {
        await apiPut(`/api/configs/${currentConfigId}`, {
          layoutData
        });
        lastSavedConfigRef.current = currentHash;
      } catch (error) {
        console.error('[Auto-save] Failed to save config:', error);
      }
    }, DB_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [configHash, layoutData, currentConfigId, emitSocketUpdate]);

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

  // Track manual layer selection to prevent useEffect from overriding it
  const manualLayerSelectionRef = useRef<{ layerId: string; timestamp: number } | null>(null);
  const MANUAL_SELECTION_TIMEOUT = 100; // ms

  // Auto-select all layers when multi-selection starts (if no specific layer type is selected)
  // Also update when previewKeys change (during drag selection)
  useEffect(() => {
    // Skip auto-update if a manual layer selection was made recently
    if (manualLayerSelectionRef.current) {
      const timeSinceManualSelection = Date.now() - manualLayerSelectionRef.current.timestamp;
      if (timeSinceManualSelection < MANUAL_SELECTION_TIMEOUT) {
        return; // Don't override manual selection
      }
      // Clear the ref after timeout
      manualLayerSelectionRef.current = null;
    }

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
      // BUT: if selectedLayerIds has only one layer (manual selection), don't override
      if (selectedLayerIds.length === 1) {
        // Check if the single selected layer belongs to the current key
        const layers = getKeyLayers(editingKeyId);
        const layerExists = layers.some(l => l.id === selectedLayerIds[0]);
        if (layerExists) {
          // Keep the manual selection
          return;
        }
      }
      
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
      setSelectedLayerIds([]);
      manualLayerSelectionRef.current = null;
    } else {
      selectLayer(layerId);
      // When a specific layer is selected, set selectedLayerIds to only that layer
      setSelectedLayerIds([layerId]);
      // Mark this as a manual selection to prevent useEffect from overriding it
      manualLayerSelectionRef.current = { layerId, timestamp: Date.now() };
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

  const handleColorChange = useCallback((color: string) => {
    if (config.selectedKeys.length > 0) {
      // Step 1: Immediate preview (visual only, no config state update)
      let keyIdsToPreview: string[] = [];
      
      if (isMultiSelection && selectedLayerIds.length > 0) {
        const keyIdsWithSelectedLayers: string[] = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          const hasSelectedLayer = layers.some(layer => selectedLayerIds.includes(layer.id));
          if (hasSelectedLayer) {
            keyIdsWithSelectedLayers.push(keyId);
          }
        });
        keyIdsToPreview = keyIdsWithSelectedLayers;
      } else if (editingKeyId && selectedLayer) {
        keyIdsToPreview = [editingKeyId];
      } else {
        keyIdsToPreview = config.selectedKeys;
      }
      
      if (keyIdsToPreview.length > 0) {
        // Immediate visual preview
        previewKeycapColor(keyIdsToPreview, color);
        
        // Step 2: Throttled commit (updates config state and triggers auto-save/socket)
        pendingColorCommitRef.current = { keyIds: keyIdsToPreview, color };
        
        if (colorCommitThrottleRef.current) {
          clearTimeout(colorCommitThrottleRef.current);
        }
        
        colorCommitThrottleRef.current = setTimeout(() => {
          const pending = pendingColorCommitRef.current;
          if (pending) {
            updateKeycapColor(pending.keyIds, pending.color);
            pendingColorCommitRef.current = null;
          }
          colorCommitThrottleRef.current = null;
        }, COLOR_COMMIT_THROTTLE_MS);
      }
    }
  }, [config.selectedKeys, isMultiSelection, selectedLayerIds, editingKeyId, selectedLayer, previewKeycapColor, updateKeycapColor, getKeyLayers]);

  const handleTextColorChange = useCallback((textColor: string) => {
    if (config.selectedKeys.length > 0) {
      // Step 1: Immediate preview (visual only, no config state update)
      let keyIdsToPreview: string[] = [];
      let commitData: { items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> } | { keyId: string; layerId: string; color: string } | { keyIds: string[]; textColor: string } | null = null;
      
      if (selectedLayerIds.length > 0) {
        const items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          layers.forEach(layer => {
            if (selectedLayerIds.includes(layer.id)) {
              items.push({ keyId, layerId: layer.id, updates: { color: textColor } });
              if (!keyIdsToPreview.includes(keyId)) {
                keyIdsToPreview.push(keyId);
              }
            }
          });
        });
        if (items.length > 0) {
          commitData = { items };
        }
      } else if (editingKeyId && selectedLayer) {
        keyIdsToPreview = [editingKeyId];
        commitData = { keyId: editingKeyId, layerId: selectedLayer.id, color: textColor };
      } else {
        keyIdsToPreview = config.selectedKeys;
        commitData = { keyIds: config.selectedKeys, textColor };
      }
      
      if (keyIdsToPreview.length > 0 && commitData) {
        // Immediate visual preview
        previewKeycapTextColor(keyIdsToPreview, textColor);
        
        // Step 2: Throttled commit (updates config state and triggers auto-save/socket)
        pendingTextColorCommitRef.current = commitData;
        
        if (textColorCommitThrottleRef.current) {
          clearTimeout(textColorCommitThrottleRef.current);
        }
        
        textColorCommitThrottleRef.current = setTimeout(() => {
          const pending = pendingTextColorCommitRef.current;
          if (pending) {
            if ('items' in pending) {
              updateLayersBatch(pending.items);
            } else if ('keyId' in pending && 'layerId' in pending) {
              updateLayer(pending.keyId, pending.layerId, { color: pending.color });
            } else if ('keyIds' in pending && 'textColor' in pending) {
              updateKeycapTextColor(pending.keyIds, pending.textColor);
            }
            pendingTextColorCommitRef.current = null;
          }
          textColorCommitThrottleRef.current = null;
        }, COLOR_COMMIT_THROTTLE_MS);
      }
    }
  }, [config.selectedKeys, selectedLayerIds, editingKeyId, selectedLayer, previewKeycapTextColor, updateLayersBatch, updateLayer, updateKeycapTextColor, getKeyLayers]);

  const handleColorCommit = useCallback((color: string) => {
    // Final commit: clear any pending throttle and apply immediately
    if (colorCommitThrottleRef.current) {
      clearTimeout(colorCommitThrottleRef.current);
      colorCommitThrottleRef.current = null;
    }
    
    // Apply the final color change immediately
    if (config.selectedKeys.length > 0) {
      let keyIdsToUpdate: string[] = [];
      
      if (isMultiSelection && selectedLayerIds.length > 0) {
        const keyIdsWithSelectedLayers: string[] = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          const hasSelectedLayer = layers.some(layer => selectedLayerIds.includes(layer.id));
          if (hasSelectedLayer) {
            keyIdsWithSelectedLayers.push(keyId);
          }
        });
        keyIdsToUpdate = keyIdsWithSelectedLayers;
      } else if (editingKeyId && selectedLayer) {
        keyIdsToUpdate = [editingKeyId];
      } else {
        keyIdsToUpdate = config.selectedKeys;
      }
      
      if (keyIdsToUpdate.length > 0) {
        updateKeycapColor(keyIdsToUpdate, color);
        pendingColorCommitRef.current = null;
      }
    }
  }, [config.selectedKeys, isMultiSelection, selectedLayerIds, editingKeyId, selectedLayer, updateKeycapColor, getKeyLayers]);

  const handleTextColorCommit = useCallback((textColor: string) => {
    // Final commit: clear any pending throttle and apply immediately
    if (textColorCommitThrottleRef.current) {
      clearTimeout(textColorCommitThrottleRef.current);
      textColorCommitThrottleRef.current = null;
    }
    
    // Apply the final text color change immediately
    if (config.selectedKeys.length > 0) {
      if (selectedLayerIds.length > 0) {
        const items: Array<{ keyId: string; layerId: string; updates: Partial<KeycapLayer> }> = [];
        config.selectedKeys.forEach(keyId => {
          const layers = getKeyLayers(keyId);
          layers.forEach(layer => {
            if (selectedLayerIds.includes(layer.id)) {
              items.push({ keyId, layerId: layer.id, updates: { color: textColor } });
            }
          });
        });
        if (items.length > 0) {
          updateLayersBatch(items);
        }
      } else if (editingKeyId && selectedLayer) {
        updateLayer(editingKeyId, selectedLayer.id, { color: textColor });
      } else {
        updateKeycapTextColor(config.selectedKeys, textColor);
      }
      pendingTextColorCommitRef.current = null;
    }
  }, [config.selectedKeys, selectedLayerIds, editingKeyId, selectedLayer, updateLayersBatch, updateLayer, updateKeycapTextColor, getKeyLayers]);

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
              <ShareButton
                config={config}
                currentConfigId={currentConfigId}
                currentConfigName={currentConfigName}
                onShareTokenChange={(token) => {
                  setShareToken(token);
                  shareTokenRef.current = token; // Update ref immediately
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
              {/* Collaboration indicator */}
              {isCollaborating && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-500/20 text-blue-400 text-sm">
                  {collaborationRole === 'EDITOR' ? (
                    <>
                      <Users className="h-4 w-4" />
                      <span>Birlikte Düzenleniyor</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      <span>İzleme Modu</span>
                    </>
                  )}
                </div>
              )}
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
              onRenameGroup={renameGroup}
              editingKeyId={isMultiSelection ? null : editingKeyId}
              currentKeyLayers={isMultiSelection ? [] : currentKeyLayers}
              selectedLayerId={selectedLayerId}
              onLayerSelect={handleLayerSelect}
              onLayerReorder={(keyId, layerId, direction) => {
                if (isMultiSelection) {
                  // Multi-selection: reorder layer in all selected keys
                  activeKeys.forEach(kId => {
                    reorderLayer(kId, layerId, direction);
                  });
                } else {
                  // Single selection: reorder layer in the editing key
                  reorderLayer(keyId, layerId, direction);
                }
              }}
              onLayerDelete={(keyId, layerId) => {
                if (isMultiSelection) {
                  // Multi-selection: delete layer from all selected keys
                  activeKeys.forEach(kId => {
                    deleteLayer(kId, layerId);
                  });
                } else {
                  // Single selection: delete layer from the editing key
                  deleteLayer(keyId, layerId);
                }
              }}
              onAddTextLayer={() => {
                if (isMultiSelection) {
                  // Multi-selection: add layer to all selected keys
                  activeKeys.forEach(keyId => {
                    addLayer(keyId, 'text');
                  });
                } else if (editingKeyId) {
                  // Single selection: add layer to editing key
                  addLayer(editingKeyId, 'text');
                }
              }}
              onAddImageLayer={() => {
                if (isMultiSelection) {
                  // Multi-selection: add layer to all selected keys
                  activeKeys.forEach(keyId => {
                    addLayer(keyId, 'image');
                  });
                } else if (editingKeyId) {
                  // Single selection: add layer to editing key
                  addLayer(editingKeyId, 'image');
                }
              }}
                onAddIconLayer={() => {
                  if (isMultiSelection) {
                    // Multi-selection: add layer to all selected keys
                    activeKeys.forEach(keyId => {
                      addLayer(keyId, 'icon' as any);
                    });
                  } else if (editingKeyId) {
                    // Single selection: add layer to editing key
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
                onLayerDoubleClick={(layer) => {
                  // Select the layer first
                  handleLayerSelect(layer.id);
                  
                  // Open the appropriate toolbar section based on layer type
                  if (layer.type === 'text') {
                    setToolbarOpenSection('text');
                  } else if (layer.type === 'icon') {
                    setToolbarOpenSection('icon');
                  } else if (layer.type === 'image') {
                    setToolbarOpenSection('image');
                  }
                }}
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
                    openSection={toolbarOpenSection}
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
                        if (isMultiSelection) {
                          // Multi-selection: add layer to all selected keys
                          activeKeys.forEach(keyId => {
                            addLayer(keyId, 'text');
                          });
                        } else if (editingKeyId) {
                          // Single selection: add layer to editing key
                          addLayer(editingKeyId, 'text');
                        }
                      }}
                      onAddImageLayer={() => {
                        if (isMultiSelection) {
                          // Multi-selection: add layer to all selected keys
                          activeKeys.forEach(keyId => {
                            addLayer(keyId, 'image');
                          });
                        } else if (editingKeyId) {
                          // Single selection: add layer to editing key
                          addLayer(editingKeyId, 'image');
                        }
                      }}
                      onAddIconLayer={() => {
                        if (isMultiSelection) {
                          // Multi-selection: add layer to all selected keys
                          activeKeys.forEach(keyId => {
                            addLayer(keyId, 'icon' as any);
                          });
                        } else if (editingKeyId) {
                          // Single selection: add layer to editing key
                          addLayer(editingKeyId, 'icon' as any);
                        }
                      }}
                      onLayerTypeChange={(layerId, newType) => {
                        if (editingKeyId) {
                          // Get current layer to preserve content if possible
                          const currentLayer = currentKeyLayers.find(l => l.id === layerId);
                          const updates: Partial<KeycapLayer> = { type: newType };
                          
                          // If changing to text and no content, set default
                          if (newType === 'text' && !currentLayer?.content) {
                            updates.content = 'New Text';
                          }
                          // If changing to icon/image and content doesn't match type, clear it
                          else if (newType === 'icon' && currentLayer?.type !== 'icon') {
                            updates.content = undefined;
                          }
                          else if (newType === 'image' && currentLayer?.type !== 'image') {
                            updates.content = undefined;
                          }
                          
                          updateLayer(editingKeyId, layerId, updates);
                        }
                      }}
                      onOpenToolbarSection={(section) => {
                        setToolbarOpenSection(section);
                        // Reset after a short delay to allow the section to open
                        setTimeout(() => setToolbarOpenSection(null), 100);
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
                        onClick={(e) => {
                          // Prevent click from propagating to parent and deselecting keys
                          e.stopPropagation();
                        }}
                      >
                        {/* simple palette icon via SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2a10 10 0 0 0-10 10 6 6 0 0 0 6 6h1a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3c4.418 0 8-3.582 8-8A10 10 0 0 0 12 2Zm-3 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm4 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>
                        <span>Arka Plan</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-96 p-4" 
                      align="end"
                      onClick={(e) => {
                        // Prevent click from propagating to parent and deselecting keys
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        // Prevent mousedown from propagating to parent and deselecting keys
                        e.stopPropagation();
                      }}
                    >
                      <BackgroundPanel value={backgroundSettings} onChange={setBackgroundSettings} />
                    </PopoverContent>
                  </Popover>
                  <Popover open={caseOpen} onOpenChange={setCaseOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors w-full flex items-center gap-2"
                        title="Klavye Kasa Rengi"
                        onClick={(e) => {
                          // Prevent click from propagating to parent and deselecting keys
                          e.stopPropagation();
                        }}
                      >
                        {/* Box icon for case */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        <span>Klavye Kasa Rengi</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-96 p-4" 
                      align="end"
                      onClick={(e) => {
                        // Prevent click from propagating to parent and deselecting keys
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        // Prevent mousedown from propagating to parent and deselecting keys
                        e.stopPropagation();
                      }}
                    >
                      <CasePanel value={caseSettings} onChange={setCaseSettings} />
                    </PopoverContent>
                  </Popover>
                  <Popover open={uiOpen} onOpenChange={setUiOpen}>
                    <PopoverTrigger asChild>
                      <button
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors w-full flex items-center gap-2"
                        title="UI Renkleri"
                        onClick={(e) => {
                          // Prevent click from propagating to parent and deselecting keys
                          e.stopPropagation();
                        }}
                      >
                        {/* Layout icon for UI */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>
                        <span>UI Renkleri</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-96 p-4 max-h-[600px] overflow-y-auto" 
                      align="end"
                      onClick={(e) => {
                        // Prevent click from propagating to parent and deselecting keys
                        e.stopPropagation();
                      }}
                      onMouseDown={(e) => {
                        // Prevent mousedown from propagating to parent and deselecting keys
                        e.stopPropagation();
                      }}
                    >
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
