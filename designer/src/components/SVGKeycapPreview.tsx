import React, { forwardRef, useState } from 'react';
import { KeycapConfig } from '@/types/keyboard';
import SVGKeycap from './SVGKeycap';

interface SVGKeycapPreviewProps {
  keycap: KeycapConfig;
  selected: boolean;
  previewSelected?: boolean;
  onClick: (event: React.MouseEvent) => void;
  onDoubleClick: () => void;
  scale?: number;
  currentTheme?: string;
}

const SVGKeycapPreview = forwardRef<HTMLDivElement, SVGKeycapPreviewProps>(
  (
    {
      keycap,
      selected,
      previewSelected = false,
      onClick,
      onDoubleClick,
      scale = 1,
      currentTheme,
    },
    ref
  ) => {
    const [hovered, setHovered] = useState(false);
    const UNIT = 48 * scale;
    const KEY_SPACING = 4 * scale;
    const width = keycap.width * UNIT - KEY_SPACING;
    const height = keycap.height * UNIT - KEY_SPACING;

    // Determine if this is an L-shaped keycap (ISO Enter)
    // ISO Enter keys are identified by their physical dimensions, not content
    // They are typically 1.5u or 2u wide and 2u tall
    // This ensures the shape is preserved regardless of the content
    const isLShape = keycap.height === 2 && (keycap.width === 1.5 || keycap.width === 2);

    const leftExtend = Math.max(0, width * 0.3);
    
    const handleClick = (event: React.MouseEvent) => {
      event.stopPropagation(); // Prevent event from bubbling to parent div
      onClick(event);
    };
    
    return (
      <div
        ref={ref}
        onClick={handleClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          relative cursor-pointer transition-all duration-150
          ${selected ? 'z-10' : 'z-0'}
          ${previewSelected ? 'opacity-50' : 'opacity-100'}
        `}
        style={{
          width: width,
          height: height,
        }}
      >
        <SVGKeycap
          keycap={keycap}
          scale={scale}
          showBorder={selected}
          shape={isLShape ? 'l-shape' : 'rect'}
          lShapeConfig={isLShape ? {
            anchor: 'top-right',
            // Keep top/right fixed; ensure bottom gap matches other keys
            margins: { top: 0, right: 0, bottom: 4 * scale, left: -leftExtend },
            // Keep canonical notch height (1u) and extend inner left optically
            notch: { widthUnits: 0.75, heightUnits: 1, adjustLeftPx: 0, bottomAdjustLeftPx: 0 },
            baseWidthUnits: 2  // Top bar is 2u wide
          } : undefined}
          selected={selected}
          hovered={hovered}
          currentTheme={currentTheme}
        />
      </div>
    );
  }
);

SVGKeycapPreview.displayName = 'SVGKeycapPreview';

export default SVGKeycapPreview;