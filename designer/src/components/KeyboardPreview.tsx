import React, { useState, useRef, useCallback, useEffect } from 'react';
import { KeyboardLayout, KeycapLayer } from '@/types/keyboard';
import SVGKeycapPreview from './SVGKeycapPreview';
import KeyLayerPreview from './KeyLayerPreview';
import { Monitor, Box, RefreshCw } from 'lucide-react';

interface KeyboardPreviewProps {
  layout: KeyboardLayout;
  selectedKeys: string[];
  onKeySelect: (keyId: string, event: React.MouseEvent) => void;
  onKeyDoubleClick: (keyId: string) => void;
  previewKeys?: string[];
  keyRefs?: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  editingKeyId?: string | null;
  currentKeyLayers?: KeycapLayer[];
  selectedLayerId?: string | null;
  onLayerSelect?: (layerId: string) => void;
  onAddTextLayer?: () => void;
  onAddImageLayer?: () => void;
  onAddIconLayer?: () => void;
  onLayerTypeChange?: (layerId: string, newType: 'text' | 'image' | 'icon') => void;
  onOpenToolbarSection?: (section: 'text' | 'icon' | 'image') => void;
  currentTheme?: string;
  fitToContainer?: boolean;
  readOnly?: boolean;
  view3D?: boolean;
  onView3DToggle?: () => void;
  backgroundOpen?: boolean;
  onBackgroundOpenChange?: (open: boolean) => void;
  caseSettings?: { mode: 'solid'|'gradient'|'default'; solid?: string; from?: string; to?: string; angle?: number };
}

