import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { icon } from '@fortawesome/fontawesome-svg-core'
import { 
  faHome, faUser, faCog, faHeart, faStar, faPlay, faPause, faStop,
  faEdit, faTrash, faSave, faDownload, faUpload, faCopy, faCut, faPaste,
  faBold, faItalic, faUnderline, faAlignLeft, faAlignCenter, faAlignRight,
  faPlus, faMinus, faTimes as faMultiply, faDivide, faEquals,
  faArrowUp, faArrowDown, faArrowLeft, faArrowRight,
  faChevronUp, faChevronDown, faChevronLeft, faChevronRight,
  faCheck, faTimes as faX, faQuestion, faExclamation,
  faLock, faUnlock, faEye, faEyeSlash, faKey,
  faPhone, faEnvelope, faCalendar, faClock, faMapMarker,
  faImage, faFile, faFolder, faLink, faExternalLinkAlt,
  faVolumeUp, faVolumeDown, faVolumeMute, faMicrophone, faMicrophoneSlash,
  faWifi, faBatteryFull, faBatteryHalf, faBatteryEmpty,
  faSun, faMoon, faCloud, faCloudRain, faSnowflake,
  faGamepad, faTrophy, faGift, faShoppingCart, faCreditCard,
  faShield
} from '@fortawesome/free-solid-svg-icons'
import { 
  faHeart as faHeartRegular, 
  faStar as faStarRegular,
  faBookmark as faBookmarkRegular,
  faUser as faUserRegular,
  faEnvelope as faEnvelopeRegular,
  faFile as faFileRegular,
  faFolder as faFolderRegular,
  faImage as faImageRegular
} from '@fortawesome/free-regular-svg-icons'
import { 
  faGithub, faTwitter, faFacebook, faInstagram, faLinkedin,
  faYoutube, faDiscord, faSteam, faSpotify, faApple,
  faGoogle, faMicrosoft, faAmazon, faPaypal
} from '@fortawesome/free-brands-svg-icons'

