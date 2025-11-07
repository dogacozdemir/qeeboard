# Keycap Configurator - Project Reference

## Project Overview
A React-based mechanical keyboard keycap configurator built with Lovable. Features a full-width responsive layout with fixed control panel and flexible keyboard preview area. Allows users to design custom keycaps with 2D/3D previews, color customization, legend editing, and group management.

## Tech Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS 3.4.17
- **3D Graphics**: Three.js with @react-three/fiber & @react-three/drei
- **State Management**: React hooks (useState, useCallback)
- **Routing**: React Router DOM 6.30.1
- **Icons**: Lucide React 0.462.0
- **Forms**: React Hook Form 7.61.1 with Zod validation

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── ColorPicker.tsx  # Basic color picker
│   ├── DragSelection.tsx # Multi-key selection via drag
│   ├── EnhancedColorPicker.tsx # Advanced color picker with eyedropper
│   ├── EnhancedLegendEditor.tsx # Text/image legend editor
│   ├── ExportPanel.tsx  # Configuration export functionality
│   ├── FloatingToolbar.tsx # Compact floating toolbar (Canva-style)
│   ├── GroupManager.tsx # Key group management
│   ├── Keyboard3D.tsx   # 3D keyboard preview
│   ├── KeyboardPreview.tsx # 2D keyboard preview with layer preview
│   ├── KeycapPreview.tsx # Individual keycap component (CSS-based)
│   ├── SVGKeycap.tsx # SVG-based keycap component with L-shape support
│   ├── SVGKeycapPreview.tsx # SVG keycap preview wrapper
│   ├── KeyLayerPreview.tsx # Compact layer preview above selected key
│   ├── LayerEditor.tsx  # Individual layer editing interface
│   ├── LayerManager.tsx # Multi-layer management interface
│   ├── LayoutSelector.tsx # Keyboard layout selection (legacy)
│   ├── CompactLayoutSelector.tsx # Compact layout dropdown
│   └── UnifiedSidebar.tsx # Merged sidebar with layout, groups, and layers
├── data/
│   ├── layouts.ts       # Keyboard layout definitions
│   └── 60-iso.svg       # Reference SVG for 60% ISO layout
├── hooks/
│   ├── useKeyboardConfig.ts # Main state management hook
│   ├── useLayerManagement.ts # Layer management functionality
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notifications
├── lib/
│   └── utils.ts         # Utility functions (cn helper)
├── pages/
│   ├── Index.tsx        # Main application page
│   └── NotFound.tsx     # 404 page
├── types/
│   └── keyboard.ts      # TypeScript type definitions
├── App.tsx              # Main app component with routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and design system
```

## Core Types

### KeycapLayer
```typescript
interface KeycapLayer {
  id: string;
  type: 'text' | 'image';
  content: string; // text content or image data URL
  font?: string;
  fontSize?: number;
  color?: string;
  offsetX?: number;
  offsetY?: number;
  alignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  rotation?: number;
  mirrorX?: boolean;
  mirrorY?: boolean;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
```

### KeycapConfig
```typescript
interface KeycapConfig {
  id: string;
  row: number;
  col: number;
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
  textColor: string;
  group?: string;
  layers: KeycapLayer[]; // Multi-layer support
}
```

### KeyboardLayout
```typescript
interface KeyboardLayout {
  id: string;
  name: string;
  keys: KeycapConfig[];
  totalKeys: number;
  width: number;
  height: number;
}
```

### KeyboardConfig
```typescript
interface KeyboardConfig {
  layout: KeyboardLayout;
  globalSettings: {
    theme: string;
    font: string;
  };
  selectedKeys: string[];
  groups: Record<string, string[]>;
  allLayouts: Record<LayoutType, KeyboardLayout>;
  currentLayoutType: LayoutType;
}
```

## Main Hook: useKeyboardConfig

### State
- `config`: Complete keyboard configuration
- `editingKeyId`: Currently editing key ID (null if none)

### Functions
- `changeLayout(layoutType: LayoutType)`: Switch keyboard layout
- `selectKey(keyId: string, multiSelect?: boolean)`: Select single/multiple keys
- `selectKeys(keyIds: string[])`: Select multiple keys at once
- `clearSelection()`: Clear all selected keys
- `updateKeycapColor(keyIds: string[], color: string)`: Update keycap colors
- `updateKeycapTextColor(keyIds: string[], textColor: string)`: Update legend colors
- `startEditingKey(keyId: string)`: Start editing a key's legend
- `stopEditingKey()`: Stop editing current key
- `getSelectedKey()`: Get currently editing key
- `getSelectedKeys()`: Get all selected keys
- `saveGroup(groupName: string, keyIds: string[])`: Save key selection as group
- `loadGroup(groupName: string)`: Load saved key group
- `deleteGroup(groupName: string)`: Delete saved group
- `addLayer(keyId: string, type: 'text' | 'image')`: Add new layer to keycap
- `deleteLayer(keyId: string, layerId: string)`: Delete layer from keycap
- `reorderLayer(keyId: string, layerId: string, direction: 'up' | 'down')`: Reorder layers
- `updateLayer(keyId: string, layerId: string, updates: Partial<KeycapLayer>)`: Update layer properties
- `getKeyLayers(keyId: string)`: Get all layers for a key
- `selectLayer(layerId: string | null)`: Select specific layer for editing

## Available Layouts

### Layout Types
- **60%**: 61 keys - Compact layout
- **TKL**: 87 keys - Tenkeyless (function row + nav cluster)
- **Full**: 104 keys - Complete layout with numpad

### Layout Generation
- `generate60Layout()`: Creates 60% layout with standard QWERTY
- `generateTKLLayout()`: Extends 60% with function row and navigation cluster
- `generateFullLayout()`: Extends TKL with numpad section

## Key Components

### KeyboardPreview
- **Purpose**: 2D keyboard visualization with thockfactory-style case and proper centering
- **Props**: layout, selectedKeys, onKeySelect, onKeyDoubleClick, editingKeyId, currentKeyLayers, selectedLayerId, onLayerSelect, previewKeys, keyRefs, useSVGKeycaps
- **Features**: Click selection, double-click editing, visual feedback, realistic keyboard case, center-based scaling
- **Layout**: Flexbox-based centering with thockfactory-style case design and proper padding
- **Case Design**: Dark gradient background with realistic shadows and borders
- **Scaling System**: Center-based scaling with CASE_PADDING for authentic mechanical keyboard appearance
- **Layer Preview**: Shows compact layer buttons above selected key with theme-consistent styling
- **SVG Support**: Toggle between CSS-based KeycapPreview and SVG-based SVGKeycapPreview
- **Positioning**: Absolute positioning for SVG keycaps with proper x/y coordinate mapping

### Keyboard3D
- **Purpose**: 3D keyboard visualization using Three.js
- **Props**: layout, selectedKeys, onKeySelect, onKeyDoubleClick
- **Features**: Orbit controls, lighting, shadows, animations

### KeycapPreview
- **Purpose**: Individual keycap rendering with multi-layer support and enhanced visual effects
- **Props**: keycap, selected, previewSelected, onClick, onDoubleClick, scale
- **Features**: Multi-layer rendering, legend positioning, font customization, image support, enhanced hover effects
- **Visual Effects**: Strong hover states, multiselect visibility, ring effects, background highlights
- **Universal Visibility**: Effects visible on both light and dark keycaps with proper contrast

### SVGKeycap
- **Purpose**: SVG-based keycap rendering with support for complex shapes like ISO Enter L-shape
- **Props**: keycap, scale, showBorder, borderColor, className, shape, selected, hovered
- **Features**: 
  - **Shape Support**: 'rect' (standard) and 'l-shape' (ISO Enter) rendering modes
  - **L-Shape Rendering**: Two-rectangle approach for ISO Enter key reverse L-shape
  - **Text Positioning**: Inner square-based alignment with proper offset handling
  - **Mirror Support**: Proper transform-origin handling for mirrorX/mirrorY operations
  - **Hover/Selection Effects**: Color brightness adjustments and border highlighting
- **Alignment Logic**: Text positioning relative to inner square with padding considerations
- **Transform Handling**: Center-based transforms for proper mirroring and rotation

### Icon System
- **Overview**: FontAwesome SVG icons rendered inside keycaps and UI previews. Users pick an icon from a searchable grid and we store it on the icon layer as `"<style>:<name>"` (e.g., `"solid:shield"`, `"regular:star"`, `"brand:github"`). Renderers parse this and map `<name>` to an FA icon.
- **Picker**: `src/components/IconPicker.tsx`
  - Single searchable grid (tabs removed). Optional style filter (All/Solid/Regular/Brand).
  - Emits `(iconName, iconType)`; callers persist as `${iconType}:${iconName}`.
- **Library Initialization**: `src/lib/fontawesome.ts`
  - Import used FA icons and call `library.add(...)` once on app start (via `src/main.tsx`).
  - Keep imports minimal and avoid duplicate imports (runtime "already been declared" errors can occur).
- **Icon Mapping (render-time)**
  - Files: `src/components/SVGKeycap.tsx`, `src/components/LayerManager.tsx`, `src/components/KeyLayerPreview.tsx`.
  - Each has a local `iconMap: Record<string, any>` keyed by icon name only (no style), e.g., `'shield': faShield`.
  - Rendering flow: verify `layer.type==='icon'` and `typeof layer.content==='string' && layer.content.trim()!==''`; if content contains `":"`, split and use right side as `<name>`; look up `iconMap[<name>]`; render `<FontAwesomeIcon icon={...}/>` if found, otherwise fallback.
- **Creating/Updating Icon Layers**: `src/components/FloatingToolbar.tsx`
  - On icon pick: `type` becomes `'icon'`; `content` becomes `${iconType}:${iconName}`.
  - Example: Solid → Shield stores `"solid:shield"`.
- **Add a new icon (checklist)**
  1) `src/lib/fontawesome.ts`: import the icon from the correct package and add to `library.add(...)`.
     - Solid: `import { faShield } from '@fortawesome/free-solid-svg-icons'`
     - Regular: `import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons'`
     - Brand: `import { faGithub } from '@fortawesome/free-brands-svg-icons'`
  2) Add mapping in: `SVGKeycap.tsx`, `LayerManager.tsx`, `KeyLayerPreview.tsx`
     - Example: add `'shield': faShield,` into each file’s `iconMap`.
  3) (Optional) Add to `IconPicker.tsx` catalog for discoverability with correct `type`.
  4) Test: pick the icon; verify it renders in keycap, sidebar, and layer preview.
