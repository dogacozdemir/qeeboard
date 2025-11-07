import React from 'react';
import { KeycapLayer } from '@/types/keyboard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ChevronUp, ChevronDown, X, Plus, Type, Image, Palette } from 'lucide-react';
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
  onLayerReorder: (layerId: string, direction: 'up' | 'down') => void;
  onLayerDelete: (layerId: string) => void;
  onAddTextLayer: () => void;
  onAddImageLayer: () => void;
  onAddIconLayer?: () => void;
  // Multi-selection props
  selectedKeys?: string[];
  isMultiSelection?: boolean;
  multiSelectionStats?: { text: number; icon: number; image: number } | null;
  selectedLayerIds?: string[];
  getKeyLayers?: (keyId: string) => KeycapLayer[];
  onSelectAllLayers?: () => void;
  onSelectTextLayers?: () => void;
  onSelectIconLayers?: () => void;
  onSelectImageLayers?: () => void;
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
  isMultiSelection = false,
  multiSelectionStats = null,
  selectedLayerIds = [],
  getKeyLayers,
  onSelectAllLayers,
  onSelectTextLayers,
  onSelectIconLayers,
  onSelectImageLayers,
}) => {
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
            <div 
              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                selectedLayerIds.length > 0 && getKeyLayers && selectedLayerIds.every(id => {
                  return selectedKeys.some(keyId => {
                    const layers = getKeyLayers(keyId);
                    const layer = layers.find(l => l.id === id);
                    return layer?.type === 'text';
                  });
                }) && selectedLayerIds.length === multiSelectionStats.text
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              }`}
              onClick={onSelectTextLayers}
            >
              <Type className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Text ({multiSelectionStats.text}x)</span>
            </div>
          )}
          {multiSelectionStats.icon > 0 && (
            <div 
              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                selectedLayerIds.length > 0 && getKeyLayers && selectedLayerIds.every(id => {
                  return selectedKeys.some(keyId => {
                    const layers = getKeyLayers(keyId);
                    const layer = layers.find(l => l.id === id);
                    return layer?.type === 'icon';
                  });
                }) && selectedLayerIds.length === multiSelectionStats.icon
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              }`}
              onClick={onSelectIconLayers}
            >
              <Palette className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Icon ({multiSelectionStats.icon}x)</span>
            </div>
          )}
          {multiSelectionStats.image > 0 && (
            <div 
              className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ml-4 ${
                selectedLayerIds.length > 0 && getKeyLayers && selectedLayerIds.every(id => {
                  return selectedKeys.some(keyId => {
                    const layers = getKeyLayers(keyId);
                    const layer = layers.find(l => l.id === id);
                    return layer?.type === 'image';
                  });
                }) && selectedLayerIds.length === multiSelectionStats.image
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-accent/50'
              }`}
              onClick={onSelectImageLayers}
            >
              <Image className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">Image ({multiSelectionStats.image}x)</span>
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
                    onLayerReorder(layer.id, 'up');
                  }}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerReorder(layer.id, 'down');
                  }}
                  disabled={index === layers.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLayerDelete(layer.id);
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
