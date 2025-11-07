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
  faGamepad, faTrophy, faGift, faShoppingCart, faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { faShield } from '@fortawesome/free-solid-svg-icons';
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
  // Solid icons
  'home': faHome, 'user': faUser, 'cog': faCog, 'heart': faHeart, 'star': faStar,
  'play': faPlay, 'pause': faPause, 'stop': faStop, 'edit': faEdit, 'trash': faTrash,
  'save': faSave, 'download': faDownload, 'upload': faUpload, 'copy': faCopy, 'cut': faCut, 'paste': faPaste,
  'bold': faBold, 'italic': faItalic, 'underline': faUnderline, 'align-left': faAlignLeft, 'align-center': faAlignCenter, 'align-right': faAlignRight,
  'plus': faPlus, 'minus': faMinus, 'times': faMultiply, 'divide': faDivide, 'equals': faEquals,
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
  keyPosition,
  unit,
  padding,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Click-outside effect to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        onClose?.();
        setShowAddMenu(false);
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

  if (layers.length === 0 || !selectedLayerId) return null;

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
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => onLayerSelect(layer.id)}
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
