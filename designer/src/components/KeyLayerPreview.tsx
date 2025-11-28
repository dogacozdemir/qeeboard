import React, { useEffect, useRef, useState } from 'react';
import { KeycapLayer } from '@/types/keyboard';
import { Plus, Type, Image, Palette } from 'lucide-react';
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

// Icon mapping for FontAwesome icons
const iconMap: Record<string, any> = {
  // Basic icons
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
  // Additional icons from IconPicker
  'bars': faBars, 'ellipsis-h': faEllipsisH, 'ellipsis-v': faEllipsisV, 'thumbs-up': faThumbsUp, 'thumbs-down': faThumbsDown, 'smile': faSmile, 'frown': faFrown, 'meh': faMeh,
  'fire': faFire, 'bolt': faBolt, 'zap': faZap, 'shield-alt': faShieldAlt, 'flag': faFlag, 'flag-checkered': faFlagCheckered,
  'rocket': faRocket, 'plane': faPlane, 'car': faCar, 'bicycle': faBicycle, 'bus': faBus, 'train': faTrain, 'ship': faShip, 'helicopter': faHelicopter,
  'building': faBuilding, 'store': faStore, 'hospital': faHospital, 'school': faSchool, 'university': faUniversity, 'church': faChurch, 'mosque': faMosque,
  'coffee': faCoffee, 'utensils': faUtensils, 'pizza-slice': faPizzaSlice, 'hamburger': faHamburger, 'ice-cream': faIceCream, 'cookie': faCookie, 'cake': faCake,
  'music': faMusic, 'headphones': faHeadphones, 'mic': faMic, 'radio': faRadio, 'tv': faTv, 'camera': faCamera, 'video': faVideo,
  'book': faBook, 'book-open': faBookOpen, 'newspaper': faNewspaper, 'scroll': faScroll, 'pen': faPen, 'pencil': faPencil, 'pencil-alt': faPencilAlt,
  'paint-brush': faPaintBrush, 'palette': faPalette, 'eraser': faEraser, 'highlighter': faHighlighter, 'marker': faMarker, 'stamp': faStamp,
  'globe': faGlobe, 'globe-americas': faGlobeAmericas, 'globe-europe': faGlobeEurope, 'globe-asia': faGlobeAsia, 'map': faMap, 'map-pin': faMapPin,
  'compass': faCompass, 'route': faRoute, 'road': faRoad, 'sign': faSign, 'traffic-light': faTrafficLight, 'parking': faParking,
  'tree': faTree, 'leaf': faLeaf, 'seedling': faSeedling, 'bug': faBug, 'spider': faSpider, 'fish': faFish,
  'cat': faCat, 'dog': faDog, 'horse': faHorse, 'paw': faPaw, 'frog': faFrog, 'dove': faDove, 'crow': faCrow, 'otter': faOtter,
  'gem': faGem, 'diamond': faDiamond, 'crown': faCrown, 'ring': faRing, 'glasses': faGlasses,
  'hat-cowboy': faHatCowboy, 'hat-wizard': faHatWizard, 'mask': faMask, 'theater-masks': faTheaterMasks, 'vest': faVest, 'shirt': faShirt,
  'dice': faDice, 'dice-one': faDiceOne, 'dice-two': faDiceTwo, 'dice-three': faDiceThree, 'dice-four': faDiceFour, 'dice-five': faDiceFive, 'dice-six': faDiceSix,
  'chess': faChess, 'chess-king': faChessKing, 'chess-queen': faChessQueen, 'chess-rook': faChessRook, 'chess-bishop': faChessBishop, 'chess-knight': faChessKnight, 'chess-pawn': faChessPawn,
  'puzzle-piece': faPuzzlePiece, 'cube': faCube, 'cubes': faCubes, 'box': faBox, 'boxes': faBoxes, 'present': faPresent,
  'tag': faTag, 'tags': faTags, 'ticket-alt': faTicketAlt, 'qrcode': faQrcode, 'barcode': faBarcode, 'receipt': faReceipt, 'money-bill': faMoneyBill,
  'coins': faCoins, 'dollar-sign': faDollarSign, 'euro-sign': faEuroSign, 'pound-sign': faPoundSign, 'yen-sign': faYenSign, 'won-sign': faWonSign,
  'calculator': faCalculator, 'ruler': faRuler, 'ruler-combined': faRulerCombined, 'ruler-horizontal': faRulerHorizontal, 'ruler-vertical': faRulerVertical,
  'weight': faWeight, 'balance-scale': faBalanceScale, 'thermometer-half': faThermometerHalf, 'thermometer-full': faThermometerFull, 'thermometer-empty': faThermometerEmpty,
  'stopwatch': faStopwatch, 'hourglass': faHourglass, 'hourglass-half': faHourglassHalf, 'hourglass-start': faHourglassStart, 'hourglass-end': faHourglassEnd,
  'bell': faBell, 'bell-slash': faBellSlash, 'alarm-clock': faAlarmClock, 'bed': faBed, 'toilet': faToilet, 'shower': faShower, 'bath': faBath,
  'tooth': faTooth, 'pills': faPills, 'syringe': faSyringe, 'band-aid': faBandAid, 'stethoscope': faStethoscope, 'heartbeat': faHeartbeat,
  'running': faRunning, 'walking': faWalking, 'hiking': faHiking, 'swimmer': faSwimmer, 'basketball-ball': faBasketballBall, 'football': faFootball, 'baseball': faBaseball,
  'soccer-ball': faSoccerBall, 'volleyball-ball': faVolleyballBall, 'golf-ball': faGolfBall, 'bowling-ball': faBowlingBall, 'hockey-puck': faHockeyPuck,
  'skating': faSkating, 'skiing': faSkiing, 'snowboarding': faSnowboarding,
  'tent': faTent, 'suitcase': faSuitcase, 'suitcase-rolling': faSuitcaseRolling,
  'passport': faPassport, 'id-card': faIdCard, 'id-badge': faIdBadge, 'card': faCard, 'wallet': faWallet,
  'handshake': faHandshake, 'hands': faHands, 'hands-helping': faHandsHelping, 'hands-wash': faHandsWash, 'hand-holding': faHandHolding, 'hand-holding-heart': faHandHoldingHeart,
  'thumbtack': faThumbtack, 'paperclip': faPaperclip, 'clipboard': faClipboard, 'clipboard-list': faClipboardList, 'clipboard-check': faClipboardCheck,
  'sticky-note': faStickyNote, 'note-sticky': faNoteSticky,
  'bookmark-solid': faBookmarkSolid,
  'ribbon': faRibbon, 'award': faAward, 'medal': faMedal, 'trophy-solid': faTrophySolid,
  'wine-glass': faWineGlass, 'wine-glass-alt': faWineGlassAlt, 'beer': faBeer, 'cocktail': faCocktail,
  'utensil-spoon': faUtensilSpoon,
  'blender': faBlender, 'blender-phone': faBlenderPhone,
  'broom': faBroom, 'spray-can': faSprayCan, 'soap': faSoap,
  'toilet-paper': faToiletPaper, 'paper-plane': faPaperPlane, 'plane-departure': faPlaneDeparture, 'plane-arrival': faPlaneArrival,
  'parachute-box': faParachuteBox, 'satellite': faSatellite, 'satellite-dish': faSatelliteDish, 'space-shuttle': faSpaceShuttle,
  'robot': faRobot, 'feather': faFeather, 'feather-alt': faFeatherAlt,
  'peace': faPeace, 'om': faOm, 'yin-yang': faYinYang,
  
  // Regular icons
  'heart-regular': faHeartRegular, 'star-regular': faStarRegular, 'bookmark-regular': faBookmarkRegular,
  'user-regular': faUserRegular, 'envelope-regular': faEnvelopeRegular, 'file-regular': faFileRegular,
  'folder-regular': faFolderRegular, 'image-regular': faImageRegular,
  
  // Brand icons
  'github': faGithub, 'twitter': faTwitter, 'facebook': faFacebook, 'instagram': faInstagram, 'linkedin': faLinkedin,
  'youtube': faYoutube, 'discord': faDiscord, 'steam': faSteam, 'spotify': faSpotify, 'apple': faApple,
  'google': faGoogle, 'microsoft': faMicrosoft, 'amazon': faAmazon, 'paypal': faPaypal
};