- **Troubleshooting**
  - Text like `"solid:shield"` shows instead of an icon:
    - Ensure the icon is imported and added in `fontawesome.ts` and exists in each `iconMap`.
    - Confirm `content` format is `${style}:${name}` and not `icon:${name}`.
  - Duplicate identifier error (e.g., `faDove`): remove duplicate imports/aliases in `fontawesome.ts`.
  - Crash on `.includes`: always guard with `typeof layer.content==='string' && layer.content.trim()!==''` before parsing.

### SVGKeycapPreview
- **Purpose**: Wrapper component for SVGKeycap with hover state management
- **Props**: keycap, selected, previewSelected, onClick, onDoubleClick, scale
- **Features**: 
  - **Auto Shape Detection**: Automatically detects ISO Enter keys for L-shape rendering
  - **Hover State Management**: Local hover state with mouse enter/leave handlers
  - **Event Handling**: Click and double-click event propagation
  - **Positioning**: Absolute positioning within keyboard layout container
- **Layer Rendering**: Renders all layers with proper positioning, alignment, and styling

### EnhancedColorPicker
- **Purpose**: Advanced color selection
- **Features**: 
  - Color input (hex)
  - Preset color palettes
  - Eyedropper tool (browser API + fallback)
  - Separate keycap and text color controls

