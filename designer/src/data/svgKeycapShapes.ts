// SVG Keycap Shape Library
// Based on reference images with 3D beveled effect

export interface KeycapSVGShape {
  id: string;
  name: string;
  width: number; // in keycap units (1u = 48px)
  height: number; // in keycap units
  svgPath: string;
  legendArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description: string;
}

export interface KeycapSVGShapeTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  createSVG: (baseColor: string, mainColor: string) => string;
  legendArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description: string;
}

// Helper function to calculate legend area dynamically
const calculateLegendArea = (width: number, height: number) => {
  const w = width * 48; // Convert to pixels
  const h = height * 48;
  
  // Same positioning as inner square: x=6, y=2, width=w-12, height=h-12
  return {
    x: 6,
    y: 2,
    width: w - 12,
    height: h - 12
  };
};

// Special legend area for ISO Enter (L-shaped)
const calculateISOEnterLegendArea = () => {
  const w = 1.25 * 48; // 1.25u width
  const h = 2 * 48;    // 2u height
  
  // L-shaped inner area: x=6, y=2, width=w-12, height=h-12, but with L-shape cutout
  return {
    x: 6,
    y: 2,
    width: w - 12,
    height: h - 12
  };
};

// Special legend area for Stepped Caps Lock
const calculateSteppedCapsLegendArea = () => {
  const w = 1.75 * 48; // 1.75u width
  const h = 1 * 48;    // 1u height
  
  // Stepped inner area: x=6, y=2, width=w-12, height=h-12, but with step
  return {
    x: 6,
    y: 2,
    width: w - 12,
    height: h - 12
  };
};

// Helper function to create SVG path matching exact CSS structure
const createRectangularKeycap = (width: number, height: number, baseColor: string, mainColor: string): string => {
  const w = width * 48; // Convert to pixels
  const h = height * 48;
  const BORDER_RADIUS = 2; // Same as CSS
  const INNER_RADIUS = 3; // Same as CSS
  
  // Base layer - darker version (exactly like CSS)
  const baseLayer = `
    <rect x="0" y="0" width="${w}" height="${h}" 
          rx="${BORDER_RADIUS}" ry="${BORDER_RADIUS}"
          fill="${baseColor}" 
          stroke="rgba(0, 0, 0, 0.15)" 
          stroke-width="1"/>
  `;
  
  // Inner square - actual keycap color (exactly like CSS positioning)
  const innerSquare = `
    <rect x="6" y="2" 
          width="${w - 12}" height="${h - 12}" 
          rx="${INNER_RADIUS}" ry="${INNER_RADIUS}"
          fill="${mainColor}"/>
  `;
  
  return `${baseLayer}${innerSquare}`;
};

// ISO Enter keycap shape (L-shaped) - matching CSS structure
const createISOEnterKeycap = (baseColor: string, mainColor: string): string => {
  const w = 1.25 * 48; // 1.25u width
  const h = 2 * 48;    // 2u height
  const BORDER_RADIUS = 2;
  const INNER_RADIUS = 3;
  
  // Base layer - L-shaped darker version
  const baseLayer = `
    <path d="M 0 ${BORDER_RADIUS}
             L 0 ${h - BORDER_RADIUS}
             Q 0 ${h} ${BORDER_RADIUS} ${h}
             L ${w - 24 - BORDER_RADIUS} ${h}
             Q ${w - 24} ${h} ${w - 24} ${h - BORDER_RADIUS}
             L ${w - 24} ${h - 24}
             L ${w - BORDER_RADIUS} ${h - 24}
             Q ${w} ${h - 24} ${w} ${h - 24 - BORDER_RADIUS}
             L ${w} ${BORDER_RADIUS}
             Q ${w} 0 ${w - BORDER_RADIUS} 0
             L ${BORDER_RADIUS} 0
             Q 0 0 0 ${BORDER_RADIUS}
             Z"
          fill="${baseColor}" 
          stroke="rgba(0, 0, 0, 0.15)" 
          stroke-width="1"/>
  `;
  
  // Inner square - L-shaped actual keycap color
  const innerSquare = `
    <path d="M 6 2
             L ${w - 6} 2
             L ${w - 6} ${h - 24 - 2}
             L ${w - 24 - 6} ${h - 24 - 2}
             L ${w - 24 - 6} ${h - 2}
             L 6 ${h - 2}
             Z"
          fill="${mainColor}"/>
  `;
  
  return `${baseLayer}${innerSquare}`;
};

// Space bar shape (wide rectangular) - matching CSS structure
const createSpaceBarKeycap = (baseColor: string, mainColor: string): string => {
  return createRectangularKeycap(6.25, 1, baseColor, mainColor);
};

// Stepped Caps Lock shape - matching CSS structure
const createSteppedCapsLockKeycap = (baseColor: string, mainColor: string): string => {
  const w = 1.75 * 48; // 1.75u width
  const h = 1 * 48;    // 1u height
  const BORDER_RADIUS = 2;
  const stepHeight = 8;
  
  // Base layer - stepped darker version
  const baseLayer = `
    <path d="M 0 ${BORDER_RADIUS}
             L 0 ${h - BORDER_RADIUS}
             Q 0 ${h} ${BORDER_RADIUS} ${h}
             L ${w - BORDER_RADIUS} ${h}
             Q ${w} ${h} ${w} ${h - BORDER_RADIUS}
             L ${w} ${BORDER_RADIUS}
             Q ${w} 0 ${w - BORDER_RADIUS} 0
             L ${w - 12 - BORDER_RADIUS} 0
             Q ${w - 12} 0 ${w - 12} ${BORDER_RADIUS}
             L ${BORDER_RADIUS} ${BORDER_RADIUS}
             Q ${BORDER_RADIUS} 0 ${BORDER_RADIUS} 0
             Z"
          fill="${baseColor}" 
          stroke="rgba(0, 0, 0, 0.15)" 
          stroke-width="1"/>
  `;
  
  // Inner square - stepped actual keycap color
  const innerSquare = `
    <path d="M 6 2
             L ${w - 12 - 6} 2
             L ${w - 12 - 6} ${2 + stepHeight}
             L ${w - 6} ${2 + stepHeight}
             L ${w - 6} ${h - 2}
             L 6 ${h - 2}
             Z"
          fill="${mainColor}"/>
  `;
  
  return `${baseLayer}${innerSquare}`;
};