interface KeyLayerPreviewProps {
  layers: KeycapLayer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onClose?: () => void;
  onAddTextLayer?: () => void;
  onAddImageLayer?: () => void;
  onAddIconLayer?: () => void;
  onLayerTypeChange?: (layerId: string, newType: 'text' | 'image' | 'icon') => void;
  onOpenToolbarSection?: (section: 'text' | 'icon' | 'image') => void;
  keyPosition: { x: number; y: number; width: number; height: number };
  unit: number;
  padding: number;
}

const KeyLayerPreview: React.FC<KeyLayerPreviewProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onClose,
  onAddTextLayer,
  onAddImageLayer,
  onAddIconLayer,
  onLayerTypeChange,
  onOpenToolbarSection,
  keyPosition,
  unit,
  padding,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [layerMenuOpen, setLayerMenuOpen] = useState<string | null>(null);

  // Click-outside effect to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        onClose?.();
        setShowAddMenu(false);
        setLayerMenuOpen(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Always show the preview if there are layers OR if we have add layer handlers (to show the + button)
  // If no layers and no add handlers, don't show anything
  if (layers.length === 0 && (!onAddTextLayer && !onAddImageLayer && !onAddIconLayer)) return null;

  // Position relative to key center
  const keyCenterX = keyPosition.x + keyPosition.width / 2;
  const keyCenterY = keyPosition.y + keyPosition.height / 2;
  const previewY = keyCenterY - 52;

  return (
    <div
      ref={previewRef}
      className="absolute pointer-events-auto z-50"
      style={{
        left: keyCenterX,
        top: previewY,
        transform: 'translate(-50%, -50%)',
        transformOrigin: 'center center',
      }}
    >
      <div className="bg-card/25 backdrop-blur-sm border border-border rounded-lg shadow-elevated p-2 flex gap-1.5 items-center">
        {layers.length > 0 && layers.map((layer) => (
          <div key={layer.id} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (layerMenuOpen === layer.id) {
                  setLayerMenuOpen(null);
                } else {
                  setLayerMenuOpen(layer.id);
                  setShowAddMenu(false);
                  onLayerSelect(layer.id);
                }
              }}
              className={`
                w-7 h-7 rounded-full border border-border flex items-center justify-center
                transition-all duration-200 hover:scale-105 hover:shadow-sm
                ${selectedLayerId === layer.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-card-foreground hover:bg-muted hover:border-primary/50'
                }
              `}
            >
            {layer.type === 'image' && layer.content?.trim() !== '' ? (
              <img
                src={layer.content}
                alt="layer"
                className="w-5 h-5 object-contain rounded-full"
              />
            ) : layer.type === 'icon' && typeof layer.content === 'string' && layer.content.trim() !== '' ? (
              (() => {
                // Handle both "iconName" and "type:iconName" formats
                let iconName = layer.content as string;
                if (iconName.includes(':')) {
                  iconName = iconName.split(':')[1]; // Extract name from "type:name"
                }
                const iconData = iconMap[iconName];
                
                if (iconData) {
                  return (
                    <FontAwesomeIcon 
                      icon={iconData} 
                      className="w-4 h-4"
                      style={{ color: layer.color }}
                    />
                  );
                }
                return <span className="text-xs">?</span>;
              })()
            ) : (
              <span
                className="text-xs font-medium"
                style={{
                  fontFamily: layer.font,
                  fontSize: '10px',
                  fontWeight: layer.bold ? 'bold' : 'normal',
                  fontStyle: layer.italic ? 'italic' : 'normal',
                  textDecoration: layer.underline ? 'underline' : 'none',
                }}
              >
                {layer.content || '?'}
              </span>
            )}
            </button>
            
            {/* Layer Type Change Menu */}
            {layerMenuOpen === layer.id && onLayerTypeChange && (
              <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-md shadow-elevated p-1 flex gap-1 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerTypeChange?.(layer.id, 'text');
                    onOpenToolbarSection?.('text');
                    setLayerMenuOpen(null);
                  }}
                  className={`w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    layer.type === 'text' ? 'bg-primary/20 border-primary' : ''
                  }`}
                  title="Change to Text"
                >
                  <Type className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerTypeChange?.(layer.id, 'image');
                    onOpenToolbarSection?.('image');
                    setLayerMenuOpen(null);
                  }}
                  className={`w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    layer.type === 'image' ? 'bg-primary/20 border-primary' : ''
                  }`}
                  title="Change to Image"
                >
                  <Image className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerTypeChange?.(layer.id, 'icon');
                    onOpenToolbarSection?.('icon');
                    setLayerMenuOpen(null);
                  }}
                  className={`w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    layer.type === 'icon' ? 'bg-primary/20 border-primary' : ''
                  }`}
                  title="Change to Icon"
                >
                  <Palette className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
        
        {/* Add Layer Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="w-7 h-7 rounded-full border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-sm"
          >
            <Plus className="w-3 h-3" />
          </button>
          
          {/* Add Layer Menu */}
          {showAddMenu && (
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-md shadow-elevated p-1 flex gap-1 z-50">
              <button
                onClick={() => {
                  onAddTextLayer?.();
                  onOpenToolbarSection?.('text');
                  setShowAddMenu(false);
                }}
                className="w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Add Text Layer"
              >
                <Type className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  onAddImageLayer?.();
                  onOpenToolbarSection?.('image');
                  setShowAddMenu(false);
                }}
                className="w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Add Image Layer"
              >
                <Image className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  onAddIconLayer?.();
                  onOpenToolbarSection?.('icon');
                  setShowAddMenu(false);
                }}
                className="w-6 h-6 rounded border border-border bg-card text-card-foreground hover:bg-muted hover:border-primary/50 flex items-center justify-center transition-all duration-200 hover:scale-105"
                title="Add Icon Layer"
              >
                <Palette className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyLayerPreview;