### EnhancedLegendEditor
- **Purpose**: Advanced legend customization
- **Features**:
  - Text/Image mode toggle
  - Font selection and sizing
  - Position controls (X/Y offset)
  - Alignment options
  - Rotation control
  - Mirror effects
  - Real-time preview

### DragSelection
- **Purpose**: Multi-key selection via drag with static background
- **Features**: 
  - **DOM-Based Selection**: Uses actual DOM positions via `getBoundingClientRect()` for pixel-perfect selection
  - **Area-Based Selection**: Selects keys completely inside the selection rectangle (not directional)
  - **Real-time Visual Feedback**: Preview highlighting during drag with selection box overlay
  - **Multi-selection Support**: Ctrl/Cmd + click for individual key selection
  - **Layout Agnostic**: Works with any padding, scroll, zoom, or CSS transformations
  - **Key References**: Uses `keyRefs` to access actual DOM elements for precise positioning
  - **Static Background**: Gradient background with multiple layers for visual depth (animation disabled)
  - **Global Mouse Tracking**: Works across UI elements like FloatingToolbar using global event listeners
  - **Smart Element Detection**: Avoids interfering with interactive elements (buttons, inputs, etc.)
  - **Simplified Functionality**: Focused on keyboard selection with static background
  - **Z-Index Management**: Proper layering with background behind UI, above keycaps

### FloatingToolbar
- **Purpose**: Compact, centered toolbar for layer editing with multi-layer and multiselect support
- **Features**:
  - **Layer-Based Editing**: Works with selected layer instead of key properties
  - **Multiselect Support**: All features work with multiple selected keys simultaneously
  - **Smart Layer Management**: Multiselect operations apply to first layer of each key
  - **Always Visible**: Remains visible regardless of key selection state
  - **Content-Based Width**: Uses `w-fit` to size toolbar based on content, not full width
  - **Centered Layout**: Horizontally centered with `mx-auto` for optimal positioning
  - **Color Section**: Color picker with eyedropper, presets, separate keycap/text colors
  - **Aligning, Positioning & Sizing**: Alignment controls, transform tools, individual sliders
  - **Text Section**: Font selection, text styling (B/I/U), size control, text/image mode toggle
  - **Pop-up Panels**: Individual sliders for X/Y position, rotation, font size
  - **Click-Outside Functionality**: All dropdowns close when clicking outside toolbar
  - **Exclusive Dropdowns**: Only one dropdown open at a time for cleaner interface
  - **Compact Design**: Minimal spacing with `gap-1` between sections, `flex-shrink-0` to prevent stretching
  - **Responsive Sizing**: Smaller buttons and icons on mobile (`h-5 w-5`), larger on desktop (`sm:h-6 sm:w-6`)
  - **Minimal Separators**: Reduced height separators (`h-4`) for tighter layout
  - **Theme Integration**: Matches dark tech aesthetic with proper color tokens
  - **Layer Integration**: Updates layer properties instead of key properties
  - **Visual Indicators**: Shows "Multi-Select (X) - First Layer" for multiselect operations

### UnifiedSidebar
- **Purpose**: Merged sidebar containing layout selection, group management, and layer management
- **Features**:
  - **Single Container**: Combines CompactLayoutSelector, GroupManager, and LayerManager
  - **Section Organization**: Clear headings for Layout, Groups, and Components & Layers sections
  - **Visual Separators**: Consistent dividers between sections
  - **Full-Height Design**: Sticks to header/footer with internal scroll
  - **No Gaps**: Seamlessly connected to page edges
  - **Theme Integration**: Matches dark tech aesthetic with proper color tokens
  - **Responsive Width**: Fixed width (320px/384px) with scroll overflow
  - **Layer Management**: Integrated layer management with add/delete/reorder functionality

### CompactLayoutSelector
- **Purpose**: Compact layout selection dropdown (now integrated in UnifiedSidebar)
- **Features**:
  - **Section Title**: "Layout" header matching FloatingToolbar style
  - **Dropdown Interface**: Select component with layout options
  - **Layout Information**: Shows layout name, description, and key count
  - **Theme Integration**: Matches dark tech aesthetic with proper color tokens
  - **Space Efficient**: Replaces large button-based layout selector

