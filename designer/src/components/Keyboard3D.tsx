import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, useMask } from '@react-three/drei';
import { KeycapConfig } from '@/types/keyboard';
import * as THREE from 'three';

interface Keycap3DProps {
  keycap: KeycapConfig;
  selected: boolean;
  onClick: (e: any) => void;
  onDoubleClick: () => void;
}

// Simple audio pool so multiple clicks can overlap
const MAX_AUDIO_INSTANCES = 6;
const audioPool: HTMLAudioElement[] = Array.from({ length: MAX_AUDIO_INSTANCES }, () => new Audio('/blue.mp3'));
let audioPoolIndex = 0;
function playKeySound(): void {
  const audio = audioPool[audioPoolIndex];
  audioPoolIndex = (audioPoolIndex + 1) % MAX_AUDIO_INSTANCES;
  try {
    audio.currentTime = 0;
    // Some browsers require a user gesture before play() resolves; ignore errors silently
    void audio.play().catch(() => {});
  } catch (_) {
    // no-op
  }
}

// Switch base (static, inside the case)
const SwitchBase3D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const MM_TO_THREE_UNIT_SCALE = 1 / 36; // 1mm = 1/36 Three.js units
  
  // Standard MX switch dimensions (in mm)
  const SWITCH_BASE_SIZE_MM = 15.6; // Standard MX switch base size
  const SWITCH_BASE_HEIGHT_MM = 4.0; // Bottom housing height
  
  // Convert to 3D units
  const baseSize = SWITCH_BASE_SIZE_MM * MM_TO_THREE_UNIT_SCALE;
  const baseHeight = SWITCH_BASE_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  
  // Position: base center is at baseHeight/2 above group center (which is at case top level)
  const baseY = baseHeight / 2;
  
  return (
    <group position={position}>
      {/* Bottom housing (dark gray/black, matte) - inside the case */}
      <mesh position={[0, baseY, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseSize, baseHeight, baseSize]} />
        <meshPhysicalMaterial
          color="#2a2a2a"
          metalness={0}
          roughness={1}
          clearcoat={0}
        />
      </mesh>
    </group>
  );
};

// Switch top housing (static, on top of the case)
const SwitchTopHousing3D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const MM_TO_THREE_UNIT_SCALE = 1 / 36; // 1mm = 1/36 Three.js units
  
  // Standard MX switch dimensions (in mm)
  const SWITCH_BASE_SIZE_MM = 15.6; // Standard MX switch base size
  const SWITCH_TOP_HEIGHT_MM = 5.5; // Top housing height
  
  // Convert to 3D units
  const baseSize = SWITCH_BASE_SIZE_MM * MM_TO_THREE_UNIT_SCALE;
  const topHeight = SWITCH_TOP_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  
  // Position: top housing sits on case top, center is at topHeight/2 above group center
  const topY = topHeight / 2;
  
  return (
    <group position={position}>
      {/* Top housing (translucent, frosted glass-like) - on top of the case */}
      <mesh position={[0, topY, 0]} castShadow>
        <boxGeometry args={[baseSize * 0.95, topHeight, baseSize * 0.95]} />
        <meshPhysicalMaterial
          color="#f0f0f0"
          metalness={0}
          roughness={1}
          clearcoat={0}
        />
      </mesh>
    </group>
  );
};