// Icon mapping matching frontend (using kebab-case format like LayerManager.tsx)
const iconMap: Record<string, any> = {
  'home': faHome, 'user': faUser, 'cog': faCog, 'heart': faHeart, 'star': faStar,
  'play': faPlay, 'pause': faPause, 'stop': faStop, 'edit': faEdit, 'trash': faTrash,
  'save': faSave, 'download': faDownload, 'upload': faUpload, 'copy': faCopy, 'cut': faCut, 'paste': faPaste,
  'bold': faBold, 'italic': faItalic, 'underline': faUnderline, 'align-left': faAlignLeft, 'align-center': faAlignCenter, 'align-right': faAlignRight,
  'plus': faPlus, 'minus': faMinus, 'times': faMultiply, 'multiply': faMultiply, 'divide': faDivide, 'equals': faEquals,
  'arrow-up': faArrowUp, 'arrow-down': faArrowDown, 'arrow-left': faArrowLeft, 'arrow-right': faArrowRight,
  'chevron-up': faChevronUp, 'chevron-down': faChevronDown, 'chevron-left': faChevronLeft, 'chevron-right': faChevronRight,
  'check': faCheck, 'x': faX, 'question': faQuestion, 'exclamation': faExclamation,
  'lock': faLock, 'unlock': faUnlock, 'eye': faEye, 'eye-slash': faEyeSlash, 'key': faKey,
  'phone': faPhone, 'envelope': faEnvelope, 'calendar': faCalendar, 'clock': faClock, 'map-marker': faMapMarker,
  'image': faImage, 'file': faFile, 'folder': faFolder, 'link': faLink, 'external-link-alt': faExternalLinkAlt,
  'volume-up': faVolumeUp, 'volume-down': faVolumeDown, 'volume-mute': faVolumeMute, 'microphone': faMicrophone, 'microphone-slash': faMicrophoneSlash,
  'wifi': faWifi, 'battery-full': faBatteryFull, 'battery-half': faBatteryHalf, 'battery-empty': faBatteryEmpty,
  'sun': faSun, 'moon': faMoon, 'cloud': faCloud, 'cloud-rain': faCloudRain, 'snowflake': faSnowflake,
  'gamepad': faGamepad, 'trophy': faTrophy, 'gift': faGift, 'shopping-cart': faShoppingCart, 'credit-card': faCreditCard,
  'shield': faShield,
  'heart-regular': faHeartRegular, 'star-regular': faStarRegular, 'bookmark-regular': faBookmarkRegular,
  'user-regular': faUserRegular, 'envelope-regular': faEnvelopeRegular, 'file-regular': faFileRegular,
  'folder-regular': faFolderRegular, 'image-regular': faImageRegular,
  'github': faGithub, 'twitter': faTwitter, 'facebook': faFacebook, 'instagram': faInstagram, 'linkedin': faLinkedin,
  'youtube': faYoutube, 'discord': faDiscord, 'steam': faSteam, 'spotify': faSpotify, 'apple': faApple,
  'google': faGoogle, 'microsoft': faMicrosoft, 'amazon': faAmazon, 'paypal': faPaypal,
  // Also support camelCase for backward compatibility
  'alignLeft': faAlignLeft, 'alignCenter': faAlignCenter, 'alignRight': faAlignRight,
  'arrowUp': faArrowUp, 'arrowDown': faArrowDown, 'arrowLeft': faArrowLeft, 'arrowRight': faArrowRight,
  'chevronUp': faChevronUp, 'chevronDown': faChevronDown, 'chevronLeft': faChevronLeft, 'chevronRight': faChevronRight,
  'eyeSlash': faEyeSlash, 'mapMarker': faMapMarker, 'externalLinkAlt': faExternalLinkAlt,
  'volumeUp': faVolumeUp, 'volumeDown': faVolumeDown, 'volumeMute': faVolumeMute, 'microphoneSlash': faMicrophoneSlash,
  'batteryFull': faBatteryFull, 'batteryHalf': faBatteryHalf, 'batteryEmpty': faBatteryEmpty,
  'cloudRain': faCloudRain, 'shoppingCart': faShoppingCart, 'creditCard': faCreditCard
}

const PREVIEW_DIR = path.join(process.cwd(), 'uploads', 'previews')
const PREVIEW_BASE_URL = process.env.PREVIEW_BASE_URL || '/api/previews'

// Ensure preview directory exists
export async function ensurePreviewDir() {
  try {
    await fs.mkdir(PREVIEW_DIR, { recursive: true })
    console.log(`Preview directory ensured: ${PREVIEW_DIR}`)
    
    // Check if directory is writable
    try {
      const testFile = path.join(PREVIEW_DIR, '.test-write')
      await fs.writeFile(testFile, 'test')
      await fs.unlink(testFile)
      console.log(`Preview directory is writable: ${PREVIEW_DIR}`)
    } catch (writeError) {
      console.error(`Preview directory is NOT writable: ${PREVIEW_DIR}`, writeError)
      throw new Error(`Preview directory is not writable: ${PREVIEW_DIR}`)
    }
  } catch (error: any) {
    console.error('Failed to create/verify preview directory:', error)
    throw new Error(`Failed to ensure preview directory: ${error.message}`)
  }
}

// Helper function to adjust color brightness (matching designer)
const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * amount)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