### GroupManager
- **Purpose**: Save/load key groups
- **Features**: Create groups, load selections, delete groups

### KeyLayerPreview
- **Purpose**: Compact layer preview above selected key with layer creation functionality
- **Props**: layers, selectedLayerId, onLayerSelect, onClose, onAddTextLayer, onAddImageLayer, keyPosition, unit, padding
- **Features**: 
  - **Compact Design**: Only shows layer content without descriptive text
  - **Theme Integration**: Matches dark tech aesthetic with card/primary colors
  - **Interactive Selection**: Click to select different layers
  - **Closer Positioning**: Appears 35px above selected key for better visual connection
  - **Opacity & Blur**: Semi-transparent with backdrop blur for modern glass effect
  - **Circular Buttons**: Each layer as circular button with proper hover states
  - **Add Layer Button**: "+" button with theme-consistent design for layer creation
  - **Layer Creation Menu**: Dropdown with Text and Image layer creation options
  - **Click-Outside**: Closes when clicking outside preview or add menu
  - **Auto-Close**: Automatically closes when no keys are selected

### LayerManager
- **Purpose**: Multi-layer management interface
- **Features**:
  - **Layer List**: Shows all layers for selected key
  - **Add Layers**: Create new text or image layers
  - **Layer Operations**: Delete, reorder layers
  - **Layer Selection**: Click to select specific layer for editing
  - **Visual Indicators**: Shows layer type and content preview

### LayerEditor
- **Purpose**: Individual layer editing interface
- **Features**:
  - **Text/Image Mode**: Toggle between text and image content
  - **Font Controls**: Font selection and size adjustment
  - **Positioning**: X/Y offset controls with sliders
  - **Alignment**: Horizontal and vertical alignment options
  - **Transform**: Rotation and mirror effects
  - **Real-time Preview**: Live updates during editing

### ExportPanel
- **Purpose**: Export configurations (now in header dropdown)
- **Features**: JSON export, summary export, download functionality
- **Location**: Moved from sidebar to header popover for better accessibility

## Routing

### Routes
- `/` - Main application (Index.tsx)
- `/*` - 404 page (NotFound.tsx)

### Navigation
- Single page application
- No nested routes
- Browser history support

## Styling System

### Design Tokens (HSL)
- **Background**: Dark tech aesthetic (217 33% 6%)
- **Primary**: Cyan blue (199 89% 48%)
- **Accent**: Orange (37 92% 50%)
- **Keycap**: Dark gray (217 33% 16%)

### Custom CSS Classes
- `gradient-primary`: Primary gradient
- `gradient-keycap`: Keycap gradient
- `gradient-surface`: Surface gradient
- `shadow-keycap`: Keycap shadow
- `shadow-elevated`: Elevated shadow

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Full-width layout utilizing entire browser width
- Flexbox-based layout system for optimal space utilization

## Key Features

### 1. Layout Selection
- Three keyboard layouts (60%, TKL, Full)
- Visual layout preview
- Key count display

### 2. Key Selection
- **Single Click Selection**: Automatically opens editing mode
- **Multi-Selection**: Ctrl/Cmd + click for individual key selection
- **Drag Selection**: Click and drag across keyboard area for area-based multi-selection
- **DOM-Based Precision**: Uses actual DOM positions for pixel-perfect selection
- **Real-time Preview**: Visual feedback during drag selection
- **Layout Agnostic**: Works with any padding, scroll, zoom, or CSS transformations

### 3. Color Customization
- Individual keycap colors
- Legend text colors
- Preset color palettes
- Eyedropper tool
- Real-time preview

### 4. Multi-Layer System
- **Layer Management**: Add multiple text and image layers to each keycap
- **Layer Preview**: Compact visual preview above selected key
- **Layer Selection**: Click to select specific layer for editing
- **Layer Operations**: Add, delete, and reorder layers
- **Individual Layer Editing**: Each layer has its own properties and settings
- **Real-time Preview**: Live updates during layer editing
- **FloatingToolbar Integration**: All editing tools work with selected layer

### 5. Legend Editing
- Text and image legends per layer
- Font selection and sizing
- Position and alignment controls
- Rotation and mirror effects
- Text styling (bold, italic, underline)
- Real-time preview
- Compact floating toolbar interface

### 6. Group Management
- Save key selections as groups
- Load saved groups
- Delete groups
- Visual group indicators

### 7. Export Functionality
- JSON configuration export
- Summary text export
- Download with timestamps
- Header-based export dropdown

### 8. 3D Visualization
- Three.js powered 3D preview
- Orbit controls
- Lighting and shadows
- Animated keycaps

### 9. Interactive Background System (Disabled)
- **Static Background**: Gradient background with multiple layers for visual depth
- **Keyboard Selection**: Drag selection works seamlessly across all UI elements including FloatingToolbar
- **Global Mouse Tracking**: Works across all UI elements with proper event handling
- **Smart Element Detection**: Automatically detects interactive elements to avoid conflicts
- **Layered Visual Effects**: Multiple gradient orbs for visual depth (static)
- **Z-Index Management**: Proper layering with background behind UI elements, above keycaps
- **Centered Keyboard**: Keyboard remains centered with thockfactory-style case design