// Switch stem (dynamic, moves with keycap)
const SwitchStem3D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const MM_TO_THREE_UNIT_SCALE = 1 / 36; // 1mm = 1/36 Three.js units
  
  // Standard MX switch dimensions (in mm)
  const SWITCH_BASE_SIZE_MM = 15.6; // Standard MX switch base size
  const SWITCH_STEM_HEIGHT_MM = 4.0; // Stem height
  const SWITCH_STEM_CROSS_SIZE_MM = 1.2; // Cross shape size on stem top
  
  // Convert to 3D units
  const baseSize = SWITCH_BASE_SIZE_MM * MM_TO_THREE_UNIT_SCALE;
  const stemHeight = SWITCH_STEM_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  const crossSize = SWITCH_STEM_CROSS_SIZE_MM * MM_TO_THREE_UNIT_SCALE;
  
  // Stem extends from top housing upward
  // Group position is at top housing's top surface, stem center is stemHeight/2 above that
  const stemY = stemHeight / 2;
  
  return (
    <group position={position}>
      {/* Stem (vibrant teal/cyan blue with cross shape on top) */}
      <group position={[0, stemY, 0]}>
        {/* Main stem body - rectangular shaft */}
        <mesh castShadow>
          <boxGeometry args={[baseSize * 0.2, stemHeight, baseSize * 0.2]} />
          <meshPhysicalMaterial
            color="#00b4d8"
            metalness={0}
            roughness={1}
            clearcoat={0}
          />
        </mesh>
        
        {/* Cross shape on top of stem (for keycap mounting) */}
        <group position={[0, stemHeight / 2 + 0.001, 0]}>
          {/* Horizontal bar */}
          <mesh>
            <boxGeometry args={[crossSize, 0.002, crossSize * 0.2]} />
            <meshPhysicalMaterial color="#00b4d8" metalness={0} roughness={1} clearcoat={0} />
          </mesh>
          {/* Vertical bar */}
          <mesh>
            <boxGeometry args={[crossSize * 0.2, 0.002, crossSize]} />
            <meshPhysicalMaterial color="#00b4d8" metalness={0} roughness={1} clearcoat={0} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

const Keycap3D: React.FC<Keycap3DProps> = ({ keycap, selected, onClick, onDoubleClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const animationStartTimeRef = useRef<number | null>(null);
  const clockRef = useRef<any>(null);
  
  // Reset animation when clicked (works even if already selected)
  const handleClick = (e: any) => {
    playKeySound();
    if (clockRef.current) {
      animationStartTimeRef.current = clockRef.current.elapsedTime;
    }
    onClick(e);
  };

  // NOTE: per-frame bounce is applied later after computing centerY, so we don't overwrite base lift

  const UNIT_SIZE = 0.5; // 1 layout unit = 0.5 3D units = 18mm in real world
  const MM_TO_THREE_UNIT_SCALE = 1 / 36; // 1mm = 1/36 Three.js units (since 18mm = 0.5 units)
  const KEYCAP_SIZE_SCALE = 1.4; // Scale factor to reduce gaps between keycaps (makes them slightly larger)
  const KEYCAP_HEIGHT_SCALE = 1; // Scale factor to increase keycap height for better visibilit
  
  // Real-world keycap heights from the technical diagram (in mm)
  // Row mapping: row 0 = R4, row 1 = R3, row 2 = R2, row 3 = R1, row 4 = R1 (spacebar row)
  const KEYCAP_ROW_HEIGHTS_MM: { [key: number]: number } = {
    0: 11.40, // R4 - Top row (numbers)
    1: 10.80, // R3 - QWERTY row
    2: 9.30,  // R2 - ASDF row
    3: 10.10, // R1 - ZXCV row
    4: 10.10, // R1 - Spacebar row (same as R1)
  };
  
  // Calculate dynamic KEYCAP_HEIGHT based on keycap's row
  const KEYCAP_HEIGHT_MM = KEYCAP_ROW_HEIGHTS_MM[keycap.row] || KEYCAP_ROW_HEIGHTS_MM[3]; // Default to R1
  const KEYCAP_HEIGHT = KEYCAP_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE * KEYCAP_HEIGHT_SCALE;
  
  // Inner square height - approximately 2-3mm in real world
  const INNER_SQUARE_HEIGHT_MM = 2.5;
  const INNER_SQUARE_HEIGHT = INNER_SQUARE_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  
  // 2D version offsets (in pixels): innerTop=2, innerLeft=6, innerRight=6, innerBottom=10
  // Convert to 3D units (UNIT_SIZE = 0.5, 2D UNIT = 48)
  // 1 pixel in 2D = (UNIT_SIZE / 48) Three.js units
  // Apply KEYCAP_SIZE_SCALE to maintain same proportions as 2D
  const PIXEL_TO_THREE_UNIT_SCALE = UNIT_SIZE / 48;
  const INNER_TOP_OFFSET = 2 * PIXEL_TO_THREE_UNIT_SCALE * KEYCAP_SIZE_SCALE; // ~0.029 (scaled)
  const INNER_LEFT_OFFSET = 6 * PIXEL_TO_THREE_UNIT_SCALE * KEYCAP_SIZE_SCALE; // ~0.088 (scaled)
  const INNER_RIGHT_OFFSET = 6 * PIXEL_TO_THREE_UNIT_SCALE * KEYCAP_SIZE_SCALE; // ~0.088 (scaled)
  const INNER_BOTTOM_OFFSET = 10 * PIXEL_TO_THREE_UNIT_SCALE * KEYCAP_SIZE_SCALE; // ~0.146 (scaled)

  // 0.5mm offset from keycap base (as requested by user)
  const INNER_SQUARE_BASE_OFFSET_MM = 0.5;
  const INNER_SQUARE_OFFSET = INNER_SQUARE_BASE_OFFSET_MM * MM_TO_THREE_UNIT_SCALE; // 0.5mm in 3D units

  // Calculate center position: keycap.x and keycap.y represent top-left corner
  // boxGeometry is centered, so we need to offset by half width/height
  const centerX = keycap.x * UNIT_SIZE + (keycap.width * UNIT_SIZE) / 2;
  const centerZ = keycap.y * UNIT_SIZE + (keycap.height * UNIT_SIZE) / 2;
  // Lift keycaps vertically (in mm) so they don't sink into the case
  const KEYCAP_LIFT_MM = 3; // raise by 3mm (visual tweak only)
  const KEYCAP_LIFT = KEYCAP_LIFT_MM * MM_TO_THREE_UNIT_SCALE;
  const centerY = KEYCAP_HEIGHT / 2 + KEYCAP_LIFT; // Center vertically with lift

  // Apply press animation when selected: keycap goes down (towards base) and back up (only once)
  useFrame((state) => {
    if (!groupRef.current) return;
    clockRef.current = state.clock;
    
    if (selected) {
      // Start animation when first selected or when clicked again
      if (animationStartTimeRef.current === null) {
        animationStartTimeRef.current = state.clock.elapsedTime;
      }
      
      const animationDuration = Math.PI / 12; // Half a sine cycle (press and release) - 4x overall speed from base
      const elapsed = state.clock.elapsedTime - animationStartTimeRef.current;
      
      if (elapsed < animationDuration) {
        // Play animation: keycap moves down and up (like being pressed)
        const progress = elapsed / animationDuration; // 0 to 1
        const pressDepth = Math.abs(Math.sin(progress * Math.PI)) * 0.1; // 0.1 units down
        groupRef.current.position.y = centerY - pressDepth;
      } else {
        // Animation complete, stay at centerY
        groupRef.current.position.y = centerY;
      }
    } else {
      // Reset animation when deselected
      animationStartTimeRef.current = null;
      groupRef.current.position.y = centerY;
    }
  });

  // Keycap top surface dimensions (full keycap size, not inner square)
  const topSurfaceWidth = keycap.width * UNIT_SIZE * KEYCAP_SIZE_SCALE;
  const topSurfaceDepth = keycap.height * UNIT_SIZE * KEYCAP_SIZE_SCALE;
  // Keycap top surface Y position (where layers are rendered)
  const topSurfaceY = KEYCAP_HEIGHT / 2 + INNER_SQUARE_OFFSET + 0.001;
  
  // Top surface boundaries (relative to keycap center at 0,0,0)
  const topSurfaceLeft = -topSurfaceWidth / 2;
  const topSurfaceRight = topSurfaceWidth / 2;
  const topSurfaceTop = -topSurfaceDepth / 2;
  const topSurfaceBottom = topSurfaceDepth / 2;

  // Switch position: directly below keycap, on the case
  // Case top is at y = -0.1 (case position -0.25 + height 0.3/2 = -0.1)
  const caseTopY = -0.1; // Case top surface Y position
  
  // Switch dimensions
  const SWITCH_BASE_HEIGHT_MM = 4.0;
  const SWITCH_TOP_HEIGHT_MM = 5.5;
  const baseHeight = SWITCH_BASE_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  const topHeight = SWITCH_TOP_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  
  // Base sits inside case (below case top)
  // Base center is at caseTopY - baseHeight/2 (so base bottom is at caseTopY - baseHeight)
  const baseCenterY = caseTopY - baseHeight / 2;
  
  // Top housing sits on case top (above case top)
  // Top housing center is at caseTopY + topHeight/2
  const topHousingCenterY = caseTopY + topHeight / 2;
  const topHousingTopY = caseTopY + topHeight; // Top housing's top surface
  
  // Stem starts from top housing's top surface and extends upward (moves with keycap)
  // Stem bottom is at topHousingTopY, stem center is at topHousingTopY + stemHeight/2
  const SWITCH_STEM_HEIGHT_MM = 4.0;
  const stemHeight = SWITCH_STEM_HEIGHT_MM * MM_TO_THREE_UNIT_SCALE;
  const stemCenterY = topHousingTopY + stemHeight / 2;
  
  // Stem position in keycap's local space
  const stemBaseY = stemCenterY - centerY;
  
  return (
    <>
      {/* Static switch base (inside case, does NOT move) */}
      <SwitchBase3D position={[centerX, baseCenterY, centerZ]} />
      
      {/* Static switch top housing (on case top, does NOT move) */}
      <SwitchTopHousing3D position={[centerX, topHousingCenterY, centerZ]} />
      
      {/* Moving keycap group (and switch stem) */}
      <group ref={groupRef} position={[centerX, centerY, centerZ]}>
        {/* Switch stem (moves with keycap) */}
        <SwitchStem3D position={[0, stemBaseY, 0]} />
      
      {/* Beveled keycap body (truncated pyramid) */}
      {(() => {
        const width = keycap.width * UNIT_SIZE * KEYCAP_SIZE_SCALE;
        const depth = keycap.height * UNIT_SIZE * KEYCAP_SIZE_SCALE;
        const bottomRadius = 0.5; // base unit radius before scaling
        // Keycap width-based taper: smaller keys need more visible taper, larger keys less
        let targetRatio: number;
        if (keycap.width <= 1.5) {
          // Small keys (≤1.5u): use fixed strong taper for visibility
          targetRatio = 0.70;
        } else if (keycap.width <= 2.0) {
          // Medium keys (1.5u-2u): interpolate between small and large
          const t = (keycap.width - 1.5) / 0.5; // 0 to 1
          targetRatio = 0.70 + t * (0.80 - 0.60); // 0.60 to 0.80
        } else {
          // Large keys (>2u like spacebar): use gentler taper
          targetRatio = 0.90;
        }
        const topRadius = Math.max(0.05, bottomRadius * targetRatio);
        const scaleX = (width / 2) / bottomRadius;
        const scaleZ = (depth / 2) / bottomRadius;
        return (
          <mesh
            onClick={handleClick}
            onDoubleClick={onDoubleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            castShadow
            receiveShadow
            scale={[scaleX, 1, scaleZ]}
          >
            {/* Rotate 45° so edges (not corners) face downwards */}
            <cylinderGeometry args={[topRadius, bottomRadius, KEYCAP_HEIGHT, 4, 1, false, Math.PI / 4]} />
            <meshPhysicalMaterial
              color={keycap.color}
              metalness={0}
              roughness={0.9}
              clearcoat={0.1}
              clearcoatRoughness={0.6}
              emissive={selected ? '#4f46e5' : hovered ? '#6366f1' : '#000000'}
              emissiveIntensity={selected ? 0.1 : hovered ? 0.05 : 0}
            />
          </mesh>
        );
      })()}
      
      {/* Clipping mask for keycap top surface - clips anything outside keycap boundaries */}
      {(() => {
        // Create a stencil mask for clipping layers to keycap top surface
        const stencil = useMask(1, true);
        
        return (
          <group>
            {/* Clipping plane - writes to stencil buffer */}
            <mesh
              position={[0, topSurfaceY - 0.0001, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              visible={false}
            >
              <planeGeometry args={[topSurfaceWidth, topSurfaceDepth]} />
              <meshBasicMaterial stencilWrite={true} stencilRef={1} />
            </mesh>
            
            {/* Render all layers with proper positioning and alignment relative to keycap top surface */}
            {(keycap.layers || []).map((layer, index) => {
          // Calculate base position on keycap top surface (full surface, not inner square)
          let baseX = 0; // center by default
          let baseZ = 0; // center by default
          
          // Apply horizontal alignment relative to top surface edges
          if (layer.alignment === 'left') {
            baseX = topSurfaceLeft;
          } else if (layer.alignment === 'right') {
            baseX = topSurfaceRight;
          }
          // else 'center' - already 0
          
          // Apply vertical alignment relative to top surface edges
          if (layer.verticalAlignment === 'top') {
            baseZ = topSurfaceTop;
          } else if (layer.verticalAlignment === 'bottom') {
            baseZ = topSurfaceBottom;
          }
          // else 'center' - already 0
          
          // Apply offsets (convert from 2D pixels to 3D units)
          // 2D uses pixels (48px = 1 unit), 3D uses UNIT_SIZE scale
          const offsetX3D = (layer.offsetX || 0) * PIXEL_TO_THREE_UNIT_SCALE;
          const offsetZ3D = (layer.offsetY || 0) * PIXEL_TO_THREE_UNIT_SCALE; // offsetY becomes Z in 3D
          
          // Final position: base position + manual offset
          const finalX = baseX + offsetX3D;
          const finalZ = baseZ + offsetZ3D;
          
          // Font size conversion (2D pixels to 3D units)
          const fontSize3D = ((layer.fontSize || 14) / 92) * UNIT_SIZE * KEYCAP_SIZE_SCALE;
          
          if (layer.type === 'text' && layer.content) {
            // Calculate text bounds based on anchor point to ensure it stays within keycap
            // For left anchor: text starts at finalX, can extend to topSurfaceRight
            // For right anchor: text ends at finalX, can extend to topSurfaceLeft
            // For center anchor: text centered at finalX, extends half width each side
            let maxTextWidth = topSurfaceWidth;
            if (layer.alignment === 'left') {
              maxTextWidth = topSurfaceRight - finalX;
            } else if (layer.alignment === 'right') {
              maxTextWidth = finalX - topSurfaceLeft;
            } else {
              // center - text can extend equally on both sides
              maxTextWidth = Math.min(
                (topSurfaceRight - finalX) * 2,
                (finalX - topSurfaceLeft) * 2
              );
            }
            
            return (
              <group key={layer.id} {...stencil}>
                <Text
                  position={[finalX, topSurfaceY, finalZ]}
                  rotation={[-Math.PI / 2, (layer.rotation || 0) * (Math.PI / 180), 0]}
                  fontSize={fontSize3D}
                  color={layer.color || keycap.textColor}
                  anchorX={layer.alignment === 'left' ? 'left' : layer.alignment === 'right' ? 'right' : 'center'}
                  anchorY={layer.verticalAlignment === 'top' ? 'top' : layer.verticalAlignment === 'bottom' ? 'bottom' : 'middle'}
                  maxWidth={Math.max(0.01, maxTextWidth * 0.95)}
                  overflowWrap="break-word"
                  renderOrder={10 + index}
                >
                  {layer.content}
                </Text>
              </group>
            );
          }
          
          // TODO: Add image and icon layer rendering
          return null;
        })}
          </group>
        );
      })()}
      </group>
    </>
  );
};

interface Keyboard3DProps {
  layout: any;
  selectedKeys: string[];
  onKeySelect: (keyId: string, event?: any) => void;
  onKeyDoubleClick: (keyId: string) => void;
  view3D?: boolean;
  onView3DToggle?: () => void;
}

const Keyboard3D: React.FC<Keyboard3DProps> = ({
  layout,
  selectedKeys,
  onKeySelect,
  onKeyDoubleClick,
  view3D,
  onView3DToggle,
}) => {
  const UNIT_SIZE = 0.5;
  
  // Calculate keyboard bounds from keycaps
  const maxWidthUnits = Math.max(0, ...layout.keys.map((k: KeycapConfig) => k.x + k.width));
  const maxHeightUnits = Math.max(0, ...layout.keys.map((k: KeycapConfig) => k.y + k.height));
  
  // Calculate center of keyboard for base positioning
  const baseCenterX = (maxWidthUnits * UNIT_SIZE) / 2;
  const baseCenterZ = (maxHeightUnits * UNIT_SIZE) / 2;
  const baseWidth = maxWidthUnits * UNIT_SIZE + 1; // Add padding
  const baseDepth = maxHeightUnits * UNIT_SIZE + 1; // Add padding
  
  // Disable orbit controls when modifier is held (Cmd/Ctrl) to avoid conflicts with multi-select
  const [modifierDown, setModifierDown] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setModifierDown(e.metaKey || e.ctrlKey);
    };
    const onUp = () => setModifierDown(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Refs for camera and controls to implement reset and zoom percentage
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const initialDistanceRef = useRef<number>(0);
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const lastPercentRef = useRef<number>(100);

  const Binder: React.FC = () => {
    const { camera } = useThree();
    useEffect(() => {
      cameraRef.current = camera as THREE.PerspectiveCamera;
      // Compute initial distance to target (0,0,0 by default until controls set)
      try {
        const target = controlsRef.current?.target || new THREE.Vector3(baseCenterX, 0, baseCenterZ);
        const dist = camera.position.distanceTo(target);
        initialDistanceRef.current = dist || 1;
        setZoomPercent(100);
      } catch {}
    }, [camera]);
    return null;
  };

  const resetView = () => {
    const cam = cameraRef.current;
    const ctl = controlsRef.current;
    if (!cam || !ctl) return;
    cam.position.set(5, 8, 5);
    ctl.target.set(baseCenterX, 0, baseCenterZ);
    ctl.update();
    const dist = cam.position.distanceTo(ctl.target);
    initialDistanceRef.current = dist || 1;
    setZoomPercent(100);
  };

  const handleControlsChange = () => {
    const cam = cameraRef.current;
    const ctl = controlsRef.current;
    if (!cam || !ctl) return;
    const dist = cam.position.distanceTo(ctl.target);
    const initial = initialDistanceRef.current || dist || 1;
    const pct = Math.max(1, Math.min(300, Math.round((initial / (dist || 1)) * 100)));
    if (pct !== lastPercentRef.current) {
      lastPercentRef.current = pct;
      setZoomPercent(pct);
    }
  };

  // Inside-Canvas tracker to update zoom percentage each frame
  const ZoomTracker: React.FC = () => {
    const { camera } = useThree();
    useFrame(() => {
      const ctl = controlsRef.current;
      const target = ctl?.target || new THREE.Vector3(baseCenterX, 0, baseCenterZ);
      const dist = camera.position.distanceTo(target);
      if (initialDistanceRef.current === 0 && dist > 0) {
        initialDistanceRef.current = dist;
      }
      const initial = initialDistanceRef.current || dist || 1;
      const pct = Math.max(1, Math.min(300, Math.round((initial / (dist || 1)) * 100)));
      if (pct !== lastPercentRef.current) {
        lastPercentRef.current = pct;
        setZoomPercent(pct);
      }
    });
    return null;
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-card to-background rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [5, 8, 5], fov: 45 }}
        shadows
      >
        <Binder />
        <ZoomTracker />
        <ambientLight intensity={0.12} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.55}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />
        
        <Environment preset="studio" environmentIntensity={0.5} />
        
        {/* Keyboard base (shifted down by 0.2) */}
        <mesh position={[baseCenterX, -0.25, baseCenterZ]} receiveShadow>
          <boxGeometry args={[baseWidth, 0.3, baseDepth]} />
          <meshPhysicalMaterial
            color="#000000"
            metalness={0.1}
            roughness={0.9}
            clearcoat={0.05}
          />
        </mesh>
        
        {/* Keycaps */}
        {layout.keys.map((keycap: KeycapConfig) => (
          <Keycap3D
            key={keycap.id}
            keycap={keycap}
            selected={selectedKeys.includes(keycap.id)}
            onClick={(e: any) => onKeySelect(keycap.id, e)}
            onDoubleClick={() => onKeyDoubleClick(keycap.id)}
          />
        ))}
        
        <ContactShadows
          opacity={0.4}
          scale={Math.max(baseWidth, baseDepth) + 2}
          blur={2.5}
          far={4.5}
          position={[baseCenterX, -0.1, baseCenterZ]}
        />
        
        <OrbitControls
          ref={controlsRef}
          enabled={!modifierDown}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          onChange={handleControlsChange}
        />
      </Canvas>
      {/* Overlay Controls (Reset, Zoom %, Toggle) */}
      <div className="absolute top-28 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={resetView}
          className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors"
          title="Reset View"
        >
          Reset
        </button>
        <div className="px-3 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-600">
          {zoomPercent}%
        </div>
        {onView3DToggle && (
          <button
            onClick={onView3DToggle}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg border border-gray-600 transition-colors"
            title="2D Görünüme Geç"
          >
            2D
          </button>
        )}
      </div>
    </div>
  );
};

export default Keyboard3D;