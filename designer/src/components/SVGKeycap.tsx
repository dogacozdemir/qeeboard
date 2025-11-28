import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faShield,
  // Additional solid icons from IconPicker
  faBars, faEllipsisH, faEllipsisV, faThumbsUp, faThumbsDown, faSmile, faFrown, faMeh,
  faFire, faBolt, faZap, faShieldAlt, faFlag, faFlagCheckered,
  faRocket, faPlane, faCar, faBicycle, faBus, faTrain, faShip, faHelicopter,
  faBuilding, faStore, faHospital, faSchool, faUniversity, faChurch, faMosque,
  faCoffee, faUtensils, faPizzaSlice, faHamburger, faIceCream, faCookie, faCake,
  faMusic, faHeadphones, faMicrophone as faMic, faRadio, faTv, faCamera, faVideo,
  faBook, faBookOpen, faNewspaper, faScroll, faPen, faPencil, faPencilAlt,
  faPaintBrush, faPalette, faEraser, faHighlighter, faMarker, faStamp,
  faGlobe, faGlobeAmericas, faGlobeEurope, faGlobeAsia, faMap, faMapPin,
  faCompass, faRoute, faRoad, faSign, faTrafficLight, faParking,
  faTree, faLeaf, faSeedling, faBug, faSpider, faFish,
  faCat, faDog, faHorse, faPaw, faFrog, faDove, faCrow, faOtter,
  faGem, faDiamond, faCrown, faRing, faGlasses,
  faHatCowboy, faHatWizard, faMask, faTheaterMasks, faVest, faShirt,
  faDice, faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix,
  faChess, faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn,
  faPuzzlePiece, faCube, faCubes, faBox, faBoxes, faGift as faPresent,
  faTag, faTags, faTicketAlt, faQrcode, faBarcode, faReceipt, faMoneyBill,
  faCoins, faDollarSign, faEuroSign, faPoundSign, faYenSign, faWonSign,
  faCalculator, faRuler, faRulerCombined, faRulerHorizontal, faRulerVertical,
  faWeight, faBalanceScale, faThermometerHalf, faThermometerFull, faThermometerEmpty,
  faStopwatch, faHourglass, faHourglassHalf, faHourglassStart, faHourglassEnd,
  faBell, faBellSlash, faAlarmClock, faBed, faToilet, faShower, faBath,
  faTooth, faPills, faSyringe, faBandAid, faStethoscope, faHeartbeat,
  faRunning, faWalking, faHiking, faSwimmer, faBasketballBall, faFootball, faBaseball,
  faSoccerBall, faVolleyballBall, faGolfBall, faBowlingBall, faHockeyPuck,
  faSkating, faSkiing, faSnowboarding,
  faTent, faSuitcase, faSuitcaseRolling,
  faPassport, faIdCard, faIdBadge, faCreditCard as faCard, faWallet,
  faHandshake, faHands, faHandsHelping, faHandsWash, faHandHolding, faHandHoldingHeart,
  faThumbtack, faPaperclip, faClipboard, faClipboardList, faClipboardCheck,
  faStickyNote, faNoteSticky,
  faBookmark as faBookmarkSolid,
  faRibbon, faAward, faMedal, faTrophy as faTrophySolid,
  faWineGlass, faWineGlassAlt, faBeer, faCocktail,
  faUtensilSpoon,
  faBlender, faBlenderPhone,
  faBroom, faSprayCan, faSoap,
  faToiletPaper, faPaperPlane, faPlaneDeparture, faPlaneArrival,
  faParachuteBox, faSatellite, faSatelliteDish, faSpaceShuttle,
  faRobot, faFeather, faFeatherAlt,
  faPeace, faOm, faYinYang
} from '@fortawesome/free-solid-svg-icons';

import { 
  faHeart as faHeartRegular, 
  faStar as faStarRegular,
  faBookmark as faBookmarkRegular,
  faUser as faUserRegular,
  faEnvelope as faEnvelopeRegular,
  faFile as faFileRegular,
  faFolder as faFolderRegular,
  faImage as faImageRegular
} from '@fortawesome/free-regular-svg-icons';

import { 
  faGithub, faTwitter, faFacebook, faInstagram, faLinkedin,
  faYoutube, faDiscord, faSteam, faSpotify, faApple,
  faGoogle, faMicrosoft, faAmazon, faPaypal
} from '@fortawesome/free-brands-svg-icons';

import { KeycapConfig, KeycapLayer } from '@/types/keyboard';
import { getTheme } from '@/data/themes';