### 10. Keyboard Centering & Scaling System
- **Thockfactory-Style Design**: Realistic keyboard case with dark gradient background
- **Center-Based Scaling**: Keyboard scales from center instead of top-left corner
- **Case Padding System**: 26px padding around keycaps for authentic mechanical keyboard appearance
- **Flexbox Centering**: Reliable centering using `flex items-center justify-center`
- **Visual Improvements**: Realistic shadows, borders, and gradient effects
- **Scale Integration**: SCALE factor properly applied to both keycaps and case dimensions

## Development Scripts

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Build Configuration

### Vite Config
- React SWC plugin for fast compilation
- Path alias: `@` → `./src`
- Development server: `::` (all interfaces), port 8080
- Lovable tagger plugin (development only)

### TypeScript
- Strict mode enabled
- Path mapping configured
- React types included

## Dependencies

### Core
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19

### UI & Styling
- Tailwind CSS 3.4.17
- shadcn/ui components
- Lucide React icons
- Tailwind Merge & Class Variance Authority

### 3D Graphics
- Three.js 0.180.0
- @react-three/fiber 8.18.0
- @react-three/drei 9.122.0

### Forms & Validation
- React Hook Form 7.61.1
- Zod 3.25.76
- @hookform/resolvers 3.10.0

### Utilities
- React Router DOM 6.30.1
- TanStack React Query 5.83.0
- Sonner (toast notifications)
- Date-fns 3.6.0

## File Paths & Imports

### Component Imports
```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useKeyboardConfig } from '@/hooks/useKeyboardConfig'
import { KeyboardLayout } from '@/types/keyboard'
```

### Asset Imports
- Static assets: `public/` directory
- Icons: Lucide React components
- Images: Import as modules or data URLs

## State Management Pattern

### Centralized State
- Single `useKeyboardConfig` hook manages all state
- Immutable updates using spread operators
- Callback functions for performance optimization

### State Structure
```typescript
{
  layout: KeyboardLayout,
  globalSettings: { theme, font },
  selectedKeys: string[],
  groups: Record<string, string[]>,
  allLayouts: Record<LayoutType, KeyboardLayout>,
  currentLayoutType: LayoutType
}
```

## Performance Optimizations

### React Optimizations
- `useCallback` for event handlers
- Memoized component props
- Efficient re-render patterns

### 3D Performance
- Instanced rendering for keycaps
- Optimized geometry
- Efficient lighting setup

## Browser Compatibility

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features
- EyeDropper API (with fallback)
- Canvas API for image processing
- WebGL for 3D rendering
- CSS Grid and Flexbox

## Recent Updates & Changes

### FloatingToolbar Implementation
- **Replaced**: EnhancedColorPicker and EnhancedLegendEditor with unified FloatingToolbar
- **UI Design**: Canva-style compact floating toolbar with section-based organization
- **Layout**: Three main sections (Color | Aligning, Positioning & Sizing | Text)
- **Features Added**:
  - Text styling controls (bold, italic, underline)
  - Individual slider popups for precise control
  - Icon-only buttons for compact design
  - Theme-consistent color scheme
  - Real-time value display on control buttons
- **Compact Optimization (January 2025)**:
  - Content-based width (`w-fit`) instead of full width
  - Centered positioning with `mx-auto`
  - Minimal spacing (`gap-1`) between sections
  - Responsive sizing (smaller on mobile, larger on desktop)
  - Reduced separators (`h-4`) for tighter layout
  - `flex-shrink-0` to prevent section stretching

### DragSelection Improvements
- **Enhanced**: Real-time visual feedback during drag selection
- **Fixed**: Multi-selection conflicts with individual key clicks
- **Added**: Preview highlighting for keys under selection box
- **DOM-Based Selection**: Replaced grid-based calculations with actual DOM positions using `getBoundingClientRect()`
- **Area-Based Selection**: Changed from directional selection to geometric area containment
- **Layout Agnostic**: Now works with any padding, scroll, zoom, or CSS transformations
- **Key References**: Added `keyRefs` system for accessing actual DOM elements

### KeycapConfig Type Updates
- **Added**: `legendBold`, `legendItalic`, `legendUnderline` properties
- **Purpose**: Support for text styling in keycap legends

### UX Improvements
- **Single-click editing**: Keys open editing mode on single click
- **Continuous slider dragging**: Fixed slider UX for smooth dragging
- **Compact interface**: Reduced visual clutter with popup panels
- **Theme consistency**: All colors match dark tech aesthetic
- **Always-visible toolbar**: FloatingToolbar remains visible between view changes
- **Integrated positioning**: Toolbar positioned between view toggle and keyboard preview
- **Status feedback**: Clear indication when no key is selected for editing
- **Pixel-perfect selection**: DOM-based drag selection for precise multi-selection

### Full-Width Layout Implementation
- **Layout System**: Converted from CSS Grid to Flexbox for better width control
- **Container Constraints**: Removed max-width limitations to utilize full browser width
- **Fixed Left Panel**: Controls panel maintains consistent width (320px/384px) across screen sizes
- **Flexible Right Panel**: Keyboard preview expands to fill remaining horizontal space
- **Enhanced Scaling**: Keyboard preview centers and scales appropriately within expanded space
- **Responsive Behavior**: Maintained mobile-first approach with stacked layout on smaller screens
- **Space Utilization**: Optimized for larger screens while preserving mobile experience