// Generate SVG for a single keycap (matching designer's generateSVGKeycap)
const generateKeycapSVG = (keycap: any, scale: number, offsetX: number, offsetY: number): string => {
  const UNIT = 48 * scale
  const KEY_SPACING = 4 * scale
  const BORDER_RADIUS = 2 * scale
  const INNER_RADIUS = 3 * scale
  
  const width = keycap.width * UNIT - KEY_SPACING
  const height = keycap.height * UNIT - KEY_SPACING
  
  // Calculate inner square area (matching designer)
  const innerTop = 2 * scale
  const innerLeft = 6 * scale
  const innerRight = 6 * scale
  const innerBottom = 10 * scale
  const innerWidth = width - innerLeft - innerRight
  const innerHeight = height - innerTop - innerBottom
  
  // Get base color (darker version)
  const baseColor = adjustColor(keycap.color || '#ffffff', -20)
  const mainColor = keycap.color || '#ffffff'
  
  // Create keycap shape (rectangular for now, can be extended for special shapes)
  const keycapShape = `
    <rect x="0" y="0" width="${width}" height="${height}" 
          rx="${BORDER_RADIUS}" ry="${BORDER_RADIUS}"
          fill="${baseColor}" 
          stroke="rgba(0, 0, 0, 0.15)" 
          stroke-width="1"/>
    <rect x="${innerLeft}" y="${innerTop}" 
          width="${innerWidth}" height="${innerHeight}" 
          rx="${INNER_RADIUS}" ry="${INNER_RADIUS}"
          fill="${mainColor}"/>
  `
  
  // Render layers
  const renderLayer = (layer: any): string => {
    if (layer.type === 'icon' && layer.content && layer.content.trim()) {
      // Extract icon name from content (format: "type:iconName" or just "iconName")
      let iconName = layer.content.includes(':') ? layer.content.split(':')[1] : layer.content
      const iconData = iconMap[iconName]
      
      if (!iconData) {
        console.warn(`Icon not found: ${iconName}`)
        return ''
      }
      
      // Convert FontAwesome icon to SVG path
      const iconSvg = icon(iconData)
      if (!iconSvg) {
        console.warn(`Failed to convert icon to SVG: ${iconName}`)
        return ''
      }
      
      const iconSize = (layer.fontSize || 16) * scale
      const iconColor = layer.color || keycap.textColor || '#ffffff'
      const iconHsl = hexToHsl(iconColor)
      
      // Calculate icon position
      const innerX = innerLeft
      const innerY = innerTop
      
      let iconX = innerX + innerWidth / 2
      let iconY = innerY + innerHeight / 2
      
      // Horizontal alignment
      if (layer.alignment === 'left') {
        iconX = innerX
      } else if (layer.alignment === 'right') {
        iconX = innerX + innerWidth
      }
      
      // Vertical alignment
      if (layer.verticalAlignment === 'top') {
        iconY = innerY
      } else if (layer.verticalAlignment === 'bottom') {
        iconY = innerY + innerHeight
      }
      
      // Apply offsets
      iconX += (layer.offsetX || 0) * scale
      iconY += (layer.offsetY || 0) * scale
      
      // Get SVG path data from icon
      // FontAwesome icon structure: iconSvg.abstract is an array of nodes
      const abstract = iconSvg.abstract
      if (!abstract || !Array.isArray(abstract) || abstract.length === 0) {
        console.warn(`[Preview] Invalid icon structure for: ${iconName}`)
        return ''
      }
      
      // Extract all path elements recursively
      const paths: string[] = []
      const extractPaths = (node: any): void => {
        if (!node) return
        
        // Check if this node is a path element
        if (node.tag === 'path' && node.attributes && node.attributes.d) {
          paths.push(node.attributes.d)
        }
        
        // Recursively check children
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => extractPaths(child))
        }
      }
      
      // Process all nodes in abstract array
      abstract.forEach((node: any) => {
        extractPaths(node)
      })
      
      if (paths.length === 0) {
        console.warn(`[Preview] No path data found for icon: ${iconName}`)
        console.warn(`[Preview] Abstract structure:`, JSON.stringify(abstract, null, 2).substring(0, 500))
        return ''
      }
      
      console.log(`[Preview] Rendering icon: ${iconName}, found ${paths.length} path(s)`)
      
      // FontAwesome icons use 512x512 viewBox
      const viewBoxSize = 512
      const scaleFactor = iconSize / viewBoxSize
      
      // Build transform string - SVG transforms are applied right-to-left!
      // We want: translate to position, then scale, then center the icon
      // Order (right to left): translate to position -> rotate -> mirror -> scale -> translate to center
      let transformParts: string[] = []
      
      // 1. Translate to icon position (center)
      transformParts.push(`translate(${iconX}, ${iconY})`)
      
      // 2. Apply rotation around center (if any)
      if (layer.rotation) {
        transformParts.push(`rotate(${layer.rotation})`)
      }
      
      // 3. Apply mirror (if any)
      if (layer.mirrorX || layer.mirrorY) {
        const scaleX = layer.mirrorX ? -1 : 1
        const scaleY = layer.mirrorY ? -1 : 1
        transformParts.push(`scale(${scaleX}, ${scaleY})`)
      }
      
      // 4. Scale the icon from 512x512 to desired size
      transformParts.push(`scale(${scaleFactor})`)
      
      // 5. Translate from (0,0) to viewBox center so icon is centered
      transformParts.push(`translate(${-viewBoxSize / 2}, ${-viewBoxSize / 2})`)
      
      const transform = transformParts.join(' ')
      
      // Render all paths
      const pathElements = paths.map((pathData) => {
        // Escape any special characters in path data
        const escapedPath = pathData.replace(/"/g, '&quot;').replace(/'/g, '&apos;')
        return `<path d="${escapedPath}" fill="hsl(${iconHsl.h}, ${iconHsl.s}%, ${iconHsl.l}%)" />`
      }).join('')
      
      return `<g transform="${transform}">${pathElements}</g>`
    }
    
    if (layer.type === 'text' && layer.content && layer.content.trim()) {
      const fontSize = (layer.fontSize || 14) * scale
      const textColor = layer.color || keycap.textColor || '#ffffff'
      const textHsl = hexToHsl(textColor)
      
      // Calculate text position
      const innerX = innerLeft
      const innerY = innerTop
      
      let textX = innerX + innerWidth / 2
      let textY = innerY + innerHeight / 2
      let textAnchor = 'middle'
      let dominantBaseline = 'middle'
      
      // Horizontal alignment
      if (layer.alignment === 'left') {
        textX = innerX
        textAnchor = 'start'
      } else if (layer.alignment === 'right') {
        textX = innerX + innerWidth
        textAnchor = 'end'
      }
      
      // Vertical alignment
      if (layer.verticalAlignment === 'top') {
        textY = innerY
        dominantBaseline = 'text-before-edge'
      } else if (layer.verticalAlignment === 'bottom') {
        textY = innerY + innerHeight
        dominantBaseline = 'text-after-edge'
      }
      
      // Apply offsets
      textX += (layer.offsetX || 0) * scale
      textY += (layer.offsetY || 0) * scale
      
      // Rotation transform
      const transform = layer.rotation 
        ? `transform="rotate(${layer.rotation} ${textX} ${textY})"`
        : ''
      
      return `
        <text 
          x="${textX}" 
          y="${textY}" 
          font-size="${fontSize}" 
          font-family="${layer.font || 'Arial, sans-serif'}"
          font-weight="${layer.bold ? 'bold' : 'normal'}"
          font-style="${layer.italic ? 'italic' : 'normal'}"
          text-decoration="${layer.underline ? 'underline' : 'none'}"
          fill="hsl(${textHsl.h}, ${textHsl.s}%, ${textHsl.l}%)"
          text-anchor="${textAnchor}"
          dominant-baseline="${dominantBaseline}"
          ${transform}
        >${(layer.content || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
      `
    }
    
    if (layer.type === 'image' && layer.content && layer.content.trim()) {
      return `
        <image
          href="${layer.content}"
          x="${innerLeft}"
          y="${innerTop}"
          width="${innerWidth}"
          height="${innerHeight}"
          preserveAspectRatio="xMidYMid meet"
        />
      `
    }
    
    return ''
  }
  
  const layers = keycap.layers?.map((layer: any) => renderLayer(layer)).join('') || ''
  
  return `
    <g transform="translate(${offsetX}, ${offsetY})">
      ${keycapShape}
      ${layers}
    </g>
  `
}