const KeyboardPreview: React.FC<KeyboardPreviewProps> = ({
  layout,
  selectedKeys,
  onKeySelect,
  onKeyDoubleClick,
  previewKeys = [],
  keyRefs,
  editingKeyId,
  currentKeyLayers = [],
  selectedLayerId,
  onLayerSelect,
  onAddTextLayer,
  onAddImageLayer,
  onAddIconLayer,
  onLayerTypeChange,
  onOpenToolbarSection,
  currentTheme,
  fitToContainer = false,
  readOnly = false,
  view3D = false,
  onView3DToggle,
  caseSettings,
}) => {
  const UNIT = 48;
  const BASE_SCALE = 1.1;
  
  // Keyboard case padding - more realistic spacing
  const CASE_PADDING = 20;

  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Zoom limits
  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 3;

  // Derive tight bounds from keys to avoid extra horizontal space on some layouts
  const maxWidthUnits = Math.max(
    0,
    ...layout.keys.map((k) => (k.x + k.width))
  );
  const maxHeightUnits = Math.max(
    0,
    ...layout.keys.map((k) => (k.y + k.height))
  );

  const keycapsWidth = maxWidthUnits * UNIT * BASE_SCALE;
  const keycapsHeight = maxHeightUnits * UNIT * BASE_SCALE;
  
  const caseWidth = keycapsWidth + (CASE_PADDING * 2);
  const caseHeight = keycapsHeight + (CASE_PADDING * 2);

  // Zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
    
    if (newZoom !== zoom) {
      // Calculate zoom point relative to container center
      const containerCenterX = rect.width / 2;
      const containerCenterY = rect.height / 2;
      
      const zoomPointX = mouseX - containerCenterX;
      const zoomPointY = mouseY - containerCenterY;
      
      // Adjust pan to zoom towards mouse position
      const zoomRatio = newZoom / zoom;
      const newPanX = pan.x - (zoomPointX * (zoomRatio - 1));
      const newPanY = pan.y - (zoomPointY * (zoomRatio - 1));
      
      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
  }, [zoom, pan, MIN_ZOOM, MAX_ZOOM]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { // Right click
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Reset zoom and pan
  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '0':
          e.preventDefault();
          resetView();
          break;
        case '=':
        case '+':
          e.preventDefault();
          setZoom(prev => Math.min(MAX_ZOOM, prev * 1.2));
          break;
        case '-':
          e.preventDefault();
          setZoom(prev => Math.max(MIN_ZOOM, prev / 1.2));
          break;
      }
    }
  }, [resetView, MAX_ZOOM, MIN_ZOOM]);

  // Event listeners
  useEffect(() => {
    if (fitToContainer) {
      return; // controls disabled when fitting to container
    }
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown, fitToContainer]);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Fit to container: compute zoom to fully contain keyboard case
  useEffect(() => {
    if (!fitToContainer) return;
    const container = containerRef.current;
    if (!container) return;

    const compute = () => {
      const rect = container.getBoundingClientRect();
      const fit = Math.min(
        rect.width / caseWidth,
        rect.height / caseHeight
      );
      setZoom(fit > 0 && Number.isFinite(fit) ? fit : 1);
      setPan({ x: 0, y: 0 });
    };
    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(container);
    window.addEventListener('resize', compute);
    return () => {
      try { ro.disconnect(); } catch {}
      window.removeEventListener('resize', compute);
    };
  }, [fitToContainer, caseWidth, caseHeight]);

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
    >
      {/* Zoom and Pan Controls */}
      {!fitToContainer && (
      <div className="absolute top-28 right-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={resetView}
            className="p-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors flex items-center justify-center"
            title="Reset View (Ctrl+0)"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <div className="px-3 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-600">
            {Math.round(zoom * 100)}%
          </div>
        </div>
        {onView3DToggle && (
          <button
            onClick={onView3DToggle}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors flex items-center justify-center gap-2"
            title={view3D ? "Switch to 2D View" : "Switch to 3D View"}
          >
            {view3D ? <Monitor className="h-4 w-4" /> : <Box className="h-4 w-4" />}
            <span>{view3D ? "2D" : "3D"}</span>
          </button>
        )}
      </div>
      )}

      {/* Keyboard Container with Transform */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: (isPanning || fitToContainer) ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* Keyboard Case - dynamic background */}
        <div
          ref={keyboardRef}
          className="relative"
          style={{
            width: caseWidth,
            height: caseHeight,
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            padding: CASE_PADDING,
            ...(caseSettings?.mode === 'default' 
              ? { backgroundColor: '#111827' } 
              : caseSettings?.mode === 'solid' && caseSettings?.solid
              ? { backgroundColor: caseSettings.solid }
              : caseSettings?.mode === 'gradient' && caseSettings?.from && caseSettings?.to
              ? { 
                  background: `linear-gradient(${caseSettings.angle || 135}deg, ${caseSettings.from}, ${caseSettings.to})`
                }
              : { backgroundColor: '#111827' }
            ),
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              // background click
            }
          }}
        >
          {/* Keycaps container */}
          <div
            className="relative"
            style={{
              width: keycapsWidth,
              height: keycapsHeight,
            }}
          >
            {/* Keycaps (SVG only) */}
            {layout.keys.map((keycap) => (
              <div
                key={keycap.id}
                ref={(el: HTMLDivElement | null) => {
                  if (keyRefs) {
                    keyRefs.current[keycap.id] = el;
                  }
                }}
                style={{
                  position: 'absolute',
                  left: keycap.x * UNIT * BASE_SCALE,
                  top: keycap.y * UNIT * BASE_SCALE,
                  width: keycap.width * UNIT * BASE_SCALE,
                  height: keycap.height * UNIT * BASE_SCALE,
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              >
                <SVGKeycapPreview
                  keycap={keycap}
                  selected={selectedKeys.includes(keycap.id)}
                  previewSelected={previewKeys.includes(keycap.id)}
                  scale={BASE_SCALE}
                  onClick={(event: React.MouseEvent) => {
                    if (!readOnly) onKeySelect(keycap.id, event);
                  }}
                  onDoubleClick={() => {
                    if (!readOnly) onKeyDoubleClick(keycap.id);
                  }}
                  currentTheme={currentTheme}
                />
              </div>
            ))}

            {/* Layer Preview */}
            {editingKeyId &&
              onLayerSelect &&
              (() => {
                const selectedKey = layout.keys.find(
                  (key) => key.id === editingKeyId
                );
                if (!selectedKey) return null;

                return (
                  <KeyLayerPreview
                    layers={currentKeyLayers}
                    selectedLayerId={selectedLayerId || null}
                    onLayerSelect={onLayerSelect}
                    onClose={() => onLayerSelect && onLayerSelect('')}
                    onAddTextLayer={onAddTextLayer}
                    onAddImageLayer={onAddImageLayer}
                    onAddIconLayer={onAddIconLayer}
                    onLayerTypeChange={onLayerTypeChange}
                    onOpenToolbarSection={onOpenToolbarSection}
                    keyPosition={{
                      x: selectedKey.x * UNIT * BASE_SCALE,
                      y: selectedKey.y * UNIT * BASE_SCALE,
                      width: selectedKey.width * UNIT * BASE_SCALE,
                      height: selectedKey.height * UNIT * BASE_SCALE,
                    }}
                    unit={UNIT * BASE_SCALE}
                    padding={CASE_PADDING}
                  />
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardPreview;