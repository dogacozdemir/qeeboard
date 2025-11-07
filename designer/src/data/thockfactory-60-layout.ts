import { KeyboardLayout, KeycapConfig } from '@/types/keyboard';

// ThockFactory 60% ISO Layout - Corrected positioning
export const thockFactory60Layout: KeyboardLayout = {
  id: 'thockfactory-60-iso',
  name: '60% ISO (ThockFactory)',
  keys: [
    // Row 1 - Numbers and backspace (top row)
    { id: 'key-0', row: 0, col: 0, width: 1, height: 1, x: 0, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-0-0', type: 'text', content: '`', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-1', row: 0, col: 1, width: 1, height: 1, x: 1, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-1-0', type: 'text', content: '1', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-2', row: 0, col: 2, width: 1, height: 1, x: 2, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-2-0', type: 'text', content: '2', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-3', row: 0, col: 3, width: 1, height: 1, x: 3, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-3-0', type: 'text', content: '3', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-4', row: 0, col: 4, width: 1, height: 1, x: 4, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-4-0', type: 'text', content: '4', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-5', row: 0, col: 5, width: 1, height: 1, x: 5, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-5-0', type: 'text', content: '5', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-6', row: 0, col: 6, width: 1, height: 1, x: 6, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-6-0', type: 'text', content: '6', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-7', row: 0, col: 7, width: 1, height: 1, x: 7, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-7-0', type: 'text', content: '7', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-8', row: 0, col: 8, width: 1, height: 1, x: 8, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-8-0', type: 'text', content: '8', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-9', row: 0, col: 9, width: 1, height: 1, x: 9, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-9-0', type: 'text', content: '9', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-10', row: 0, col: 10, width: 1, height: 1, x: 10, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-10-0', type: 'text', content: '0', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-11', row: 0, col: 11, width: 1, height: 1, x: 11, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-11-0', type: 'text', content: '-', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-12', row: 0, col: 12, width: 1, height: 1, x: 12, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-12-0', type: 'text', content: '=', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-13', row: 0, col: 13, width: 2, height: 1, x: 13, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-13-0', type: 'text', content: 'Backspace', alignment: 'center', verticalAlignment: 'center' }] },

    // Row 2 - QWERTY
    { id: 'key-14', row: 1, col: 0, width: 1.5, height: 1, x: 0, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-14-0', type: 'text', content: 'Tab', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-15', row: 1, col: 1, width: 1, height: 1, x: 1.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-15-0', type: 'text', content: 'Q', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-16', row: 1, col: 2, width: 1, height: 1, x: 2.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-16-0', type: 'text', content: 'W', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-17', row: 1, col: 3, width: 1, height: 1, x: 3.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-17-0', type: 'text', content: 'E', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-18', row: 1, col: 4, width: 1, height: 1, x: 4.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-18-0', type: 'text', content: 'R', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-19', row: 1, col: 5, width: 1, height: 1, x: 5.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-19-0', type: 'text', content: 'T', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-20', row: 1, col: 6, width: 1, height: 1, x: 6.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-20-0', type: 'text', content: 'Y', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-21', row: 1, col: 7, width: 1, height: 1, x: 7.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-21-0', type: 'text', content: 'U', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-22', row: 1, col: 8, width: 1, height: 1, x: 8.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-22-0', type: 'text', content: 'I', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-23', row: 1, col: 9, width: 1, height: 1, x: 9.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-23-0', type: 'text', content: 'O', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-24', row: 1, col: 10, width: 1, height: 1, x: 10.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-24-0', type: 'text', content: 'P', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-25', row: 1, col: 11, width: 1, height: 1, x: 11.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-25-0', type: 'text', content: '[', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-26', row: 1, col: 12, width: 1, height: 1, x: 12.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-26-0', type: 'text', content: ']', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-27', row: 1, col: 13, width: 1.5, height: 1, x: 13.5, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-27-0', type: 'text', content: '\\', alignment: 'center', verticalAlignment: 'center' }] },

    // Row 3 - ASDF
    { id: 'key-28', row: 2, col: 0, width: 1.75, height: 1, x: 0, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-28-0', type: 'text', content: 'Caps', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-29', row: 2, col: 1, width: 1, height: 1, x: 1.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-29-0', type: 'text', content: 'A', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-30', row: 2, col: 2, width: 1, height: 1, x: 2.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-30-0', type: 'text', content: 'S', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-31', row: 2, col: 3, width: 1, height: 1, x: 3.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-31-0', type: 'text', content: 'D', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-32', row: 2, col: 4, width: 1, height: 1, x: 4.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-32-0', type: 'text', content: 'F', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-33', row: 2, col: 5, width: 1, height: 1, x: 5.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-33-0', type: 'text', content: 'G', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-34', row: 2, col: 6, width: 1, height: 1, x: 6.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-34-0', type: 'text', content: 'H', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-35', row: 2, col: 7, width: 1, height: 1, x: 7.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-35-0', type: 'text', content: 'J', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-36', row: 2, col: 8, width: 1, height: 1, x: 8.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-36-0', type: 'text', content: 'K', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-37', row: 2, col: 9, width: 1, height: 1, x: 9.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-37-0', type: 'text', content: 'L', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-38', row: 2, col: 10, width: 1, height: 1, x: 10.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-38-0', type: 'text', content: ';', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-39', row: 2, col: 11, width: 1, height: 1, x: 11.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-39-0', type: 'text', content: "'", alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-40', row: 2, col: 12, width: 2.25, height: 1, x: 12.75, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-40-0', type: 'text', content: 'Enter', alignment: 'center', verticalAlignment: 'center' }] },

    // Row 4 - ZXCV
    { id: 'key-41', row: 3, col: 0, width: 2.25, height: 1, x: 0, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-41-0', type: 'text', content: 'Shift', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-42', row: 3, col: 1, width: 1, height: 1, x: 2.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-42-0', type: 'text', content: 'Z', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-43', row: 3, col: 2, width: 1, height: 1, x: 3.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-43-0', type: 'text', content: 'X', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-44', row: 3, col: 3, width: 1, height: 1, x: 4.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-44-0', type: 'text', content: 'C', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-45', row: 3, col: 4, width: 1, height: 1, x: 5.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-45-0', type: 'text', content: 'V', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-46', row: 3, col: 5, width: 1, height: 1, x: 6.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-46-0', type: 'text', content: 'B', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-47', row: 3, col: 6, width: 1, height: 1, x: 7.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-47-0', type: 'text', content: 'N', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-48', row: 3, col: 7, width: 1, height: 1, x: 8.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-48-0', type: 'text', content: 'M', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-49', row: 3, col: 8, width: 1, height: 1, x: 9.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-49-0', type: 'text', content: ',', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-50', row: 3, col: 9, width: 1, height: 1, x: 10.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-50-0', type: 'text', content: '.', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-51', row: 3, col: 10, width: 1, height: 1, x: 11.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-51-0', type: 'text', content: '/', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-52', row: 3, col: 11, width: 2.75, height: 1, x: 12.25, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-52-0', type: 'text', content: 'Shift', alignment: 'center', verticalAlignment: 'center' }] },

    // Row 5 - Bottom row (exact ThockFactory sizing)
    { id: 'key-53', row: 4, col: 0, width: 1.25, height: 1, x: 0, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-53-0', type: 'text', content: 'Ctrl', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-54', row: 4, col: 1, width: 1.25, height: 1, x: 1.25, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-54-0', type: 'text', content: 'Win', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-55', row: 4, col: 2, width: 1.25, height: 1, x: 2.5, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-55-0', type: 'text', content: 'Alt', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-56', row: 4, col: 3, width: 6.25, height: 1, x: 3.75, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-56-0', type: 'text', content: 'Space', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-57', row: 4, col: 4, width: 1.25, height: 1, x: 10, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-57-0', type: 'text', content: 'Alt', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-58', row: 4, col: 5, width: 1.25, height: 1, x: 11.25, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-58-0', type: 'text', content: 'Fn', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-59', row: 4, col: 6, width: 1.25, height: 1, x: 12.5, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-59-0', type: 'text', content: 'Menu', alignment: 'center', verticalAlignment: 'center' }] },
    { id: 'key-60', row: 4, col: 7, width: 1.25, height: 1, x: 13.75, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: 'layer-60-0', type: 'text', content: 'Ctrl', alignment: 'center', verticalAlignment: 'center' }] },
  ],
  totalKeys: 61,
  width: 15, // 1.25+1.25+1.25+6.25+1.25+1.25+1.25+1.25 = 15 units
  height: 5,
};