// Generate preview from layoutData
export async function generatePreview(configId: number, layoutData: any): Promise<string | null> {
  try {
    console.log(`[Preview] Starting preview generation for config ${configId}`)
    await ensurePreviewDir()

    const layout = layoutData?.layout || layoutData
    if (!layout || !Array.isArray(layout.keys)) {
      console.error(`[Preview] Invalid layout data for config ${configId}:`, { hasLayout: !!layout, hasKeys: !!layout?.keys })
      throw new Error('Invalid layout data')
    }
    
    console.log(`[Preview] Layout validated for config ${configId}, keys count: ${layout.keys.length}`)

    // Use same scale as designer for consistency
    const UNIT = 48
    const BASE_SCALE = 3.0 // Higher scale for better quality
    const pad = 20 * BASE_SCALE // Padding around keyboard
    
    const maxW = Math.max(0, ...layout.keys.map((k: any) => k.x + k.width))
    const maxH = Math.max(0, ...layout.keys.map((k: any) => k.y + k.height))
    const svgW = Math.round(maxW * UNIT * BASE_SCALE + pad * 2)
    const svgH = Math.round(maxH * UNIT * BASE_SCALE + pad * 2)

    // Generate SVG string for each keycap using designer's logic
    const svgParts = layout.keys.map((k: any) => {
      const offsetX = pad + k.x * UNIT * BASE_SCALE
      const offsetY = pad + k.y * UNIT * BASE_SCALE
      return generateKeycapSVG(k, BASE_SCALE, offsetX, offsetY)
    }).join('')

    const svg = `
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${svgW}" height="${svgH}" rx="8" ry="8" fill="#0b0d10" stroke="#1f2937" />
        ${svgParts}
      </svg>
    `.trim()

    // Convert SVG to PNG - no resize needed since SVG is already high resolution
    // Only limit maximum size to prevent extremely large files
    const pngBuffer = await sharp(Buffer.from(svg))
      .resize(2400, null, { 
        fit: 'inside', 
        withoutEnlargement: true, // Don't enlarge if SVG is smaller
        kernel: sharp.kernel.lanczos3 // Higher quality resampling
      })
      .png({ 
        compressionLevel: 6, // Balanced compression (0-9, lower = less compression, better quality)
        adaptiveFiltering: true // Better quality for sharp edges
      })
      .toBuffer()

    // Save PNG file
    const filename = `preview-${configId}-${Date.now()}.png`
    const filepath = path.join(PREVIEW_DIR, filename)
    
    console.log(`[Preview] Saving preview file: ${filepath}`)
    await fs.writeFile(filepath, pngBuffer)
    
    // Verify file was written
    const stats = await fs.stat(filepath)
    console.log(`[Preview] Preview file saved successfully: ${filename}`)
    console.log(`[Preview] File size: ${stats.size} bytes`)
    console.log(`[Preview] File path: ${filepath}`)
    console.log(`[Preview] Preview URL: ${PREVIEW_BASE_URL}/${filename}`)

    // Return URL
    const previewUrl = `${PREVIEW_BASE_URL}/${filename}`
    console.log(`[Preview] Preview generation completed for config ${configId}: ${previewUrl}`)
    return previewUrl
  } catch (error: any) {
    console.error(`[Preview] Error generating preview for config ${configId}:`, error)
    console.error(`[Preview] Error stack:`, error?.stack)
    return null
  }
}

// Delete preview file
export async function deletePreview(previewUrl: string | null | undefined) {
  if (!previewUrl) return
  try {
    const filename = path.basename(previewUrl)
    const filepath = path.join(PREVIEW_DIR, filename)
    await fs.unlink(filepath).catch(() => {}) // Ignore if file doesn't exist
  } catch (error) {
    console.error('Error deleting preview:', error)
  }
}

