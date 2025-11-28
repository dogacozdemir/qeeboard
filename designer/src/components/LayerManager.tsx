import React, { useState } from 'react';
import { KeycapLayer } from '@/types/keyboard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ChevronUp, ChevronDown, ChevronRight, X, Plus, Type, Image, Palette } from 'lucide-react';
import { Separator } from './ui/separator';
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

interface LayerManagerProps {
  layers: KeycapLayer[];
  selectedLayerId: string | null;
  onLayerSelect: (layerId: string) => void;
  onLayerReorder?: (keyId: string, layerId: string, direction: 'up' | 'down') => void;
  onLayerDelete?: (keyId: string, layerId: string) => void;
  onAddTextLayer: () => void;
  onAddImageLayer: () => void;
  onAddIconLayer?: () => void;
  // Multi-selection props
  selectedKeys?: string[];
  editingKeyId?: string | null;
  isMultiSelection?: boolean;
  multiSelectionStats?: { text: number; icon: number; image: number } | null;
  selectedLayerIds?: string[];
  getKeyLayers?: (keyId: string) => KeycapLayer[];
  onSelectAllLayers?: () => void;
  onSelectTextLayers?: () => void;
  onSelectIconLayers?: () => void;
  onSelectImageLayers?: () => void;
  onLayerDoubleClick?: (layer: KeycapLayer) => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerReorder,
  onLayerDelete,
  onAddTextLayer,
  onAddImageLayer,
  onAddIconLayer,
  selectedKeys = [],
  editingKeyId = null,
  isMultiSelection = false,
  multiSelectionStats = null,
  selectedLayerIds = [],
  getKeyLayers,
  onSelectAllLayers,
  onSelectTextLayers,
  onSelectIconLayers,
  onSelectImageLayers,
  onLayerDoubleClick,
}) => {
  // Helper function to get the keyId for a layer
  const getKeyIdForLayer = (layerId: string): string | null => {
    // First try editingKeyId (single selection)
    if (editingKeyId) {
      if (getKeyLayers) {
        const layers = getKeyLayers(editingKeyId);
        if (layers.some(l => l.id === layerId)) {
          return editingKeyId;
        }
      }
    }
    // Then try selectedKeys (multi-selection or single selection fallback)
    if (selectedKeys.length > 0) {
      if (getKeyLayers) {
        for (const keyId of selectedKeys) {
          const keyLayers = getKeyLayers(keyId);
          if (keyLayers.some(l => l.id === layerId)) {
            return keyId;
          }
        }
      }
      // Fallback: use first selected key
      return selectedKeys[0];
    }
    return null;
  };
  // Expand/collapse state for each category
  const [expandedCategories, setExpandedCategories] = useState<{
    text: boolean;
    icon: boolean;
    image: boolean;
  }>({
    text: false,
    icon: false,
    image: false,
  });

  // Helper function to toggle category expansion
  const toggleCategory = (category: 'text' | 'icon' | 'image', e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Helper function to get all layers of a specific type from selected keys
  const getLayersByType = (type: 'text' | 'icon' | 'image'): KeycapLayer[] => {
    if (!getKeyLayers || selectedKeys.length === 0) return [];
    
    const allLayers: KeycapLayer[] = [];
    selectedKeys.forEach(keyId => {
      const keyLayers = getKeyLayers(keyId);
      keyLayers.forEach(layer => {
        if (layer.type === type) {
          allLayers.push(layer);
        }
      });
    });
    return allLayers;
  };

  // Helper function to get all layers from the first selected key (for reorder/delete operations)
  const getAllLayersFromFirstKey = (): KeycapLayer[] => {
    // If layers prop is provided (normal view), use it
    if (layers.length > 0) {
      return layers;
    }
    // Otherwise, get from selected key
    if (!getKeyLayers || selectedKeys.length === 0) return [];
    // Use editingKeyId if available (single selection), otherwise use first selected key
    const keyId = editingKeyId || selectedKeys[0];
    return getKeyLayers(keyId);
  };

  // Helper function to get the global index of a layer (across all layer types)
  const getGlobalLayerIndex = (layerId: string): number => {
    const allLayers = getAllLayersFromFirstKey();
    return allLayers.findIndex(l => l.id === layerId);
  };

  // Helper function to handle individual layer selection
  const handleLayerClick = (layerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Select only this specific layer
    onLayerSelect(layerId);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3 mb-3">
        <h3 className="font-semibold text-sm text-center">Components & Layers</h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={onAddTextLayer}
            title="Add text layer"
          >
            <Type className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddImageLayer}
            title="Add image layer"
          >
            <Image className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onAddIconLayer}
            title="Add icon layer"
          >
            <Palette className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Separator className="mb-3" />

      {(isMultiSelection || (selectedKeys && selectedKeys.length === 1)) && multiSelectionStats ? (
        <div className="space-y-2">
          <div 
            className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
              selectedLayerIds.length > 0 && getKeyLayers && selectedLayerIds.length === (() => {
                let total = 0;
                selectedKeys.forEach(keyId => {
                  const keyLayers = getKeyLayers(keyId);
                  total += keyLayers.length;
                });
                return total;
              })()
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-accent/50'
            }`}
            onClick={onSelectAllLayers}
          >
            <div className="flex-1">
              <span className="text-sm font-medium">Keycaps ({selectedKeys.length}x)</span>
            </div>
          </div>
          {multiSelectionStats.text > 0 && (
            <div>
              <div 
                className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                  (selectedLayerIds.length > 0 && getKeyLayers && (
                    // All text layers selected
                    (selectedLayerIds.every(id => {
                      return selectedKeys.some(keyId => {
                        const layers = getKeyLayers(keyId);
                        const layer = layers.find(l => l.id === id);
                        return layer?.type === 'text';
                      });
                    }) && selectedLayerIds.length === multiSelectionStats.text) ||
                    // Or at least one text layer is selected (partial selection)
                    selectedLayerIds.some(id => {
                      return selectedKeys.some(keyId => {
                        const layers = getKeyLayers(keyId);
                        const layer = layers.find(l => l.id === id);
                        return layer?.type === 'text';
                      });
                    })
                  ))
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent/50'
                }`}
                onClick={onSelectTextLayers}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 flex-shrink-0"
                  onClick={(e) => toggleCategory('text', e)}
                >
                  {expandedCategories.text ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                <Type className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Text ({multiSelectionStats.text}x)</span>
              </div>
              {expandedCategories.text && (
                <div className="ml-8 mt-1 space-y-1">
                  {getLayersByType('text').map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`flex items-center gap-2 p-2 rounded border ${
                        selectedLayerId === layer.id || selectedLayerIds.includes(layer.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/50'
                      } cursor-pointer transition-colors`}
                      onClick={(e) => handleLayerClick(layer.id, e)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (onLayerDoubleClick) {
                          onLayerDoubleClick(layer);
                        }
                      }}
                    >
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <Type className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {layer.content || 'Empty text'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keyId = getKeyIdForLayer(layer.id);
                            if (keyId && onLayerReorder) {
                              onLayerReorder(keyId, layer.id, 'up');
                            }
                          }}
                          disabled={getGlobalLayerIndex(layer.id) === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keyId = getKeyIdForLayer(layer.id);
                            if (keyId && onLayerReorder) {
                              onLayerReorder(keyId, layer.id, 'down');
                            }
                          }}
                          disabled={getGlobalLayerIndex(layer.id) === getAllLayersFromFirstKey().length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keyId = getKeyIdForLayer(layer.id);
                            if (keyId && onLayerDelete) {
                              onLayerDelete(keyId, layer.id);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {multiSelectionStats.icon > 0 && (
            <div>
              <div 
                className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                  (selectedLayerIds.length > 0 && getKeyLayers && (
                    // All icon layers selected
                    (selectedLayerIds.every(id => {
                      return selectedKeys.some(keyId => {
                        const layers = getKeyLayers(keyId);
                        const layer = layers.find(l => l.id === id);
                        return layer?.type === 'icon';
                      });
                    }) && selectedLayerIds.length === multiSelectionStats.icon) ||
                    // Or at least one icon layer is selected (partial selection)
                    selectedLayerIds.some(id => {
                      return selectedKeys.some(keyId => {
                        const layers = getKeyLayers(keyId);
                        const layer = layers.find(l => l.id === id);
                        return layer?.type === 'icon';
                      });
                    })
                  ))
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent/50'
                }`}
                onClick={onSelectIconLayers}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 flex-shrink-0"
                  onClick={(e) => toggleCategory('icon', e)}
                >
                  {expandedCategories.icon ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                <Palette className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Icon ({multiSelectionStats.icon}x)</span>
              </div>
              {expandedCategories.icon && (
                <div className="ml-8 mt-1 space-y-1">
                  {getLayersByType('icon').map((layer, index) => {
                    let iconName = typeof layer.content === 'string' ? layer.content : '';
                    if (iconName.includes(':')) {
                      iconName = iconName.split(':')[1];
                    }
                    const iconData = iconMap[iconName];
                    return (
                      <div
                        key={layer.id}
                        className={`flex items-center gap-2 p-2 rounded border ${
                          selectedLayerId === layer.id || selectedLayerIds.includes(layer.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-accent/50'
                        } cursor-pointer transition-colors`}
                        onClick={(e) => handleLayerClick(layer.id, e)}
                      >
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                          <Palette className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate flex items-center gap-2">
                            {iconData ? (
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon 
                                  icon={iconData} 
                                  className="w-3 h-3"
                                  style={{ color: layer.color }}
                                />
                                <span>Icon: {iconName}</span>
                              </div>
                            ) : (
                              `Icon: ${iconName || 'Icon'}`
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const keyId = getKeyIdForLayer(layer.id);
                              if (keyId && onLayerReorder) {
                                onLayerReorder(keyId, layer.id, 'up');
                              }
                            }}
                            disabled={getGlobalLayerIndex(layer.id) === 0}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const keyId = getKeyIdForLayer(layer.id);
                              if (keyId && onLayerReorder) {
                                onLayerReorder(keyId, layer.id, 'down');
                              }
                            }}
                            disabled={getGlobalLayerIndex(layer.id) === getAllLayersFromFirstKey().length - 1}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              const keyId = getKeyIdForLayer(layer.id);
                              if (keyId && onLayerDelete) {
                                onLayerDelete(keyId, layer.id);
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {multiSelectionStats.image > 0 && (
            <div>
              <div 
                className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                  (selectedLayerIds.length > 0 && getKeyLayers && (
                    // All image layers selected
                    (selectedLayerIds.every(id => {
                      return selectedKeys.some(keyId => {
                        const layers = getKeyLayers(keyId);
                        const layer = layers.find(l => l.id === id);
                        return layer?.type === 'image';
                      });
                    }) && selectedLayerIds.length === multiSelectionStats.image) ||
                    // Or at least one image layer is selected (partial selection)
                    selectedLayerIds.some(id => {
                      return selectedKeys.some(keyId => {
                        const layers = getKeyLayers(keyId);
                        const layer = layers.find(l => l.id === id);
                        return layer?.type === 'image';
                      });
                    })
                  ))
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent/50'
                }`}
                onClick={onSelectImageLayers}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 flex-shrink-0"
                  onClick={(e) => toggleCategory('image', e)}
                >
                  {expandedCategories.image ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                <Image className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Image ({multiSelectionStats.image}x)</span>
              </div>
              {expandedCategories.image && (
                <div className="ml-8 mt-1 space-y-1">
                  {getLayersByType('image').map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`flex items-center gap-2 p-2 rounded border ${
                        selectedLayerId === layer.id || selectedLayerIds.includes(layer.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent/50'
                      } cursor-pointer transition-colors`}
                      onClick={(e) => handleLayerClick(layer.id, e)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (onLayerDoubleClick) {
                          onLayerDoubleClick(layer);
                        }
                      }}
                    >
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <Image className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">Image</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keyId = getKeyIdForLayer(layer.id);
                            if (keyId && onLayerReorder) {
                              onLayerReorder(keyId, layer.id, 'up');
                            }
                          }}
                          disabled={getGlobalLayerIndex(layer.id) === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keyId = getKeyIdForLayer(layer.id);
                            if (keyId && onLayerReorder) {
                              onLayerReorder(keyId, layer.id, 'down');
                            }
                          }}
                          disabled={getGlobalLayerIndex(layer.id) === getAllLayersFromFirstKey().length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            const keyId = getKeyIdForLayer(layer.id);
                            if (keyId && onLayerDelete) {
                              onLayerDelete(keyId, layer.id);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : layers.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No layers yet. Click + to add one.
        </p>
      ) : (
        <div className="space-y-2">
          {layers.map((layer, index) => (
            <div
              key={layer.id}
              className={`flex items-center gap-2 p-2 rounded border ${
                selectedLayerId === layer.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              } cursor-pointer transition-colors`}
              onClick={() => onLayerSelect(layer.id)}
            >
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {layer.type === 'text' ? (
                  <Type className="h-4 w-4 flex-shrink-0" />
                ) : layer.type === 'image' ? (
                  <Image className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Palette className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm truncate flex items-center gap-2">
                  {layer.type === 'text'
                    ? (layer.content || 'Empty text')
                    : layer.type === 'image'
                    ? 'Image'
                  : layer.type === 'icon' && typeof layer.content === 'string' && layer.content.trim() !== ''
                    ? (() => {
                        // Handle both "iconName" and "type:iconName" formats
                    let iconName = layer.content as string;
                    if (iconName.includes(':')) {
                          iconName = iconName.split(':')[1]; // Extract name from "type:name"
                        }
                        const iconData = iconMap[iconName];
                        
                        if (iconData) {
                          return (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon 
                                icon={iconData} 
                                className="w-3 h-3"
                                style={{ color: layer.color }}
                              />
                              <span>Icon: {iconName}</span>
                            </div>
                          );
                        }
                        return `Icon: ${iconName}`;
                      })()
                    : 'Icon'}
                </span>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    const keyId = getKeyIdForLayer(layer.id);
                    if (keyId && onLayerReorder) {
                      onLayerReorder(keyId, layer.id, 'up');
                    }
                  }}
                  disabled={getGlobalLayerIndex(layer.id) === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    const keyId = getKeyIdForLayer(layer.id);
                    if (keyId && onLayerReorder) {
                      onLayerReorder(keyId, layer.id, 'down');
                    }
                  }}
                  disabled={getGlobalLayerIndex(layer.id) === getAllLayersFromFirstKey().length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    const keyId = getKeyIdForLayer(layer.id);
                    if (keyId && onLayerDelete) {
                      onLayerDelete(keyId, layer.id);
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default LayerManager;