### UnifiedSidebar Implementation
- **Layout Consolidation**: Merged three separate left panel containers into single UnifiedSidebar
- **Full-Edge Connection**: Sidebar sticks to header, footer, and left edge with no gaps
- **Internal Scrolling**: Full-height sidebar with overflow scroll instead of page widening
- **Section Organization**: Clear visual hierarchy with Layout, Groups, and Export sections
- **Seamless Integration**: No visual gaps or padding around sidebar container
- **Responsive Design**: Fixed width with internal scroll for content overflow

## Development Notes

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Consistent naming conventions

### Component Patterns
- Functional components with hooks
- Props interfaces for type safety
- Consistent prop naming
- Error boundaries (implicit)
- Local state management for slider controls
- DOM-based selection using `getBoundingClientRect()`
- `forwardRef` pattern for DOM element access
- Key reference management for precise positioning
- Flexbox-based layout system for responsive design
- Full-width container utilization with fixed/flexible panel distribution

### File Organization
- Feature-based component grouping
- Shared utilities in `/lib`
- Type definitions in `/types`
- Hooks in `/hooks`

## Future Enhancement Areas

### Potential Features
- More keyboard layouts (65%, 75%, etc.)
- Custom layout creation
- Import/export of configurations
- Cloud storage integration
- Collaborative editing
- Advanced 3D materials
- Animation presets
- Keyboard sound simulation

### Technical Improvements
- State persistence (localStorage)
- Undo/redo functionality
- Performance monitoring
- Accessibility improvements
- Mobile optimization
- PWA capabilities

---

*This reference document should be updated as the project evolves. Last updated: January 2025 - Multiselect FloatingToolbar & UX Enhancements*

## Recent Updates - Multi-Layer System & UI Improvements (January 2025)

### Multi-Layer Keycap System
- **Layer Architecture**: Implemented KeycapLayer interface for individual layer management
- **Layer Management**: Added useLayerManagement hook for layer operations (add, delete, reorder, update)
- **Layer Preview**: Created KeyLayerPreview component with compact design above selected key
- **Layer Integration**: Updated FloatingToolbar to work with selected layers instead of key properties
- **Visual Design**: Theme-consistent layer preview with opacity, backdrop blur, and circular buttons

### FloatingToolbar Enhancement
- **Layer-Based Editing**: Modified to work with selected layer properties instead of key properties
- **Multi-Layer Support**: All editing functions now operate on the currently selected layer
- **Improved Integration**: Seamless integration with layer selection and management
- **Consistent Styling**: Maintains theme consistency while supporting layer-specific editing

### UI/UX Improvements
- **Export Relocation**: Moved ExportPanel from sidebar to header dropdown for better accessibility
- **Sidebar Consolidation**: Integrated LayerManager into UnifiedSidebar below GroupManager
- **Compact Layer Preview**: Removed verbose text labels, showing only layer content
- **Positioning Fix**: Layer preview positioned above keycap to avoid blocking
- **Theme Integration**: All new components match dark tech aesthetic with proper color tokens

### Component Updates
- **KeyboardPreview**: Added layer preview functionality with proper positioning
- **UnifiedSidebar**: Now includes layer management section with full functionality
- **KeycapPreview**: Updated to render multiple layers with proper positioning and styling
- **Index.tsx**: Updated to pass layer management props and handle layer operations

### Layout Consolidation
- **Merged Components**: Combined CompactLayoutSelector, GroupManager, and LayerManager into single UnifiedSidebar
- **Eliminated Gaps**: Removed all padding and gaps around sidebar for seamless edge connection
- **Full-Height Design**: Sidebar now extends from header to footer with internal scrolling
- **Improved Organization**: Clear section divisions with consistent typography and separators
- **Enhanced UX**: Single cohesive container instead of multiple separate components

## Latest Updates - Image Upload & Layer Preview Fixes (January 2025)

### Image Upload System Improvements
- **Fixed Layer Type Change**: Image button no longer immediately changes layer type to 'image' when clicked
- **Preserved Layer Content**: Layer content and display remain unchanged until actual image is uploaded
- **Improved Button State**: Image button shows active state based on upload panel visibility, not layer type
- **Eliminated Broken Previews**: No more broken image placeholders when clicking image icon
- **Better UX Flow**: Users can click image icon to open upload panel without affecting current layer content

### Layer Preview Enhancements
- **Auto-Layer Selection**: Layer preview now appears immediately when clicking on a keycap
- **First Layer Auto-Select**: Automatically selects the first layer when a key with layers is clicked
- **Improved Visibility**: Layer preview appears above selected keycap without blocking the key
- **Click-Outside Functionality**: Layer preview closes when clicking outside of it
- **Compact Design**: Clean, minimal design showing only layer content without verbose labels

### Content Management Fixes
- **Empty Content Handling**: Fixed layer creation to use `undefined` instead of empty string for image layers
- **Proper Image Rendering**: Images only render when actual content exists and is not empty
- **Consistent State Management**: All components now properly handle empty/undefined content states
- **No Placeholder Artifacts**: Eliminated unwanted placeholder images on keycaps