const iconMap: Record<string, any> = {
  // Basic icons
  home: faHome, user: faUser, cog: faCog, heart: faHeart, star: faStar,
  play: faPlay, pause: faPause, stop: faStop, edit: faEdit, trash: faTrash,
  save: faSave, download: faDownload, upload: faUpload, copy: faCopy, cut: faCut, paste: faPaste,
  bold: faBold, italic: faItalic, underline: faUnderline, 'align-left': faAlignLeft, 'align-center': faAlignCenter, 'align-right': faAlignRight,
  plus: faPlus, minus: faMinus, times: faMultiply, multiply: faMultiply, divide: faDivide, equals: faEquals,
  'arrow-up': faArrowUp, 'arrow-down': faArrowDown, 'arrow-left': faArrowLeft, 'arrow-right': faArrowRight,
  'chevron-up': faChevronUp, 'chevron-down': faChevronDown, 'chevron-left': faChevronLeft, 'chevron-right': faChevronRight,
  check: faCheck, x: faX, question: faQuestion, exclamation: faExclamation,
  lock: faLock, unlock: faUnlock, eye: faEye, 'eye-slash': faEyeSlash, key: faKey,
  phone: faPhone, envelope: faEnvelope, calendar: faCalendar, clock: faClock, 'map-marker': faMapMarker,
  image: faImage, file: faFile, folder: faFolder, link: faLink, 'external-link-alt': faExternalLinkAlt,
  'volume-up': faVolumeUp, 'volume-down': faVolumeDown, 'volume-mute': faVolumeMute, microphone: faMicrophone, 'microphone-slash': faMicrophoneSlash,
  wifi: faWifi, 'battery-full': faBatteryFull, 'battery-half': faBatteryHalf, 'battery-empty': faBatteryEmpty,
  sun: faSun, moon: faMoon, cloud: faCloud, 'cloud-rain': faCloudRain, snowflake: faSnowflake,
  gamepad: faGamepad, trophy: faTrophy, gift: faGift, 'shopping-cart': faShoppingCart, 'credit-card': faCreditCard,
  shield: faShield,
  // Additional icons from IconPicker
  bars: faBars, 'ellipsis-h': faEllipsisH, 'ellipsis-v': faEllipsisV, 'thumbs-up': faThumbsUp, 'thumbs-down': faThumbsDown, smile: faSmile, frown: faFrown, meh: faMeh,
  fire: faFire, bolt: faBolt, zap: faZap, 'shield-alt': faShieldAlt, flag: faFlag, 'flag-checkered': faFlagCheckered,
  rocket: faRocket, plane: faPlane, car: faCar, bicycle: faBicycle, bus: faBus, train: faTrain, ship: faShip, helicopter: faHelicopter,
  building: faBuilding, store: faStore, hospital: faHospital, school: faSchool, university: faUniversity, church: faChurch, mosque: faMosque,
  coffee: faCoffee, utensils: faUtensils, 'pizza-slice': faPizzaSlice, hamburger: faHamburger, 'ice-cream': faIceCream, cookie: faCookie, cake: faCake,
  music: faMusic, headphones: faHeadphones, mic: faMic, radio: faRadio, tv: faTv, camera: faCamera, video: faVideo,
  book: faBook, 'book-open': faBookOpen, newspaper: faNewspaper, scroll: faScroll, pen: faPen, pencil: faPencil, 'pencil-alt': faPencilAlt,
  'paint-brush': faPaintBrush, palette: faPalette, eraser: faEraser, highlighter: faHighlighter, marker: faMarker, stamp: faStamp,
  globe: faGlobe, 'globe-americas': faGlobeAmericas, 'globe-europe': faGlobeEurope, 'globe-asia': faGlobeAsia, map: faMap, 'map-pin': faMapPin,
  compass: faCompass, route: faRoute, road: faRoad, sign: faSign, 'traffic-light': faTrafficLight, parking: faParking,
  tree: faTree, leaf: faLeaf, seedling: faSeedling, bug: faBug, spider: faSpider, fish: faFish,
  cat: faCat, dog: faDog, horse: faHorse, paw: faPaw, frog: faFrog, dove: faDove, crow: faCrow, otter: faOtter,
  gem: faGem, diamond: faDiamond, crown: faCrown, ring: faRing, glasses: faGlasses,
  'hat-cowboy': faHatCowboy, 'hat-wizard': faHatWizard, mask: faMask, 'theater-masks': faTheaterMasks, vest: faVest, shirt: faShirt,
  dice: faDice, 'dice-one': faDiceOne, 'dice-two': faDiceTwo, 'dice-three': faDiceThree, 'dice-four': faDiceFour, 'dice-five': faDiceFive, 'dice-six': faDiceSix,
  chess: faChess, 'chess-king': faChessKing, 'chess-queen': faChessQueen, 'chess-rook': faChessRook, 'chess-bishop': faChessBishop, 'chess-knight': faChessKnight, 'chess-pawn': faChessPawn,
  'puzzle-piece': faPuzzlePiece, cube: faCube, cubes: faCubes, box: faBox, boxes: faBoxes, present: faPresent,
  tag: faTag, tags: faTags, 'ticket-alt': faTicketAlt, qrcode: faQrcode, barcode: faBarcode, receipt: faReceipt, 'money-bill': faMoneyBill,
  coins: faCoins, 'dollar-sign': faDollarSign, 'euro-sign': faEuroSign, 'pound-sign': faPoundSign, 'yen-sign': faYenSign, 'won-sign': faWonSign,
  calculator: faCalculator, ruler: faRuler, 'ruler-combined': faRulerCombined, 'ruler-horizontal': faRulerHorizontal, 'ruler-vertical': faRulerVertical,
  weight: faWeight, 'balance-scale': faBalanceScale, 'thermometer-half': faThermometerHalf, 'thermometer-full': faThermometerFull, 'thermometer-empty': faThermometerEmpty,
  stopwatch: faStopwatch, hourglass: faHourglass, 'hourglass-half': faHourglassHalf, 'hourglass-start': faHourglassStart, 'hourglass-end': faHourglassEnd,
  bell: faBell, 'bell-slash': faBellSlash, 'alarm-clock': faAlarmClock, bed: faBed, toilet: faToilet, shower: faShower, bath: faBath,
  tooth: faTooth, pills: faPills, syringe: faSyringe, 'band-aid': faBandAid, stethoscope: faStethoscope, heartbeat: faHeartbeat,
  running: faRunning, walking: faWalking, hiking: faHiking, swimmer: faSwimmer, 'basketball-ball': faBasketballBall, football: faFootball, baseball: faBaseball,
  'soccer-ball': faSoccerBall, 'volleyball-ball': faVolleyballBall, 'golf-ball': faGolfBall, 'bowling-ball': faBowlingBall, 'hockey-puck': faHockeyPuck,
  skating: faSkating, skiing: faSkiing, snowboarding: faSnowboarding,
  tent: faTent, suitcase: faSuitcase, 'suitcase-rolling': faSuitcaseRolling,
  passport: faPassport, 'id-card': faIdCard, 'id-badge': faIdBadge, card: faCard, wallet: faWallet,
  handshake: faHandshake, hands: faHands, 'hands-helping': faHandsHelping, 'hands-wash': faHandsWash, 'hand-holding': faHandHolding, 'hand-holding-heart': faHandHoldingHeart,
  thumbtack: faThumbtack, paperclip: faPaperclip, clipboard: faClipboard, 'clipboard-list': faClipboardList, 'clipboard-check': faClipboardCheck,
  'sticky-note': faStickyNote, 'note-sticky': faNoteSticky,
  'bookmark-solid': faBookmarkSolid,
  ribbon: faRibbon, award: faAward, medal: faMedal, 'trophy-solid': faTrophySolid,
  'wine-glass': faWineGlass, 'wine-glass-alt': faWineGlassAlt, beer: faBeer, cocktail: faCocktail,
  'utensil-spoon': faUtensilSpoon,
  blender: faBlender, 'blender-phone': faBlenderPhone,
  broom: faBroom, 'spray-can': faSprayCan, soap: faSoap,
  'toilet-paper': faToiletPaper, 'paper-plane': faPaperPlane, 'plane-departure': faPlaneDeparture, 'plane-arrival': faPlaneArrival,
  'parachute-box': faParachuteBox, satellite: faSatellite, 'satellite-dish': faSatelliteDish, 'space-shuttle': faSpaceShuttle,
  robot: faRobot, feather: faFeather, 'feather-alt': faFeatherAlt,
  peace: faPeace, om: faOm, 'yin-yang': faYinYang,

  // Regular icons
  'heart-regular': faHeartRegular, 'star-regular': faStarRegular, 'bookmark-regular': faBookmarkRegular,
  'user-regular': faUserRegular, 'envelope-regular': faEnvelopeRegular, 'file-regular': faFileRegular,
  'folder-regular': faFolderRegular, 'image-regular': faImageRegular,

  // Brand icons
  github: faGithub, twitter: faTwitter, facebook: faFacebook, instagram: faInstagram, linkedin: faLinkedin,
  youtube: faYoutube, discord: faDiscord, steam: faSteam, spotify: faSpotify, apple: faApple,
  google: faGoogle, microsoft: faMicrosoft, amazon: faAmazon, paypal: faPaypal
};

const adjustColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1);
};

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
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

interface SVGKeycapProps {
  keycap: KeycapConfig;
  scale?: number;
  showBorder?: boolean;
  borderColor?: string;
  className?: string;
  shape?: 'rect' | 'l-shape';
  selected?: boolean;
  hovered?: boolean;
  currentTheme?: string;
  lShapeConfig?: {
    margins?: Partial<{ top: number; right: number; bottom: number; left: number }>;
    notch?: Partial<{ widthUnits: number; heightUnits: number; adjustLeftPx: number; adjustTopPx: number; bottomAdjustLeftPx: number }>;
    anchor?: 'top-left' | 'top-right' | 'center';
    baseWidthUnits?: number;
  };
}

const SVGKeycap: React.FC<SVGKeycapProps> = ({
  keycap,
  scale = 1,
  showBorder = false,
  borderColor = '#1990ff',
  className = '',
  shape = 'rect',
  selected = false,
  hovered = false,
  currentTheme,
  lShapeConfig
}) => {
  const UNIT = 48 * scale;
  const KEY_SPACING = 4 * scale;
  const BORDER_RADIUS = 2 * scale;
  const INNER_RADIUS = 3 * scale;

  const width = keycap.width * UNIT - KEY_SPACING;
  const height = keycap.height * UNIT - KEY_SPACING;

  const innerTop = 2 * scale;
  const innerLeft = 6 * scale;
  const innerRight = 6 * scale;
  const innerBottom = 10 * scale;

  const innerWidth = width - innerLeft - innerRight;
  const innerHeight = height - innerTop - innerBottom;

  // Check if theme is global gradient
  const theme = currentTheme ? getTheme(currentTheme as any) : null;
  const isGlobalGradient = theme?.type === 'gradient' && theme.mode === 'global';

  // For global gradient, baseColor should be calculated from gradient start color
  // For position-based gradient, baseColor is calculated from the interpolated color (keycap.color)
  // For solid/no theme, baseColor is calculated from keycap.color
  let colorForBase = keycap.color || '#ffffff';
  if (isGlobalGradient && theme) {
    // Use gradient start color to calculate baseColor (outer darker part)
    colorForBase = theme.colors.start;
  }

  let baseColor = adjustColor(colorForBase, -20);
  let mainColor = keycap.color || '#ffffff';

  if (selected) {
    baseColor = adjustColor(baseColor, 10);
    // For global gradient, don't adjust mainColor (it's a gradient)
    if (!isGlobalGradient) {
      mainColor = adjustColor(mainColor, 10);
    }
  } else if (hovered) {
    baseColor = adjustColor(baseColor, 5);
    // For global gradient, don't adjust mainColor (it's a gradient)
    if (!isGlobalGradient) {
      mainColor = adjustColor(mainColor, 5);
    }
  }

  const baseHsl = hexToHsl(baseColor);
  const mainHsl = hexToHsl(mainColor);

  // Generate gradient ID for this keycap (only for inner square)
  const gradientId = isGlobalGradient ? `gradient-${keycap.id}` : null;

  const renderLayer = (layer: KeycapLayer, index: number) => {
    const centerX = innerLeft + innerWidth / 2;
    const centerY = innerTop + innerHeight / 2;
    
    const transform = `
      translate(${centerX}, ${centerY})
      rotate(${layer.rotation || 0})
      scale(${layer.mirrorX ? -1 : 1}, ${layer.mirrorY ? -1 : 1})
      translate(${-centerX}, ${-centerY})
    `;

    if (layer.type === 'image' && layer.content?.trim()) {
      // Calculate preserveAspectRatio based on alignment
      // Format: xAlignYAlign meet/slice
      let xAlign = 'Mid'; // left -> Min, center -> Mid, right -> Max
      let yAlign = 'Mid'; // top -> Min, center -> Mid, bottom -> Max

      if (layer.alignment === 'left') {
        xAlign = 'Min';
      } else if (layer.alignment === 'right') {
        xAlign = 'Max';
      }

      if (layer.verticalAlignment === 'top') {
        yAlign = 'Min';
      } else if (layer.verticalAlignment === 'bottom') {
        yAlign = 'Max';
      }

      const preserveAspectRatio = `x${xAlign}Y${yAlign} meet`;

      // Calculate base image position based on alignment
      // For vertical alignment, we need to adjust the y position
      // Image always starts at (x, y), so we need to calculate where it should start
      let imageX = innerLeft;
      let imageY = innerTop;

      // Horizontal alignment affects x position
      if (layer.alignment === 'left') {
        imageX = innerLeft;
      } else if (layer.alignment === 'right') {
        imageX = innerLeft; // Image still starts at innerLeft, preserveAspectRatio handles right alignment
      } else {
        // center - image starts at innerLeft, preserveAspectRatio centers it
        imageX = innerLeft;
      }

      // Vertical alignment affects y position
      // Since preserveAspectRatio="meet" scales image to fit, we need to adjust y
      // For top: start at innerTop
      // For center: start at innerTop (preserveAspectRatio centers it)
      // For bottom: we need to calculate - image will be scaled to fit width or height
      // Since we don't know the actual image dimensions, we'll use a different approach:
      // Use preserveAspectRatio for vertical alignment, but also adjust y position
      
      // Actually, for SVG image with preserveAspectRatio="meet", the image is scaled to fit
      // and then aligned within the viewBox. The x,y position is always the top-left of the viewBox.
      // So we need to use a transform to move the image after it's been scaled and aligned.
      
      // Better approach: Use preserveAspectRatio for both alignments, and use transform for positioning
      // But that's complex. Let's use a simpler approach: calculate y based on vertical alignment
      // assuming the image will be scaled to fit the width (worst case for vertical alignment)
      
      // Actually, the simplest solution: Use preserveAspectRatio for horizontal alignment,
      // and adjust y position for vertical alignment by using a transform
      
      // Calculate transform for vertical alignment
      let verticalTransform = '';
      if (layer.verticalAlignment === 'top') {
        imageY = innerTop;
      } else if (layer.verticalAlignment === 'bottom') {
        // For bottom alignment, we need to move the image down
        // Since image is scaled with preserveAspectRatio="meet", we can't know exact height
        // So we'll use a transform to translate it down by innerHeight
        imageY = innerTop;
        verticalTransform = `translate(0, ${innerHeight})`;
      } else {
        // center
        imageY = innerTop;
        verticalTransform = `translate(0, ${innerHeight / 2})`;
      }

      // Apply offsets
      imageX += (layer.offsetX || 0) * scale;
      imageY += (layer.offsetY || 0) * scale;

      // Combine transforms
      const imageTransform = verticalTransform ? `${transform} ${verticalTransform}` : transform;

      const imageOpacity = layer.opacity !== undefined ? layer.opacity : 1;

      return (
        <g key={layer.id} transform={imageTransform} clipPath={`url(#text-clip-${keycap.id}-${index})`}>
          <image
            href={layer.content}
            x={imageX}
            y={imageY}
            width={innerWidth}
            height={innerHeight}
            preserveAspectRatio={preserveAspectRatio}
            opacity={imageOpacity}
          />
        </g>
      );
    }

    if (layer.type === 'icon' && layer.content?.trim()) {
      let iconName = layer.content.includes(':') ? layer.content.split(':')[1] : layer.content;
      const iconData = iconMap[iconName];
      if (!iconData) return null;

      const iconSize = (layer.fontSize || 16) * scale;
      const iconColor = layer.color || keycap.textColor || '#ffffff';
      
      // Calculate icon position based on alignment - same logic as text
      let iconX = innerLeft + innerWidth / 2;
      let iconY = innerTop + innerHeight / 2;

      // Horizontal alignment - full inner square width
      if (layer.alignment === 'left') {
        iconX = innerLeft;
      } else if (layer.alignment === 'right') {
        iconX = innerLeft + innerWidth;
      }
      // else 'center' - already set

      // Vertical alignment - full inner square height
      if (layer.verticalAlignment === 'top') {
        iconY = innerTop;
      } else if (layer.verticalAlignment === 'bottom') {
        iconY = innerTop + innerHeight;
      }
      // else 'center' - already set

      // Apply offsets
      iconX += (layer.offsetX || 0) * scale;
      iconY += (layer.offsetY || 0) * scale;

      return (
        <g key={layer.id} transform={transform} clipPath={`url(#text-clip-${keycap.id}-${index})`}>
          <foreignObject
            x={iconX - iconSize / 2}
            y={iconY - iconSize / 2}
            width={iconSize}
            height={iconSize}
          >
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
              <FontAwesomeIcon icon={iconData} style={{ fontSize: `${iconSize}px`, width: `${iconSize}px`, height: `${iconSize}px` }} />
            </div>
          </foreignObject>
        </g>
      );
    }

    const fontSize = (layer.fontSize || 10) * scale;
    const textColor = layer.color || keycap.textColor || '#ffffff';
    const textHsl = hexToHsl(textColor);

    // Calculate text position - 100% of inner square area
    let textX = innerLeft + innerWidth / 2;
    let textY = innerTop + innerHeight / 2;
    let textAnchor = 'middle';
    let dominantBaseline = 'middle';

    // Horizontal alignment - full inner square width
    if (layer.alignment === 'left') {
      textX = innerLeft;
      textAnchor = 'start';
    } else if (layer.alignment === 'right') {
      textX = innerLeft + innerWidth;
      textAnchor = 'end';
    }

    // Vertical alignment - full inner square height
    if (layer.verticalAlignment === 'top') {
      textY = innerTop;
      dominantBaseline = 'text-before-edge';
    } else if (layer.verticalAlignment === 'bottom') {
      textY = innerTop + innerHeight;
      dominantBaseline = 'text-after-edge';
    }

    return (
      <g key={layer.id} transform={transform} clipPath={`url(#text-clip-${keycap.id}-${index})`}>
        <text
          x={textX + (layer.offsetX || 0) * scale}
          y={textY + (layer.offsetY || 0) * scale}
          fontSize={fontSize}
          fontFamily={layer.font || 'Arial, sans-serif'}
          fontWeight={layer.bold ? 'bold' : 'normal'}
          fontStyle={layer.italic ? 'italic' : 'normal'}
          textDecoration={layer.underline ? 'underline' : 'none'}
          fill={`hsl(${textHsl.h}, ${textHsl.s}%, ${textHsl.l}%)`}
          textAnchor={textAnchor}
          dominantBaseline={dominantBaseline}
        >
          {layer.content || ''}
        </text>
      </g>
    );
  };

  // Calculate L-shape dimensions and transform
  const getLShapeDimensions = () => {
    if (shape !== 'l-shape' || !lShapeConfig) return null;
    
    const u = 48 * scale;
    const margins = { top: 0, right: 0, bottom: 0, left: 0, ...(lShapeConfig?.margins || {}) };
    const notchWUnits = lShapeConfig?.notch?.widthUnits ?? 0.5;
    const notchHUnits = lShapeConfig?.notch?.heightUnits ?? 1;
    const notchAdjustLeftPx = lShapeConfig?.notch?.adjustLeftPx ?? 0;
    const notchAdjustTopPx = lShapeConfig?.notch?.adjustTopPx ?? 0;
    const bottomAdjustLeftPx = lShapeConfig?.notch?.bottomAdjustLeftPx ?? 0;
    const anchor = lShapeConfig?.anchor ?? 'top-left';

    const baseWidthUnits = lShapeConfig?.baseWidthUnits ?? 1.5;
    const baseWidth = baseWidthUnits * u;
    const baseHeight = 2 * u + KEY_SPACING;
    const notchW = notchWUnits * u + notchAdjustLeftPx;
    const notchH = notchHUnits * u + notchAdjustTopPx;

    const availableW = Math.max(1, width - margins.left - margins.right);
    const availableH = Math.max(1, height - margins.top - margins.bottom) + KEY_SPACING;
    const scaleX = availableW / baseWidth;
    const scaleY = availableH / baseHeight;
    const fitScale = Math.min(scaleX, scaleY);
    const scaledWidth = baseWidth * fitScale;
    const scaledHeight = baseHeight * fitScale;
    const translateX = anchor === 'top-right'
      ? width - margins.right - scaledWidth
      : anchor === 'center'
        ? (width - scaledWidth) / 2
        : margins.left;
    const translateY = margins.top;

    // Calculate inner L-shape in pre-transform coordinates
    const innerStartX = innerLeft / fitScale + 25;
    const innerStartY = innerTop / fitScale;
    const innerEndX = baseWidth - (innerRight / fitScale);
    const innerEndY = baseHeight - (innerBottom / fitScale);
    const innerNotchW = Math.max(0, notchW - (innerLeft / fitScale)) + 15;
    const innerNotchBottomY = Math.max(innerStartY, notchH - (innerTop / fitScale)) - 5;
    const innerRadius = INNER_RADIUS / fitScale;
    const adj = bottomAdjustLeftPx / fitScale;

    return {
      u,
      margins,
      baseWidth,
      baseHeight,
      notchW,
      notchH,
      fitScale,
      translateX,
      translateY,
      innerStartX,
      innerStartY,
      innerEndX,
      innerEndY,
      innerNotchW,
      innerNotchBottomY,
      innerRadius,
      adj
    };
  };

  const lShapeDims = getLShapeDimensions();

  const renderLShape = () => {
    if (!lShapeDims) return null;
    
    const { baseWidth, baseHeight, notchW, notchH, fitScale, translateX, translateY, 
            innerStartX, innerStartY, innerEndX, innerEndY, innerNotchW, innerNotchBottomY, 
            innerRadius, adj } = lShapeDims;

    // Path: top bar 2u wide, vertical bar 1u wide on right, bottom bar 1u wide from left
    // Add rounded corners to all 6 corners including notch corners
    // Path goes clockwise: outer corners use sweep flag 1, inner (concave) corners use sweep flag 1
    // Use innerRadius for pathData to match innerPathData radius
    const pathRadius = innerRadius; // Use same radius as innerPathData
    
    // For concave corners to curve inward properly when path goes clockwise:
    // We need to use sweep flag 1 (clockwise) but ensure the arc endpoints create inward curve
    // The key is having the arc endpoints on the correct sides relative to the corner
    const pathData = `
      M ${pathRadius} 0
      H ${baseWidth - pathRadius}
      A ${pathRadius} ${pathRadius} 0 0 1 ${baseWidth} ${pathRadius}
      V ${baseHeight - pathRadius}
      A ${pathRadius} ${pathRadius} 0 0 1 ${baseWidth - pathRadius} ${baseHeight}
      H ${notchW + pathRadius}
      A ${pathRadius} ${pathRadius} 0 0 1 ${notchW} ${baseHeight - pathRadius}
      V ${notchH - pathRadius}
      A ${pathRadius} ${pathRadius} 0 0 0 ${notchW + pathRadius} ${notchH}
      H ${pathRadius}
      A ${pathRadius} ${pathRadius} 0 0 1 0 ${notchH - pathRadius}
      V ${pathRadius}
      A ${pathRadius} ${pathRadius} 0 0 1 ${pathRadius} 0
      Z
    `;

    const outerTransform = `translate(${translateX}, ${translateY}) scale(${fitScale})`;
    
    // Build inner L-path - identical structure to outer path, just inset
    // Inner concave corners use sweep flag 1 and adjusted coordinates for proper inward curve
    const innerPathData = `
      M ${innerStartX + innerRadius} ${innerStartY}
      H ${innerEndX - innerRadius}
      A ${innerRadius} ${innerRadius} 0 0 1 ${innerEndX} ${innerStartY + innerRadius}
      V ${innerEndY - innerRadius}
      A ${innerRadius} ${innerRadius} 0 0 1 ${innerEndX - innerRadius} ${innerEndY}
      H ${Math.max(innerNotchW + innerRadius + adj, innerStartX + innerRadius)}
      A ${innerRadius} ${innerRadius} 0 0 1 ${innerNotchW + adj} ${innerEndY - innerRadius}
      V ${innerNotchBottomY - innerRadius + adj}
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerNotchW + innerRadius + adj} ${innerNotchBottomY + adj}
      H ${innerStartX + innerRadius}
      A ${innerRadius} ${innerRadius} 0 0 1 ${innerStartX} ${innerNotchBottomY - innerRadius + adj}
      V ${innerStartY + innerRadius}
      A ${innerRadius} ${innerRadius} 0 0 1 ${innerStartX + innerRadius} ${innerStartY}
      Z
    `;

    return (
      <g transform={outerTransform}>
        <defs>
          {/* Global gradient - only for inner square */}
          {isGlobalGradient && theme && (
            <linearGradient id={`gradient-l-${keycap.id}`} x1={theme.colors.direction === 'vertical' ? '0%' : '0%'} y1={theme.colors.direction === 'horizontal' ? '0%' : '0%'} x2={theme.colors.direction === 'vertical' ? '0%' : '100%'} y2={theme.colors.direction === 'horizontal' ? '100%' : '100%'}>
              <stop offset="0%" stopColor={theme.colors.start} />
              <stop offset="100%" stopColor={theme.colors.end} />
            </linearGradient>
          )}
        </defs>
        {/* Base path - always solid darker color, never gradient */}
        <path d={pathData} fill={baseColor} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />
        {/* Inner path - can be gradient or solid color */}
        <path d={innerPathData} fill={isGlobalGradient && theme ? `url(#gradient-l-${keycap.id})` : mainColor} />
        {(showBorder || selected) && (
          <path
            d={pathData}
            fill="none"
            stroke={borderColor}
            strokeWidth={2 / Math.max(0.0001, fitScale)}
            strokeOpacity={0.5}
          />
        )}
      </g>
    );
  };

  // Calculate L-shape inner path for clipPath - use the same inner path as render
  const getLShapeClipPath = () => {
    if (!lShapeDims) return null;
    
    const { translateX, translateY, fitScale, innerStartX, innerStartY, innerEndX, innerEndY, 
            innerNotchW, innerNotchBottomY, innerRadius, adj } = lShapeDims;
    
    // Use the exact same inner path as renderLShape, but transform coordinates to SVG space
    const clipPath = `
      M ${translateX + (innerStartX + innerRadius) * fitScale} ${translateY + innerStartY * fitScale}
      H ${translateX + (innerEndX - innerRadius) * fitScale}
      A ${innerRadius * fitScale} ${innerRadius * fitScale} 0 0 1 ${translateX + innerEndX * fitScale} ${translateY + (innerStartY + innerRadius) * fitScale}
      V ${translateY + (innerEndY - innerRadius) * fitScale}
      A ${innerRadius * fitScale} ${innerRadius * fitScale} 0 0 1 ${translateX + (innerEndX - innerRadius) * fitScale} ${translateY + innerEndY * fitScale}
      H ${translateX + Math.max(innerNotchW + innerRadius + adj, innerStartX + innerRadius) * fitScale}
      A ${innerRadius * fitScale} ${innerRadius * fitScale} 0 0 1 ${translateX + (innerNotchW + adj) * fitScale} ${translateY + (innerEndY - innerRadius) * fitScale}
      V ${translateY + (innerNotchBottomY - innerRadius + adj) * fitScale}
      A ${innerRadius * fitScale} ${innerRadius * fitScale} 0 0 0 ${translateX + (innerNotchW + innerRadius + adj) * fitScale} ${translateY + (innerNotchBottomY + adj) * fitScale}
      H ${translateX + (innerStartX + innerRadius) * fitScale}
      A ${innerRadius * fitScale} ${innerRadius * fitScale} 0 0 1 ${translateX + innerStartX * fitScale} ${translateY + (innerNotchBottomY - innerRadius + adj) * fitScale}
      V ${translateY + (innerStartY + innerRadius) * fitScale}
      A ${innerRadius * fitScale} ${innerRadius * fitScale} 0 0 1 ${translateX + (innerStartX + innerRadius) * fitScale} ${translateY + innerStartY * fitScale}
      Z
    `;
    return clipPath;
  };

  const lShapeClipPath = getLShapeClipPath();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} style={{ borderRadius: BORDER_RADIUS }}>
      <defs>
        {/* Global gradient definitions - only for inner square (mainColor) */}
        {isGlobalGradient && theme && (
          <linearGradient
            id={gradientId!}
            x1={theme.colors.direction === 'vertical' ? '0%' : '0%'}
            y1={theme.colors.direction === 'horizontal' ? '0%' : '0%'}
            x2={theme.colors.direction === 'vertical' ? '0%' : '100%'}
            y2={theme.colors.direction === 'horizontal' ? '100%' : '100%'}
          >
            <stop offset="0%" stopColor={theme.colors.start} />
            <stop offset="100%" stopColor={theme.colors.end} />
          </linearGradient>
        )}
        {keycap.layers?.map((layer, index) => (
          <clipPath key={`text-clip-${index}`} id={`text-clip-${keycap.id}-${index}`}>
            {shape === 'l-shape' && lShapeClipPath ? (
              <path d={lShapeClipPath} />
            ) : (
              <rect x={innerLeft} y={innerTop} width={innerWidth} height={innerHeight} rx={INNER_RADIUS} />
            )}
          </clipPath>
        ))}
      </defs>

      {shape === 'l-shape' ? renderLShape() : (
        <>
          {/* Base color - always darker, never gradient */}
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={BORDER_RADIUS}
            fill={baseColor}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={1}
          />
          {/* Inner square - can be gradient or solid color */}
          <rect
            x={innerLeft}
            y={innerTop}
            width={innerWidth}
            height={innerHeight}
            rx={INNER_RADIUS}
            fill={isGlobalGradient && gradientId ? `url(#${gradientId})` : mainColor}
          />
          {(showBorder || selected) && (
            <rect x={-2} y={-2} width={width + 4} height={height + 4} rx={BORDER_RADIUS + 2} fill="none" stroke={borderColor} strokeWidth={2} strokeOpacity={0.5} />
          )}
        </>
      )}

      {keycap.layers?.map((layer, index) => renderLayer(layer, index))}
    </svg>
  );
};

export default SVGKeycap;
