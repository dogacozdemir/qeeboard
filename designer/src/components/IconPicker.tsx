import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faTimes,
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
  // Additional solid icons
  faBars, faEllipsisH, faEllipsisV, faThumbsUp, faThumbsDown, faSmile, faFrown, faMeh,
  faFire, faBolt, faZap, faShield, faShieldAlt, faFlag, faFlagCheckered,
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
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
// Tabs removed; single searchable grid is used
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface IconPickerProps {
  onIconSelect: (iconName: string, iconType?: 'solid' | 'regular' | 'brand') => void;
  onClose: () => void;
  currentIcon?: string;
  variant?: 'modal' | 'dropdown';
}

const iconCategories = {
  'General': [
    { name: 'home', icon: faHome, type: 'solid' as const },
    { name: 'user', icon: faUser, type: 'solid' as const },
    { name: 'cog', icon: faCog, type: 'solid' as const },
    { name: 'heart', icon: faHeart, type: 'solid' as const },
    { name: 'star', icon: faStar, type: 'solid' as const },
    { name: 'play', icon: faPlay, type: 'solid' as const },
    { name: 'pause', icon: faPause, type: 'solid' as const },
    { name: 'stop', icon: faStop, type: 'solid' as const },
    { name: 'fire', icon: faFire, type: 'solid' as const },
    { name: 'bolt', icon: faBolt, type: 'solid' as const },
    { name: 'zap', icon: faZap, type: 'solid' as const },
    { name: 'shield', icon: faShield, type: 'solid' as const },
    { name: 'flag', icon: faFlag, type: 'solid' as const },
    { name: 'thumbs-up', icon: faThumbsUp, type: 'solid' as const },
    { name: 'thumbs-down', icon: faThumbsDown, type: 'solid' as const },
    { name: 'smile', icon: faSmile, type: 'solid' as const },
    { name: 'frown', icon: faFrown, type: 'solid' as const },
    { name: 'meh', icon: faMeh, type: 'solid' as const },
    // Regular variants
    { name: 'heart-regular', icon: faHeartRegular, type: 'regular' as const },
    { name: 'star-regular', icon: faStarRegular, type: 'regular' as const },
    { name: 'bookmark-regular', icon: faBookmarkRegular, type: 'regular' as const },
    { name: 'user-regular', icon: faUserRegular, type: 'regular' as const },
    { name: 'envelope-regular', icon: faEnvelopeRegular, type: 'regular' as const },
    { name: 'file-regular', icon: faFileRegular, type: 'regular' as const },
    { name: 'folder-regular', icon: faFolderRegular, type: 'regular' as const },
    { name: 'image-regular', icon: faImageRegular, type: 'regular' as const },
  ],
  'Editing': [
    { name: 'edit', icon: faEdit, type: 'solid' as const },
    { name: 'trash', icon: faTrash, type: 'solid' as const },
    { name: 'save', icon: faSave, type: 'solid' as const },
    { name: 'download', icon: faDownload, type: 'solid' as const },
    { name: 'upload', icon: faUpload, type: 'solid' as const },
    { name: 'copy', icon: faCopy, type: 'solid' as const },
    { name: 'cut', icon: faCut, type: 'solid' as const },
    { name: 'paste', icon: faPaste, type: 'solid' as const },
    { name: 'pen', icon: faPen, type: 'solid' as const },
    { name: 'pencil', icon: faPencil, type: 'solid' as const },
    { name: 'pencil-alt', icon: faPencilAlt, type: 'solid' as const },
    { name: 'paint-brush', icon: faPaintBrush, type: 'solid' as const },
    { name: 'palette', icon: faPalette, type: 'solid' as const },
    { name: 'eraser', icon: faEraser, type: 'solid' as const },
    { name: 'highlighter', icon: faHighlighter, type: 'solid' as const },
    { name: 'marker', icon: faMarker, type: 'solid' as const },
    { name: 'stamp', icon: faStamp, type: 'solid' as const },
  ],
  'Text': [
    { name: 'bold', icon: faBold, type: 'solid' as const },
    { name: 'italic', icon: faItalic, type: 'solid' as const },
    { name: 'underline', icon: faUnderline, type: 'solid' as const },
    { name: 'align-left', icon: faAlignLeft, type: 'solid' as const },
    { name: 'align-center', icon: faAlignCenter, type: 'solid' as const },
    { name: 'align-right', icon: faAlignRight, type: 'solid' as const },
  ],
  'Math': [
    { name: 'plus', icon: faPlus, type: 'solid' as const },
    { name: 'minus', icon: faMinus, type: 'solid' as const },
    { name: 'multiply', icon: faMultiply, type: 'solid' as const },
    { name: 'divide', icon: faDivide, type: 'solid' as const },
    { name: 'equals', icon: faEquals, type: 'solid' as const },
  ],
  'Arrows': [
    { name: 'arrow-up', icon: faArrowUp, type: 'solid' as const },
    { name: 'arrow-down', icon: faArrowDown, type: 'solid' as const },
    { name: 'arrow-left', icon: faArrowLeft, type: 'solid' as const },
    { name: 'arrow-right', icon: faArrowRight, type: 'solid' as const },
    { name: 'chevron-up', icon: faChevronUp, type: 'solid' as const },
    { name: 'chevron-down', icon: faChevronDown, type: 'solid' as const },
    { name: 'chevron-left', icon: faChevronLeft, type: 'solid' as const },
    { name: 'chevron-right', icon: faChevronRight, type: 'solid' as const },
  ],
  'Status': [
    { name: 'check', icon: faCheck, type: 'solid' as const },
    { name: 'x', icon: faX, type: 'solid' as const },
    { name: 'question', icon: faQuestion, type: 'solid' as const },
    { name: 'exclamation', icon: faExclamation, type: 'solid' as const },
  ],
  'Security': [
    { name: 'lock', icon: faLock, type: 'solid' as const },
    { name: 'unlock', icon: faUnlock, type: 'solid' as const },
    { name: 'eye', icon: faEye, type: 'solid' as const },
    { name: 'eye-slash', icon: faEyeSlash, type: 'solid' as const },
    { name: 'key', icon: faKey, type: 'solid' as const },
  ],
  'Communication': [
    { name: 'phone', icon: faPhone, type: 'solid' as const },
    { name: 'envelope', icon: faEnvelope, type: 'solid' as const },
    { name: 'calendar', icon: faCalendar, type: 'solid' as const },
    { name: 'clock', icon: faClock, type: 'solid' as const },
    { name: 'map-marker', icon: faMapMarker, type: 'solid' as const },
  ],
  'Media': [
    { name: 'image', icon: faImage, type: 'solid' as const },
    { name: 'file', icon: faFile, type: 'solid' as const },
    { name: 'folder', icon: faFolder, type: 'solid' as const },
    { name: 'link', icon: faLink, type: 'solid' as const },
    { name: 'external-link-alt', icon: faExternalLinkAlt, type: 'solid' as const },
  ],
  'Audio': [
    { name: 'volume-up', icon: faVolumeUp, type: 'solid' as const },
    { name: 'volume-down', icon: faVolumeDown, type: 'solid' as const },
    { name: 'volume-mute', icon: faVolumeMute, type: 'solid' as const },
    { name: 'microphone', icon: faMicrophone, type: 'solid' as const },
    { name: 'microphone-slash', icon: faMicrophoneSlash, type: 'solid' as const },
  ],
  'Tech': [
    { name: 'wifi', icon: faWifi, type: 'solid' as const },
    { name: 'battery-full', icon: faBatteryFull, type: 'solid' as const },
    { name: 'battery-half', icon: faBatteryHalf, type: 'solid' as const },
    { name: 'battery-empty', icon: faBatteryEmpty, type: 'solid' as const },
  ],
  'Weather': [
    { name: 'sun', icon: faSun, type: 'solid' as const },
    { name: 'moon', icon: faMoon, type: 'solid' as const },
    { name: 'cloud', icon: faCloud, type: 'solid' as const },
    { name: 'cloud-rain', icon: faCloudRain, type: 'solid' as const },
    { name: 'snowflake', icon: faSnowflake, type: 'solid' as const },
  ],
  'Gaming': [
    { name: 'gamepad', icon: faGamepad, type: 'solid' as const },
    { name: 'trophy', icon: faTrophy, type: 'solid' as const },
    { name: 'gift', icon: faGift, type: 'solid' as const },
    { name: 'shopping-cart', icon: faShoppingCart, type: 'solid' as const },
    { name: 'credit-card', icon: faCreditCard, type: 'solid' as const },
  ],
  'Brands': [
    { name: 'github', icon: faGithub, type: 'brand' as const },
    { name: 'twitter', icon: faTwitter, type: 'brand' as const },
    { name: 'facebook', icon: faFacebook, type: 'brand' as const },
    { name: 'instagram', icon: faInstagram, type: 'brand' as const },
    { name: 'linkedin', icon: faLinkedin, type: 'brand' as const },
    { name: 'youtube', icon: faYoutube, type: 'brand' as const },
    { name: 'discord', icon: faDiscord, type: 'brand' as const },
    { name: 'steam', icon: faSteam, type: 'brand' as const },
    { name: 'spotify', icon: faSpotify, type: 'brand' as const },
    { name: 'apple', icon: faApple, type: 'brand' as const },
    { name: 'google', icon: faGoogle, type: 'brand' as const },
    { name: 'microsoft', icon: faMicrosoft, type: 'brand' as const },
    { name: 'amazon', icon: faAmazon, type: 'brand' as const },
    { name: 'paypal', icon: faPaypal, type: 'brand' as const },
  ]
};

