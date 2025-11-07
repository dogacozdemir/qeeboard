import { KeycapConfig, KeycapLayer } from '@/types/keyboard';
import { createKeycapShape } from '@/data/svgKeycapShapes';

// Helper function to adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export interface SVGKeycapOptions {
  scale?: number;
  showBorder?: boolean;
  borderColor?: string;
  className?: string;
}

/**
 * Generates an SVG string for a keycap that matches the webapp design
 */
export function generateSVGKeycap(
  keycap: KeycapConfig,
  options: SVGKeycapOptions = {}
): string {
  const {
    scale = 1,
    showBorder = false,
    borderColor = '#1990ff',
    className = ''
  } = options;

  const UNIT = 48 * scale;
  const KEY_SPACING = 4 * scale;
  const BORDER_RADIUS = 2 * scale;
  const INNER_RADIUS = 3 * scale; // Match CSS version exactly

  const width = keycap.width * UNIT - KEY_SPACING;
  const height = keycap.height * UNIT - KEY_SPACING;

  // Calculate positions for inner square (matching KeycapPreview)
  const innerTop = 2 * scale;
  const innerLeft = 6 * scale;
  const innerRight = 6 * scale;
  const innerBottom = 10 * scale;

  const innerWidth = width - innerLeft - innerRight;
  const innerHeight = height - innerTop - innerBottom;

  // Get base color (darker version)
  const baseColor = adjustColor(keycap.color || '#ffffff', -20);
  const mainColor = keycap.color || '#ffffff';

  // Create the keycap shape with colors
  const keycapShape = createKeycapShape(keycap.width, keycap.height, baseColor, mainColor, keycap.id);

  const renderLayer = (layer: KeycapLayer, index: number): string => {
    const transform = `
      rotate(${layer.rotation || 0})
      scale(${layer.mirrorX ? -1 : 1}, ${layer.mirrorY ? -1 : 1})
    `;

    if (layer.type === 'image' && layer.content && layer.content.trim() !== '') {
      const legendX = keycapShape.legendArea.x * scale;
      const legendY = keycapShape.legendArea.y * scale;
      const legendWidth = keycapShape.legendArea.width * scale;
      const legendHeight = keycapShape.legendArea.height * scale;
      
      return `
        <g transform="${transform}">
          <image
            href="${layer.content}"
            x="${legendX}"
            y="${legendY}"
            width="${legendWidth}"
            height="${legendHeight}"
            clip-path="url(#inner-area-clip-${keycap.id})"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      `;
    }

    // Text layer
    const fontSize = (layer.fontSize || 14) * scale;
    const textColor = layer.color || keycap.textColor || '#ffffff';
    const textHsl = hexToHsl(textColor);

    // Calculate text position - 100% of inner square area
    const innerX = keycapShape.legendArea.x * scale;
    const innerY = keycapShape.legendArea.y * scale;
    const innerWidth = keycapShape.legendArea.width * scale;
    const innerHeight = keycapShape.legendArea.height * scale;
    
    let textX = innerX + innerWidth / 2;
    let textY = innerY + innerHeight / 2;
    let textAnchor = 'middle';
    let dominantBaseline = 'middle';

    // Horizontal alignment - full inner square width
    if (layer.alignment === 'left') {
      textX = innerX;
      textAnchor = 'start';
    } else if (layer.alignment === 'right') {
      textX = innerX + innerWidth;
      textAnchor = 'end';
    }

    // Vertical alignment - full inner square height
    if (layer.verticalAlignment === 'top') {
      textY = innerY;
      dominantBaseline = 'text-before-edge';
    } else if (layer.verticalAlignment === 'bottom') {
      textY = innerY + innerHeight;
      dominantBaseline = 'text-after-edge';
    }

    const fontWeight = layer.bold ? 'bold' : 'normal';
    const fontStyle = layer.italic ? 'italic' : 'normal';
    const textDecoration = layer.underline ? 'underline' : 'none';

    return `
      <g transform="${transform}" clip-path="url(#inner-area-clip-${keycap.id})">
        <text
          x="${textX}"
          y="${textY}"
          font-size="${fontSize}"
          font-family="${layer.font || 'inherit'}"
          font-weight="${fontWeight}"
          font-style="${fontStyle}"
          text-decoration="${textDecoration}"
          fill="hsl(${textHsl.h}, ${textHsl.s}%, ${textHsl.l}%)"
          text-anchor="${textAnchor}"
          dominant-baseline="${dominantBaseline}"
        >
          ${layer.content || ''}
        </text>
      </g>
    `;
  };

  const layers = keycap.layers?.map((layer, index) => renderLayer(layer, index)).join('') || '';

  return `
    <svg
      width="${width}"
      height="${height}"
      viewBox="0 0 ${width} ${height}"
      class="${className}"
      style="border-radius: ${BORDER_RADIUS}px"
    >
      <defs>
        <!-- Clipping path for inner area only -->
        <clipPath id="inner-area-clip-${keycap.id}">
          <rect
            x="${keycapShape.legendArea.x * scale}"
            y="${keycapShape.legendArea.y * scale}"
            width="${keycapShape.legendArea.width * scale}"
            height="${keycapShape.legendArea.height * scale}"
            rx="${3 * scale}"
          />
        </clipPath>
      </defs>

      <!-- Keycap shape with colors -->
      <g transform="scale(${scale})">
        ${keycapShape.svgPath}
      </g>

      <!-- Border ring if selected -->
      ${showBorder ? `
        <rect
          x="-2"
          y="-2"
          width="${width + 4}"
          height="${height + 4}"
          rx="${BORDER_RADIUS + 2}"
          fill="none"
          stroke="${borderColor}"
          stroke-width="2"
          stroke-opacity="0.5"
        />
      ` : ''}

      <!-- Content layers -->
      ${layers}
    </svg>
  `;
}

/**
 * Creates a simple keycap configuration for quick SVG generation
 */
export function createSimpleKeycap(
  content: string,
  color: string = '#1990ff',
  textColor: string = '#ffffff',
  options: {
    width?: number;
    height?: number;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  } = {}
): KeycapConfig {
  const {
    width = 1,
    height = 1,
    fontSize = 16,
    bold = false,
    italic = false,
    underline = false
  } = options;

  return {
    id: `key-${Date.now()}`,
    row: 0,
    col: 0,
    width,
    height,
    x: 0,
    y: 0,
    color,
    textColor,
    layers: [
      {
        id: `layer-${Date.now()}`,
        type: 'text',
        content,
        fontSize,
        color: textColor,
        alignment: 'center',
        verticalAlignment: 'center',
        bold,
        italic,
        underline,
      }
    ]
  };
}

/**
 * Downloads an SVG keycap as a file
 */
export function downloadSVGKeycap(
  keycap: KeycapConfig,
  filename: string = 'keycap.svg',
  options: SVGKeycapOptions = {}
): void {
  const svgString = generateSVGKeycap(keycap, options);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