// Keycap shape templates library
export const keycapShapeTemplates: KeycapSVGShapeTemplate[] = [
  {
    id: '1u',
    name: '1 Unit',
    width: 1,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(1, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(1, 1),
    description: 'Standard 1u keycap (letters, numbers, symbols)'
  },
  {
    id: '1.25u',
    name: '1.25 Unit',
    width: 1.25,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(1.25, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(1.25, 1),
    description: 'Wider keycap (Tab, Caps Lock, etc.)'
  },
  {
    id: '1.5u',
    name: '1.5 Unit',
    width: 1.5,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(1.5, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(1.5, 1),
    description: 'Wide keycap (Shift keys)'
  },
  {
    id: '1.75u',
    name: '1.75 Unit',
    width: 1.75,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(1.75, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(1.75, 1),
    description: 'Extra wide keycap (Caps Lock, Enter)'
  },
  {
    id: '2u',
    name: '2 Unit',
    width: 2,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(2, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(2, 1),
    description: 'Double width keycap (Backspace, Enter)'
  },
  {
    id: '2.25u',
    name: '2.25 Unit',
    width: 2.25,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(2.25, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(2.25, 1),
    description: 'Extra wide keycap (ANSI Enter)'
  },
  {
    id: '2.75u',
    name: '2.75 Unit',
    width: 2.75,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createRectangularKeycap(2.75, 1, baseColor, mainColor),
    legendArea: calculateLegendArea(2.75, 1),
    description: 'Very wide keycap (Right Shift)'
  },
  {
    id: '6.25u',
    name: '6.25 Unit Space',
    width: 6.25,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createSpaceBarKeycap(baseColor, mainColor),
    legendArea: calculateLegendArea(6.25, 1),
    description: 'Standard space bar'
  },
  {
    id: '6.5u',
    name: '6.5 Unit Space',
    width: 6.5,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createSpaceBarKeycap(baseColor, mainColor),
    legendArea: calculateLegendArea(6.5, 1),
    description: 'Wide space bar'
  },
  {
    id: '7u',
    name: '7 Unit Space',
    width: 7,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createSpaceBarKeycap(baseColor, mainColor),
    legendArea: calculateLegendArea(7, 1),
    description: 'Extra wide space bar'
  },
  {
    id: 'iso-enter',
    name: 'ISO Enter',
    width: 1.25,
    height: 2,
    createSVG: (baseColor: string, mainColor: string) => createISOEnterKeycap(baseColor, mainColor),
    legendArea: calculateISOEnterLegendArea(),
    description: 'ISO L-shaped Enter key'
  },
  {
    id: 'stepped-caps',
    name: 'Stepped Caps Lock',
    width: 1.75,
    height: 1,
    createSVG: (baseColor: string, mainColor: string) => createSteppedCapsLockKeycap(baseColor, mainColor),
    legendArea: calculateSteppedCapsLegendArea(),
    description: 'Stepped Caps Lock key'
  }
];

// Helper function to find the best matching keycap shape template
export const findKeycapShapeTemplate = (width: number, height: number, keyId?: string): KeycapSVGShapeTemplate => {
  // First, try to match by key ID for special keys
  if (keyId) {
    const specialKeys: Record<string, string> = {
      'Backspace': '2u',
      'Enter': '2.25u',
      'Shift': '2.75u',
      'Space': '6.25u',
      'Caps Lock': 'stepped-caps',
      'Tab': '1.25u',
      'Ctrl': '1.25u',
      'Alt': '1.25u',
      'Fn': '1.25u',
      'Win': '1.25u',
      'Menu': '1.25u'
    };
    
    const specialShape = specialKeys[keyId];
    if (specialShape) {
      const template = keycapShapeTemplates.find(s => s.id === specialShape);
      if (template) return template;
    }
  }
  
  // Then try to match by exact dimensions
  const exactMatch = keycapShapeTemplates.find(template => 
    Math.abs(template.width - width) < 0.01 && Math.abs(template.height - height) < 0.01
  );
  
  if (exactMatch) return exactMatch;
  
  // Finally, find the closest match by area
  const targetArea = width * height;
  const closestMatch = keycapShapeTemplates.reduce((closest, current) => {
    const currentArea = current.width * current.height;
    const closestArea = closest.width * closest.height;
    
    const currentDiff = Math.abs(currentArea - targetArea);
    const closestDiff = Math.abs(closestArea - targetArea);
    
    return currentDiff < closestDiff ? current : closest;
  });
  
  return closestMatch;
};

// Helper function to create a keycap shape with colors
export const createKeycapShape = (width: number, height: number, baseColor: string, mainColor: string, keyId?: string): KeycapSVGShape => {
  const template = findKeycapShapeTemplate(width, height, keyId);
  return {
    id: template.id,
    name: template.name,
    width: template.width,
    height: template.height,
    svgPath: template.createSVG(baseColor, mainColor),
    legendArea: template.legendArea,
    description: template.description
  };
};