### Component Architecture Updates
- **useLayerManagement**: Updated to create image layers with `undefined` content instead of empty string
- **KeycapPreview**: Enhanced image rendering conditions to check for valid, non-empty content
- **FloatingToolbar**: Improved image upload flow and button state management
- **KeyLayerPreview**: Updated to handle empty image content properly
- **Index.tsx**: Added auto-layer selection logic for better user experience

### User Experience Improvements
- **Intuitive Layer Selection**: Clicking a keycap immediately shows layer preview and selects first layer
- **Clean Image Upload**: Image upload panel opens without affecting current layer state
- **Visual Consistency**: All image-related UI elements work harmoniously together
- **Reduced Confusion**: No more unexpected layer type changes or broken displays
- **Smooth Workflow**: Seamless transition from text to image layers when needed

## Latest Updates - Interactive Background System & Keyboard Centering (January 2025)

### Interactive Background Implementation
- **Background Animation**: Added smooth draggable background with CSS transforms (later disabled per user request)
- **Dual Functionality**: Keyboard selection when dragging over keys, background movement when dragging on empty space
- **Global Mouse Events**: Implemented global mouse event listeners to work across all UI elements
- **Smart Element Detection**: Added logic to detect interactive elements and avoid conflicts
- **Smooth Animations**: Hardware-accelerated CSS transforms with `requestAnimationFrame` for 60fps performance
- **Layered Visual Effects**: Multiple gradient orbs with different movement speeds for visual depth
- **Z-Index Management**: Proper layering system with background behind UI, above keycaps
- **Centered Keyboard**: Keyboard remains centered while background moves around it

### DragSelection Enhancements
- **Extended Functionality**: Enhanced existing DragSelection component instead of creating duplicate
- **Background Integration**: Added background animation logic to existing drag selection system (later removed)
- **Global Event Handling**: Replaced local mouse events with global listeners for seamless interaction
- **Performance Optimization**: Used `will-change` CSS property and efficient animation loops
- **Visual Feedback**: Selection box appears above keyboard with proper z-index layering
- **FloatingToolbar Compatibility**: Drag selection works behind FloatingToolbar without interference
- **Static Background**: Background animation disabled, maintaining static gradient background

### Keyboard Centering & Scaling System
- **Thockfactory-Style Design**: Implemented realistic keyboard case with dark gradient background
- **Case Padding System**: Added 26px padding around keycaps for authentic mechanical keyboard appearance
- **Center-Based Scaling**: Keyboard now scales from center instead of top-left corner
- **Flexbox Centering**: Used `flex items-center justify-center` for reliable centering
- **Proper Dimensions**: Case width/height calculated as `keycapsWidth + (CASE_PADDING * 2)`
- **Visual Improvements**: Added realistic shadows, borders, and gradient effects
- **Scale Integration**: SCALE factor properly applied to both keycaps and case dimensions

### KeycapPreview Visual Enhancements
- **Enhanced Hover Effects**: Improved hover states with stronger visual feedback
- **Multiselect Visibility**: Enhanced preview selection effects for better visibility on all keycap colors
- **Ring Effects**: Added stronger ring effects with higher opacity for better contrast
- **Background Highlights**: Added subtle background color changes for selected states
- **Universal Visibility**: Effects now visible on both light and dark keycaps

### Technical Implementation
- **CSS Transforms**: Used `translate3d()` for hardware-accelerated animations (removed)
- **Animation Loop**: Implemented smooth animation with `requestAnimationFrame` (removed)
- **Event Management**: Global mouse event listeners with proper cleanup
- **State Management**: Simplified state management after removing background animation
- **Z-Index System**: Background (z-1), Keyboard (z-10), UI Elements (z-20), FloatingToolbar (z-50)
- **Responsive Design**: Keyboard centering and scaling works across all screen sizes
- **Performance**: Removed animation overhead for better performance

### Component Architecture Updates
- **KeyboardPreview**: Complete redesign with thockfactory-style case and proper centering
- **KeycapPreview**: Enhanced visual effects and improved scale integration
- **DragSelection**: Simplified after removing background animation functionality
- **Index.tsx**: Updated to work with new keyboard centering system
- **Layout System**: Improved flexbox-based centering for consistent positioning

## Latest Updates - Zoom & Pan System Implementation (January 2025)

### Zoom & Pan System Features
- **Mouse Wheel Zoom**: Smooth zoom in/out with mouse wheel (30% - 300% range)
- **Right-Click Pan**: Drag keyboard around with right-click and drag
- **Smart Zoom Point**: Zoom towards mouse cursor position for intuitive control
- **Keyboard Shortcuts**: Ctrl+0 (reset), Ctrl+Plus (zoom in), Ctrl+Minus (zoom out)
- **Control Panel**: Reset button and zoom percentage display in top-right corner
- **Hardware Acceleration**: CSS transforms for smooth 60fps performance

### DragSelection & Pan Coordination
- **Right-Click Detection**: DragSelection now ignores right-click events to prevent conflicts
- **Button State Checking**: Global mouse events check for right button state (buttons === 2)
- **Clean Separation**: Left-click for drag selection, right-click for panning
- **Event Coordination**: Proper event handling prevents drag selection during panning

### KeyboardPreview Enhancements
- **Transform System**: CSS transform-based zoom and pan with proper origin centering
- **State Management**: Zoom and pan state with proper limits and bounds
- **Event Listeners**: Global mouse and keyboard event handling with cleanup
- **Visual Feedback**: Smooth transitions and real-time zoom percentage display
- **Overflow Handling**: Proper container overflow management for pan boundaries