export const IconPicker: React.FC<IconPickerProps> = ({ onIconSelect, onClose, currentIcon, variant = 'dropdown' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [styleFilter, setStyleFilter] = useState<'all' | 'solid' | 'regular' | 'brand'>('all');

  const filteredIcons = useMemo(() => {
    const allIcons = Object.values(iconCategories).flat();
    return allIcons.filter(icon => {
      const matchesText = icon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = styleFilter === 'all' ? true : icon.type === styleFilter;
      return matchesText && matchesStyle;
    });
  }, [searchTerm, styleFilter]);

  const handleIconClick = (iconName: string, iconType: 'solid' | 'regular' | 'brand') => {
    onIconSelect(iconName, iconType);
    onClose();
  };

  if (variant === 'dropdown') {
    return (
      <div className="w-[720px] max-h-[70vh] overflow-hidden rounded-md bg-card text-card-foreground border border-border shadow-elevated flex flex-col">
        {/* Top Controls: Search + Style Dropdown */}
        <div className="p-2 border-b border-border flex items-center gap-2">
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-sm bg-background border-border text-foreground"
            />
          </div>
          <Select value={styleFilter} onValueChange={(v) => setStyleFilter(v as any)}>
            <SelectTrigger className="w-40 h-8 text-xs bg-background border-border text-foreground">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
              <SelectItem value="all" className="text-xs">All styles</SelectItem>
              <SelectItem value="solid" className="text-xs">Solid</SelectItem>
              <SelectItem value="regular" className="text-xs">Regular</SelectItem>
              <SelectItem value="brand" className="text-xs">Brand</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="grid grid-cols-8 gap-2 max-h-[56vh]">
              {filteredIcons.map((iconData) => (
                <button
                  key={`${iconData.type}-${iconData.name}`}
                  onClick={() => handleIconClick(iconData.name, iconData.type)}
                  className={`p-3 rounded-md border transition-all bg-background hover:bg-muted border-border ${
                    currentIcon === iconData.name ? 'ring-2 ring-primary' : ''
                  }`}
                  title={iconData.name}
                >
                  <FontAwesomeIcon icon={iconData.icon} className="text-base" />
                  <div className="mt-1 text-[10px] text-muted-foreground truncate">{iconData.name}</div>
                </button>
              ))}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center py-6 text-muted-foreground text-sm">No icons found</div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-elevated w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h2 className="text-sm font-semibold">Icon Picker</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>

        {/* Top Controls: Search + Style Dropdown */}
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-sm bg-background border-border text-foreground"
            />
          </div>
          <Select value={styleFilter} onValueChange={(v) => setStyleFilter(v as any)}>
            <SelectTrigger className="w-40 h-8 text-xs bg-background border-border text-foreground">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
              <SelectItem value="all" className="text-xs">All styles</SelectItem>
              <SelectItem value="solid" className="text-xs">Solid</SelectItem>
              <SelectItem value="regular" className="text-xs">Regular</SelectItem>
              <SelectItem value="brand" className="text-xs">Brand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-3">
          {searchTerm && (
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {filteredIcons.length} item{filteredIcons.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3">
            <div className="grid grid-cols-8 gap-2 max-h-[56vh]">
              {filteredIcons.map((iconData) => (
                <button
                  key={`${iconData.type}-${iconData.name}`}
                  onClick={() => handleIconClick(iconData.name, iconData.type)}
                  className={`p-3 rounded-md border transition-all bg-background hover:bg-muted border-border ${
                    currentIcon === iconData.name
                      ? 'ring-2 ring-primary'
                      : ''
                  }`}
                  title={iconData.name}
                >
                  <FontAwesomeIcon 
                    icon={iconData.icon} 
                    className="text-base"
                  />
                  <div className="mt-1 text-[10px] text-muted-foreground truncate">{iconData.name}</div>
                </button>
              ))}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No icons found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