### Technical Implementation Details
- **Zoom Limits**: MIN_ZOOM (0.3) to MAX_ZOOM (3.0) with smooth scaling
- **Pan Coordinates**: X/Y translation with proper mouse delta calculations
- **Transform Origin**: Center-based scaling for natural zoom behavior
- **Event Prevention**: Proper preventDefault() for wheel and context menu events
- **Performance**: Hardware-accelerated CSS transforms with transition controls
- **Responsive Design**: Works across all screen sizes and device types

### User Experience Improvements
- **Intuitive Controls**: Natural mouse interactions matching standard design tools
- **Visual Feedback**: Clear zoom percentage and reset functionality
- **Conflict Resolution**: No interference between drag selection and panning
- **Smooth Animations**: 0.1s ease-out transitions for professional feel
- **Accessibility**: Keyboard shortcuts for users who prefer keyboard navigation

## Latest Updates - SVG Keycap System & ISO Layout Implementation (January 2025)

### SVG Keycap System Implementation
- **Dual Rendering Support**: Toggle between CSS-based KeycapPreview and SVG-based SVGKeycapPreview
- **L-Shape Support**: Special rendering for ISO Enter key with reverse L-shape using two rectangles
- **Proper Positioning**: Absolute positioning system for SVG keycaps with accurate x/y coordinate mapping
- **Hover & Selection Effects**: Color brightness adjustments and border highlighting for SVG keycaps
- **Mirror Transform Fix**: Center-based transforms for proper mirrorX/mirrorY operations
- **Text Alignment**: Inner square-based alignment system matching CSS behavior

### ISO 60% Layout Implementation
- **Pixel-Perfect Matching**: Layout based on exact analysis of 60-iso.svg reference file
- **ISO Enter Key**: Proper L-shape implementation with 1.46u top width and 1.21u bottom width
- **Accurate Dimensions**: All keycap sizes and positions calculated from SVG pixel measurements
- **Right-Edge Alignment**: Consistent alignment across all rows for professional appearance
- **Space Key**: Corrected to 6.21u width for proper bottom row spacing

### Text Positioning & Alignment Fixes
- **Vertical Alignment**: Fixed bottom alignment to properly position text at inner square bottom edge
- **Center Positioning**: Adjusted center alignment with font-size aware offset for better visual balance
- **Transform Handling**: Proper transform-origin for mirror operations preventing text disappearance
- **Offset Support**: Position sliders (offsetX/offsetY) now work correctly with SVG rendering

### Component Architecture Updates
- **SVGKeycap**: New core SVG rendering component with shape support and proper text positioning
- **SVGKeycapPreview**: Wrapper component with hover state management and auto shape detection
- **KeyboardPreview**: Updated to support SVG keycap rendering with proper positioning
- **Layout System**: Enhanced generateISO60Layout with pixel-perfect measurements

## Previous Updates - Multiselect FloatingToolbar & UX Enhancements (January 2025)

### Multiselect FloatingToolbar Integration
- **Full Multiselect Support**: All FloatingToolbar features now work with multiple selected keys
- **Smart Layer Management**: Multiselect operations apply to the first layer of each selected key
- **Visual Indicators**: "Multi-Select (X) - First Layer" label shows multiselect status
- **Consistent Interface**: Toolbar remains visible and functional regardless of selection state
- **Layer Operations**: Alignment, positioning, rotation, mirror effects work on multiple keys
- **Content Management**: Text input and image upload apply to all selected keys simultaneously

### FloatingToolbar Dropdown Improvements
- **Click-Outside Functionality**: All dropdowns close when clicking outside the toolbar
- **Exclusive Opening**: Only one dropdown can be open at a time for cleaner interface
- **Smart Toggle**: Clicking the same button toggles the dropdown, clicking others switches focus
- **Comprehensive State Management**: All dropdown states properly synchronized
- **Performance Optimized**: Efficient event listeners with proper cleanup

### KeyLayerPreview Enhancements
- **Closer Positioning**: Moved from 60px to 35px above selected keycap for better visual connection
- **Add Layer Button**: New "+" button with theme-consistent design
- **Layer Creation Menu**: Dropdown with Text and Image layer creation options
- **Auto-Close Behavior**: Preview closes when no keys are selected for cleaner state management
- **Enhanced UX**: Click-outside functionality for both preview and add menu
- **Integrated Workflow**: Direct layer creation from keycap preview

### Component Architecture Updates
- **FloatingToolbar**: Enhanced with multiselect support and improved dropdown management
- **KeyLayerPreview**: Added layer creation functionality with theme-consistent design
- **KeyboardPreview**: Updated to pass layer creation callbacks
- **Index.tsx**: Integrated multiselect layer operations and auto-layer cleanup
- **Props Flow**: Comprehensive prop passing for layer management across components

### User Experience Improvements
- **Seamless Multiselect**: All toolbar features work consistently across single and multiple selections
- **Intuitive Layer Creation**: Direct layer creation from keycap preview without sidebar navigation
- **Clean Interface**: Dropdowns close appropriately, no UI clutter
- **Consistent Behavior**: Same interaction patterns across all components
- **Performance**: Optimized event handling and state management
