import { KeyboardLayout, LayoutOption } from '@/types/keyboard';
import { thockFactory60Layout } from './thockfactory-60-layout';

export const layoutOptions: LayoutOption[] = [
  {
    id: '60%',
    name: '%60',
    description: '61 keys - Perfect for minimalists',
    keyCount: 61,
  },
  {
    id: '65%',
    name: '%65',
    description: '65% with arrows and nav keys',
    keyCount: 67,
  },
  {
    id: '65% #2',
    name: '%65 #2',
    description: '65% variant with two 1.25u keys after Space and wider gap before arrows',
    keyCount: 66,
  },
  {
    id: 'TKL',
    name: 'Tenkeyless',
    description: '87 keys - Function keys without numpad',
    keyCount: 87,
  },
  {
    id: 'Full',
    name: 'Full Size',
    description: '104 keys - Complete layout with numpad',
    keyCount: 104,
  },
  {
    id: '75% #1' as any,
    name: '%75',
    description: '75% with function row & compact nav cluster',
    keyCount: 0,
  },
  {
    id: '75% #2' as any,
    name: '%75 #2',
    description: '75% variant: no right Ctrl; AltGr/Fn are 1.25u',
    keyCount: 0,
  },
];

// Key unit size (standard keycap unit)
const UNIT = 48;
const GAP = 4;

// Generate 60% layout (61 keys) - ThockFactory Math
const generate60Layout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Row 1 (Numbers and backspace) - This is the top row in 60%
  const row1Keys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
  let x = 0;
  row1Keys.forEach((legend, i) => {
    const width = legend === 'Backspace' ? 2 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 0,
      col: i,
      width,
      height: 1,
      x,
      y: 0, // Top row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  // Row 2 (Tab and QWERTY)
  const row2Keys = ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü', '\\'];
  x = 0;
  row2Keys.forEach((legend, i) => {
    const width = legend === 'Tab' ? 1.5 : legend === '\\' ? 1.5 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 1,
      col: i,
      width,
      height: 1,
      x,
      y: 1, // Second row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  // Row 3 (Caps Lock and ASDF)
  const row3Keys = ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', "İ", 'Enter'];
  x = 0;
  row3Keys.forEach((legend, i) => {
    const width = legend === 'Caps' ? 1.75 : legend === 'Enter' ? 2.25 : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 2,
      col: i,
      width,
      height: 1,
      x,
      y: 2, // Third row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  // Row 4 (Shift and ZXCV)
  const row4Keys = ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', ':', 'Shift'];
  x = 0;
  row4Keys.forEach((legend, i) => {
    const width = legend === 'Shift' ? (i === 0 ? 2.25 : 2.75) : 1;
    keys.push({
      id: `key-${keyId++}`,
      row: 3,
      col: i,
      width,
      height: 1,
      x,
      y: 3, // Fourth row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  // Row 5 (Bottom row) - ThockFactory exact sizing
  const row5Keys = ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', 'Menu', 'Ctrl'];
  const row5Widths = [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25]; // Exact ThockFactory sizing
  x = 0;
  row5Keys.forEach((legend, i) => {
    const width = row5Widths[i];
    keys.push({
      id: `key-${keyId++}`,
      row: 4,
      col: i,
      width,
      height: 1,
      x,
      y: 4, // Bottom row in our system
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
    x += width;
  });

  return {
    id: '60%',
    name: '%60',
    keys,
    totalKeys: 61,
    width: 15, // 1.25+1.25+1.25+6.25+1.25+1.25+1.25+1.25 = 15 units
    height: 5, // 5 rows
  };
};

// Generate TKL layout (87 keys) - extends 60% with function row and nav cluster
const generateTKLLayout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Function row
  const funcKeys = ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'ScrLk', 'Pause'];
  funcKeys.forEach((legend, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 0,
      col: i,
      width: 1,
      height: 1,
      x: i + (i > 3 ? 0.5 : 0) + (i > 7 ? 0.5 : 0) + (i > 11 ? 0.5 : 0),
      y: 0,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  // Main 60% section (offset by 1 row)
  const sixtyLayout = generate60Layout();
  sixtyLayout.keys.forEach(key => {
    keys.push({
      ...key,
      id: `key-${keyId++}`,
      y: key.y + 1.5,
    });
  });

  // Navigation cluster
  const navKeys = [
    { legend: 'Ins', x: 15.5, y: 1.5 },
    { legend: 'Home', x: 16.5, y: 1.5 },
    { legend: 'PgUp', x: 17.5, y: 1.5 },
    { legend: 'Del', x: 15.5, y: 2.5 },
    { legend: 'End', x: 16.5, y: 2.5 },
    { legend: 'PgDn', x: 17.5, y: 2.5 },
    { legend: '↑', x: 16.5, y: 4.5 },
    { legend: '←', x: 15.5, y: 5.5 },
    { legend: '↓', x: 16.5, y: 5.5 },
    { legend: '→', x: 17.5, y: 5.5 },
  ];

  navKeys.forEach(({ legend, x, y }) => {
    keys.push({
      id: `key-${keyId++}`,
      row: Math.floor(y),
      col: Math.floor(x),
      width: 1,
      height: 1,
      x,
      y,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  return {
    id: 'TKL',
    name: 'Tenkeyless',
    keys,
    totalKeys: 87,
    width: 18.5,
    height: 6.5,
  };
};

// ISO TKL: same TKL shell but core 60% region uses ISO
const generateTKLISOLayout = (): KeyboardLayout => {
  const keys: any[] = [];
  let keyId = 0;

  // Function row
  const funcKeys = ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PrtSc', 'ScrLk', 'Pause'];
  funcKeys.forEach((legend, i) => {
    keys.push({
      id: `key-${keyId++}`,
      row: 0,
      col: i,
      width: 1,
      height: 1,
      x: i + (i > 3 ? 0.5 : 0) + (i > 7 ? 0.5 : 0) + (i > 11 ? 0.5 : 0),
      y: 0,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }],
    });
  });

  // Main 60% ISO section (offset by 1.5 rows)
  const sixtyISO = generateISO60Layout();
  sixtyISO.keys.forEach(key => {
    keys.push({
      ...key,
      id: `key-${keyId++}`,
      y: key.y + 1.5,
    });
  });

  // Navigation cluster (same positions as ANSI TKL)
  const navKeys = [
    { legend: 'Ins', x: 15.5, y: 1.5 },
    { legend: 'Home', x: 16.5, y: 1.5 },
    { legend: 'PgUp', x: 17.5, y: 1.5 },
    { legend: 'Del', x: 15.5, y: 2.5 },
    { legend: 'End', x: 16.5, y: 2.5 },
    { legend: 'PgDn', x: 17.5, y: 2.5 },
    { legend: '↑', x: 16.5, y: 4.5 },
    { legend: '←', x: 15.5, y: 5.5 },
    { legend: '↓', x: 16.5, y: 5.5 },
    { legend: '→', x: 17.5, y: 5.5 },
  ];
  navKeys.forEach(({ legend, x, y }) => {
    keys.push({
      id: `key-${keyId++}`,
      row: Math.floor(y),
      col: Math.floor(x),
      width: 1,
      height: 1,
      x,
      y,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }],
    });
  });

  return {
    id: 'TKL',
    name: 'Tenkeyless ISO',
    keys,
    totalKeys: 87,
    width: 18.5,
    height: 6.5,
  };
};

// Generate Full layout (104 keys) - extends TKL with numpad
const generateFullLayout = (): KeyboardLayout => {
  const tklLayout = generateTKLLayout();
  const keys = [...tklLayout.keys];
  let keyId = keys.length;

  // Numpad
  const numpadKeys = [
    { legend: 'NumLk', x: 19.5, y: 1.5, w: 1, h: 1 },
    { legend: '/', x: 20.5, y: 1.5, w: 1, h: 1 },
    { legend: '*', x: 21.5, y: 1.5, w: 1, h: 1 },
    { legend: '-', x: 22.5, y: 1.5, w: 1, h: 1 },
    
    { legend: '7', x: 19.5, y: 2.5, w: 1, h: 1 },
    { legend: '8', x: 20.5, y: 2.5, w: 1, h: 1 },
    { legend: '9', x: 21.5, y: 2.5, w: 1, h: 1 },
    { legend: '+', x: 22.5, y: 2.5, w: 1, h: 2 },
    
    { legend: '4', x: 19.5, y: 3.5, w: 1, h: 1 },
    { legend: '5', x: 20.5, y: 3.5, w: 1, h: 1 },
    { legend: '6', x: 21.5, y: 3.5, w: 1, h: 1 },
    
    { legend: '1', x: 19.5, y: 4.5, w: 1, h: 1 },
    { legend: '2', x: 20.5, y: 4.5, w: 1, h: 1 },
    { legend: '3', x: 21.5, y: 4.5, w: 1, h: 1 },
    { legend: 'Enter', x: 22.5, y: 4.5, w: 1, h: 2 },
    
    { legend: '0', x: 19.5, y: 5.5, w: 2, h: 1 },
    { legend: '.', x: 21.5, y: 5.5, w: 1, h: 1 },
  ];

  numpadKeys.forEach(({ legend, x, y, w, h }) => {
    keys.push({
      id: `key-${keyId++}`,
      row: Math.floor(y),
      col: Math.floor(x),
      width: w,
      height: h,
      x,
      y,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{
        id: `layer-${keyId}-0`,
        type: 'text',
        content: legend,
        alignment: 'center',
        verticalAlignment: 'center',
        offsetX: 0,
        offsetY: -4,
      }],
    });
  });

  return {
    id: 'Full',
    name: 'Full Size',
    keys,
    totalKeys: 104,
    width: 23.5,
    height: 6.5,
  };
};

const generateFullISOLayout = (): KeyboardLayout => {
  const tklISO = generateTKLISOLayout();
  const keys = [...tklISO.keys];
  let keyId = keys.length;

  const numpadKeys = [
    { legend: 'NumLk', x: 19.5, y: 1.5, w: 1, h: 1 },
    { legend: '/', x: 20.5, y: 1.5, w: 1, h: 1 },
    { legend: '*', x: 21.5, y: 1.5, w: 1, h: 1 },
    { legend: '-', x: 22.5, y: 1.5, w: 1, h: 1 },
    { legend: '7', x: 19.5, y: 2.5, w: 1, h: 1 },
    { legend: '8', x: 20.5, y: 2.5, w: 1, h: 1 },
    { legend: '9', x: 21.5, y: 2.5, w: 1, h: 1 },
    { legend: '+', x: 22.5, y: 2.5, w: 1, h: 2 },
    { legend: '4', x: 19.5, y: 3.5, w: 1, h: 1 },
    { legend: '5', x: 20.5, y: 3.5, w: 1, h: 1 },
    { legend: '6', x: 21.5, y: 3.5, w: 1, h: 1 },
    { legend: '1', x: 19.5, y: 4.5, w: 1, h: 1 },
    { legend: '2', x: 20.5, y: 4.5, w: 1, h: 1 },
    { legend: '3', x: 21.5, y: 4.5, w: 1, h: 1 },
    { legend: 'Enter', x: 22.5, y: 4.5, w: 1, h: 2 },
    { legend: '0', x: 19.5, y: 5.5, w: 2, h: 1 },
    { legend: '.', x: 21.5, y: 5.5, w: 1, h: 1 },
  ];
  numpadKeys.forEach(({ legend, x, y, w, h }) => {
    keys.push({ id: `key-${keyId++}`, row: Math.floor(y), col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
  });

  return {
    id: 'Full',
    name: 'Full Size ISO',
    keys,
    totalKeys: 104,
    width: 23.5,
    height: 6.5,
  };
};

// Helper builders (ANSI) to avoid self-referencing keyboardLayouts during map construction
const build65_ANSI_helper = (): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
    keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
  };
  // Row indices y=0..4
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  ['1','2','3','4','5','6','7','8','9','0','-','='].forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y);
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(k => { addKey(k, x, y); x += 1; });
  addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y);
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  ['A','S','D','F','G','H','J','K','L',';','\''].forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y);
  x = 0; y = 3; addKey('Shift', x, y, 2.25); x += 2.25;
  ['Z','X','C','V','B','N','M',',','.','/'].forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Shift', x, y, 1.75); x += 1.75; const upX = x; addKey('↑', upX, y); x = upX + 1; addKey('', x, y);
  x = 0; y = 4; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y); x += 1; addKey('FN', x, y); x += 1; addKey('CTRL', x, y); x += 1; addKey('←', x, y); x += 1; addKey('↓', x, y); x += 1; addKey('→', x, y);
  return { id: '65%-ANSI', name: '%65', keys, totalKeys: keys.length, width: 17.5, height: 5 } as KeyboardLayout;
};

const build65_ISO_helper = (): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
    keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
  };
  // Top row
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  ['1','2','3','4','5','6','7','8','9','0','-','='].forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; 
  const delX = x; addKey('Del', delX, y);
  // Row with Tab: ISO Enter top piece at row end (height 2), no trailing backslash
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(k => { addKey(k, x, y); x += 1; });
  // ISO Enter top segment (1.5u x 2u)
  addKey('Enter', x, y, 1.5, 2); x += 1.5;
  // Home should be in same column as Del (delX), which is after Backspace (x=14)
  addKey('Home', delX, y);
  // Caps row: Enter bottom is '#' key
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  ['A','S','D','F','G','H','J','K','L',';','\''].forEach(k => { addKey(k, x, y); x += 1; });
  addKey('#', x, y, 1); 
  // End should be in same column as Del and Home (delX)
  addKey('End', delX, y);
  // ISO left Shift short (1.25) + extra backslash key next to it
  x = 0; y = 3; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1;
  ['Z','X','C','V','B','N','M',',','.','/'].forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Shift', x, y, 1.75); x += 1.75; const upX = x; addKey('↑', upX, y); x = upX + 1; addKey('', x, y);
  // Bottom row
  x = 0; y = 4; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y); x += 1; addKey('FN', x, y); x += 1; addKey('CTRL', x, y); x += 1; addKey('←', x, y); x += 1; addKey('↓', x, y); x += 1; addKey('→', x, y);
  return { id: '65%-ISO', name: '%65 (ISO)', keys, totalKeys: keys.length, width: 17.5, height: 5 } as KeyboardLayout;
};
const build65_2_ANSI_helper = (): KeyboardLayout => {
  const keys: any[] = [];
  let keyId = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
    keys.push({
      id: `key-${keyId++}`,
      row: y,
      col: Math.floor(x),
      width: w,
      height: h,
      x,
      y,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }],
    });
  };
  // Copy rows R4..R1 from 65%
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  const nums = ['1','2','3','4','5','6','7','8','9','0','-','='];
  nums.forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y);
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  const qrow = ['Q','W','E','R','T','Y','U','I','O','P','[',']'];
  qrow.forEach(k => { addKey(k, x, y); x += 1; });
  addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y);
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  const arow = ['A','S','D','F','G','H','J','K','L',';','\''];
  arow.forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y);
  x = 0; y = 3; addKey('Shift', x, y, 2.25); x += 2.25;
  const zrow = ['Z','X','C','V','B','N','M',',','.','/'];
  zrow.forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Shift', x, y, 1.75); x += 1.75; const upX = x; addKey('↑', upX, y); x = upX + 1; addKey('', x, y);
  // Bottom row variant: two 1.25u keys after Space, then a visibly wider gap, then arrows
  x = 0; y = 4;
  addKey('Ctrl', x, y, 1.25); x += 1.25;
  addKey('Win', x, y, 1.25); x += 1.25;
  addKey('Alt', x, y, 1.25); x += 1.25;
  addKey('Space', x, y, 6.25); x += 6.25;
  addKey('AltGr', x, y, 1.25); x += 1.25;
  addKey('Fn', x, y, 1.25); x += 1.25;
  // Align arrows with Up: left at upX-1, down at upX, right at upX+1
  addKey('←', upX - 1, y, 1);
  addKey('↓', upX, y, 1);
  addKey('→', upX + 1, y, 1);
  return { id: '65% #2-ANSI', name: '%65 #2', keys, totalKeys: keys.length, width: 18, height: 5 } as KeyboardLayout;
};

const build75_1_ANSI_helper = (): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y, 1);
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; ['A','S','D','F','G','H','J','K','L',';','\''].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y, 1);
  y = 4; x = 0; addKey('Shift', x, y, 2.25); x += 2.25; ['Z','X','C','V','B','N','M',',','.','/'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('RShift', x, y, 1.75); x += 1.75; const upX_75_1 = x; addKey('↑', upX_75_1, y, 1); x = upX_75_1 + 1; addKey('PgUp', x, y, 1);
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1); x += 1; addKey('Fn', x, y, 1); x += 1; addKey('Ctrl', x, y, 1); x += 1; addKey('←', upX_75_1 - 1, y, 1); addKey('↓', upX_75_1, y, 1); addKey('→', upX_75_1 + 1, y, 1);
  return { id: '75% #1-ANSI', name: '%75', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

const build75_1_ISO_helper = (): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0; let navX = -1;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  // Row with Tab: true ISO Enter top piece at the row end (height 2)
  // Remove trailing backslash here (moved next to left Shift)
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  // ISO Enter top segment (like 60% ISO), 1.5u wide and 2 rows tall
  // Place the Enter top segment; then fix a navigation column to its right
  addKey('Enter', x, y, 1.5, 2); x += 1.5; navX = x; addKey('Home', navX, y, 1);
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; ['A','S','D','F','G','H','J','K','L',';','\''].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  // ISO: no long Enter on this row; place '#' under where ANSI had Enter-left
  // Place 'End' aligned to navigation column set on the row above
  addKey('#', x, y, 1);
  if (navX < 0) { navX = x + 2; }
  addKey('End', navX, y, 1);
  // ISO left Shift short + extra backslash
  y = 4; x = 0; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1; ['Z','X','C','V','B','N','M',',','.','/'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('RShift', x, y, 1.75); x += 1.75; const upX_75_1 = x; addKey('↑', upX_75_1, y, 1); x = upX_75_1 + 1; addKey('PgUp', x, y, 1);
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1); x += 1; addKey('Fn', x, y, 1); x += 1; addKey('Ctrl', x, y, 1); x += 1; addKey('←', upX_75_1 - 1, y, 1); addKey('↓', upX_75_1, y, 1); addKey('→', upX_75_1 + 1, y, 1);
  return { id: '75% #1-ISO', name: '%75 (ISO)', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

const build65_2_ISO_helper = (): KeyboardLayout => {
  const keys: any[] = [];
  let keyId = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
    keys.push({
      id: `key-${keyId++}`,
      row: y,
      col: Math.floor(x),
      width: w,
      height: h,
      x,
      y,
      color: '#FFFFFF',
      textColor: '#000000',
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }],
    });
  };
  // Top row
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  const nums = ['1','2','3','4','5','6','7','8','9','0','-','='];
  nums.forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; 
  const delX = x; addKey('Del', delX, y);
  // Row with Tab: ISO Enter top piece at row end (height 2), no trailing backslash
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  const qrow = ['Q','W','E','R','T','Y','U','I','O','P','[',']'];
  qrow.forEach(k => { addKey(k, x, y); x += 1; });
  // ISO Enter top segment (1.5u x 2u)
  addKey('Enter', x, y, 1.5, 2); 
  // Home should be in same column as Del (delX), which is after Backspace (x=14)
  addKey('Home', delX, y);
  // Caps row: Enter bottom is '#' key
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  const arow = ['A','S','D','F','G','H','J','K','L',';','\''];
  arow.forEach(k => { addKey(k, x, y); x += 1; });
  addKey('#', x, y, 1); 
  // End should be in same column as Del and Home (delX), not after '#'
  addKey('End', delX, y);
  // ISO left Shift short (1.25u) + backslash next to it
  x = 0; y = 3; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1;
  const zrow = ['Z','X','C','V','B','N','M',',','.','/'];
  zrow.forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Shift', x, y, 1.75); x += 1.75; const upX = x; addKey('↑', upX, y); x = upX + 1; addKey('', x, y);
  // Bottom row: same as ANSI (two 1.25u keys after Space)
  x = 0; y = 4;
  addKey('Ctrl', x, y, 1.25); x += 1.25;
  addKey('Win', x, y, 1.25); x += 1.25;
  addKey('Alt', x, y, 1.25); x += 1.25;
  addKey('Space', x, y, 6.25); x += 6.25;
  addKey('AltGr', x, y, 1.25); x += 1.25;
  addKey('Fn', x, y, 1.25); x += 1.25;
  // Align arrows with Up
  addKey('←', upX - 1, y, 1);
  addKey('↓', upX, y, 1);
  addKey('→', upX + 1, y, 1);
  return { id: '65% #2-ISO', name: '%65 #2 (ISO)', keys, totalKeys: keys.length, width: 18, height: 5 } as KeyboardLayout;
};

const build75_2_ANSI_helper = (): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y, 1);
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; ['A','S','D','F','G','H','J','K','L',';','\''].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y, 1);
  y = 4; x = 0; addKey('Shift', x, y, 2.25); x += 2.25; ['Z','X','C','V','B','N','M',',','.','/'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); const upX_75_2_shiftEnd = x; addKey('RShift', upX_75_2_shiftEnd, y, 1.75); const upX_75_2 = upX_75_2_shiftEnd + 1.75; addKey('↑', upX_75_2, y, 1); addKey('PgUp', upX_75_2 + 1, y, 1);
  // Bottom row variant: AltGr 1.25u, Fn 1.25u, no right Ctrl
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1.25); x += 1.25; addKey('Fn', x, y, 1.25); x += 1.25; addKey('←', upX_75_2 - 1, y, 1); addKey('↓', upX_75_2, y, 1); addKey('→', upX_75_2 + 1, y, 1);
  return { id: '75% #2-ANSI', name: '%75 #2', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

const build75_2_ISO_helper = (): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0; let navX = -1;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  // Row with Tab: ISO Enter top piece at row end (height 2), no trailing backslash
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  // ISO Enter top segment (1.5u x 2u)
  addKey('Enter', x, y, 1.5, 2); x += 1.5; navX = x; addKey('Home', navX, y, 1);
  // Caps row: Enter bottom is '#' key
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; ['A','S','D','F','G','H','J','K','L',';','\''].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  addKey('#', x, y, 1); if (navX < 0) { navX = x + 2; } addKey('End', navX, y, 1);
  // ISO left Shift short (1.25u) + backslash next to it
  y = 4; x = 0; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1; ['Z','X','C','V','B','N','M',',','.','/'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); const upX_75_2_shiftEnd = x; addKey('RShift', upX_75_2_shiftEnd, y, 1.75); const upX_75_2 = upX_75_2_shiftEnd + 1.75; addKey('↑', upX_75_2, y, 1); addKey('PgUp', upX_75_2 + 1, y, 1);
  // Bottom row: AltGr 1.25u, Fn 1.25u, no right Ctrl (same as ANSI)
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1.25); x += 1.25; addKey('Fn', x, y, 1.25); x += 1.25; addKey('←', upX_75_2 - 1, y, 1); addKey('↓', upX_75_2, y, 1); addKey('→', upX_75_2 + 1, y, 1);
  return { id: '75% #2-ISO', name: '%75 #2 (ISO)', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

// Generate ISO 60% layout with normalized keyboard units
const generateISO60Layout = (): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Row 1: standard 1u keys, Backspace 2u
  let x = 0;
  ['`','1','2','3','4','5','6','7','8','9','0','-','='].forEach((legend, i) => {
    const w = legend === 'Backspace' ? 2 : 1;
    keys.push({ id: `key-${keyId++}`, row: 0, col: i, width: 1, height: 1, x, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
    x += 1;
  });
  // Backspace
  keys.push({ id: `key-${keyId++}`, row: 0, col: 13, width: 2, height: 1, x, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: 'Backspace', alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });

  // Row 2: Tab 1.5u, Q..], Enter top 1.5u x 2u
  x = 0;
  const row2Left = ['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']'];
  row2Left.forEach((legend, i) => {
    const w = legend === 'Tab' ? 1.5 : 1;
    keys.push({ id: `key-${keyId++}`, row: 1, col: i, width: w, height: 1, x, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
    x += w;
  });
  // ISO Enter top segment
  keys.push({ id: `key-${keyId++}`, row: 1, col: row2Left.length, width: 1.5, height: 2, x, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: 'Enter', alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });

  // Row 3: Caps 1.75u, A..', '#'
  x = 0;
  const row3 = [{ legend: 'Caps Lock', w: 1.75 }, 'A','S','D','F','G','H','J','K','L',';','\'', '#'];
  row3.forEach((item, i) => {
    const legend = typeof item === 'string' ? item : item.legend;
    const w = typeof item === 'string' ? 1 : item.w;
    keys.push({ id: `key-${keyId++}`, row: 2, col: i, width: w, height: 1, x, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
    x += w;
  });

  // Row 4: ISO left Shift 1.25u + backslash, ... , right Shift 2.75u
  x = 0;
  const row4Left = [{ legend: 'Shift', w: 1.25 }, { legend: '\\', w: 1 }, 'Z','X','C','V','B','N','M',',','.', '/'];
  row4Left.forEach((item, i) => {
    const legend = typeof item === 'string' ? item : item.legend;
    const w = typeof item === 'string' ? 1 : item.w;
    keys.push({ id: `key-${keyId++}`, row: 3, col: i, width: w, height: 1, x, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
    x += w;
  });
  // Right Shift 2.75u
  keys.push({ id: `key-${keyId++}`, row: 3, col: row4Left.length, width: 2.75, height: 1, x, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: 'Shift', alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });

  // Row 5: 1.25u,1.25u,1.25u,6.25u,1.25u,1.25u,1.25u,1.25u
  x = 0;
  const row5 = [
    { legend: 'Ctrl', w: 1.25 }, { legend: 'Win', w: 1.25 }, { legend: 'Alt', w: 1.25 },
    { legend: 'Space', w: 6.25 }, { legend: 'AltGr', w: 1.25 }, { legend: 'Win', w: 1.25 },
    { legend: 'Menu', w: 1.25 }, { legend: 'Ctrl', w: 1.25 },
  ];
  row5.forEach((k, i) => {
    keys.push({ id: `key-${keyId++}`, row: 4, col: i, width: k.w, height: 1, x, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: k.legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
    x += k.w;
  });

  return { id: 'ISO-60%', name: '%60 (ISO)', keys, totalKeys: keys.length, width: 15, height: 5 };
};

export const keyboardLayouts: Record<string, KeyboardLayout> = {
  '60%-ANSI': generate60Layout(),
  '60%-ISO': generateISO60Layout(),
  '65%-ANSI': ((): KeyboardLayout => {
    // Build 65% based on the user spec in units
    const keys: any[] = [];
    let keyId = 0;

    const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
      keys.push({
        id: `key-${keyId++}`,
        row: y,
        col: Math.floor(x),
        width: w,
        height: h,
        x,
        y,
        color: '#FFFFFF',
        textColor: '#000000',
        layers: [{
          id: `layer-${keyId}-0`,
          type: 'text',
          content: legend,
          alignment: 'center',
          verticalAlignment: 'center',
          offsetX: 0,
          offsetY: -4,
        }],
      });
    };

    // Row indices y=0..4
    // R4 (top): ESC (1), 1–0 (10), -, = (2), Backspace (2), Del (1)
    let x = 0; let y = 0;
    addKey('ESC', x, y); x += 1;
    const nums = ['1','2','3','4','5','6','7','8','9','0','-','='];
    nums.forEach(n => { addKey(n, x, y); x += 1; });
    addKey('Backspace', x, y, 2); x += 2;
    addKey('Del', x, y);

    // R3: Tab 1.5, Q..P, [, ], \\ 1.5, Home 1
    x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
    const qrow = ['Q','W','E','R','T','Y','U','I','O','P','[',']'];
    qrow.forEach(k => { addKey(k, x, y); x += 1; });
    addKey('\\', x, y, 1.5); x += 1.5;
    addKey('Home', x, y);

    // R2: Caps 1.75, A..;, ', Enter 2.25, End 1
    x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
    const arow = ['A','S','D','F','G','H','J','K','L',';','\''];
    arow.forEach(k => { addKey(k, x, y); x += 1; });
    addKey('Enter', x, y, 2.25); x += 2.25;
    addKey('End', x, y);

    // R1: LShift 2.25, Z..M, , . /, RShift 1.75, Up 1, [Empty] 1
    x = 0; y = 3; addKey('Shift', x, y, 2.25); x += 2.25;
    const zrow = ['Z','X','C','V','B','N','M',',','.','/'];
    zrow.forEach(k => { addKey(k, x, y); x += 1; });
    addKey('Shift', x, y, 1.75); x += 1.75;
    addKey('↑', x, y); x += 1;
    // Extra empty key to the right of Up
    addKey('', x, y);

    // Bottom: Ctrl 1.25, Win 1.25, Alt 1.25, Space 6.25, AltGr 1, FN 1, CTRL 1, ← 1, ↓ 1, → 1
    x = 0; y = 4;
    addKey('Ctrl', x, y, 1.25); x += 1.25;
    addKey('Win', x, y, 1.25); x += 1.25;
    addKey('Alt', x, y, 1.25); x += 1.25;
    addKey('Space', x, y, 6.25); x += 6.25;
    addKey('AltGr', x, y); x += 1;
    addKey('FN', x, y); x += 1;
    addKey('CTRL', x, y); x += 1;
    addKey('←', x, y); x += 1;
    addKey('↓', x, y); x += 1;
    addKey('→', x, y);

    return {
      id: '65%',
      name: '%65',
      keys,
      totalKeys: keys.length,
      width: 17.5,
      height: 5,
    } as KeyboardLayout;
  })(),
  '65%-ISO': ((): KeyboardLayout => {
    const base = build65_ISO_helper();
    return { ...base, id: '65%-ISO', name: '%65 (ISO)' };
  })(),
  '65% #2-ANSI': ((): KeyboardLayout => {
    const keys: any[] = [];
    let keyId = 0;
    const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
      keys.push({
        id: `key-${keyId++}`,
        row: y,
        col: Math.floor(x),
        width: w,
        height: h,
        x,
        y,
        color: '#FFFFFF',
        textColor: '#000000',
        layers: [{
          id: `layer-${keyId}-0`,
          type: 'text',
          content: legend,
          alignment: 'center',
          verticalAlignment: 'center',
          offsetX: 0,
          offsetY: -4,
        }],
      });
    };

    // Copy rows R4..R1 from 65%
    let x = 0; let y = 0;
    addKey('ESC', x, y); x += 1;
    const nums = ['1','2','3','4','5','6','7','8','9','0','-','='];
    nums.forEach(n => { addKey(n, x, y); x += 1; });
    addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y);

    x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
    const qrow = ['Q','W','E','R','T','Y','U','I','O','P','[',']'];
    qrow.forEach(k => { addKey(k, x, y); x += 1; });
    addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y);

    x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
    const arow = ['A','S','D','F','G','H','J','K','L',';','\''];
    arow.forEach(k => { addKey(k, x, y); x += 1; });
    addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y);

    x = 0; y = 3; addKey('Shift', x, y, 2.25); x += 2.25;
    const zrow = ['Z','X','C','V','B','N','M',',','.','/'];
    zrow.forEach(k => { addKey(k, x, y); x += 1; });
    addKey('Shift', x, y, 1.75); x += 1.75; 
    const upX = x; // record Up arrow x for alignment
    addKey('↑', upX, y); x = upX + 1; addKey('', x, y);

    // Bottom row variant: two 1.25u keys after Space, then a visibly wider gap, then arrows
    x = 0; y = 4;
    addKey('Ctrl', x, y, 1.25); x += 1.25;
    addKey('Win', x, y, 1.25); x += 1.25;
    addKey('Alt', x, y, 1.25); x += 1.25;
    addKey('Space', x, y, 6.25); x += 6.25;
    addKey('AltGr', x, y, 1.25); x += 1.25;
    addKey('Fn', x, y, 1.25); x += 1.25;
    // Align arrows with Up: left at upX-1, down at upX, right at upX+1
    addKey('←', upX - 1, y, 1);
    addKey('↓', upX, y, 1);
    addKey('→', upX + 1, y, 1);

    return {
      id: '65% #2',
      name: '%65 #2',
      keys,
      totalKeys: keys.length,
      width: 18,
      height: 5,
    } as KeyboardLayout;
  })(),
  '65% #2-ISO': build65_2_ISO_helper(),
  'thockfactory-60': thockFactory60Layout,
  'TKL-ANSI': generateTKLLayout(),
  'TKL-ISO': generateTKLISOLayout(),
  'Full-ANSI': generateFullLayout(),
  'Full-ISO': generateFullISOLayout(),
  '75% #1-ANSI': ((): KeyboardLayout => {
    const keys: any[] = [];
    let keyId = 0;
    let maxX = 0;
    const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
      keys.push({
        id: `key-${keyId++}`,
        row: y,
        col: Math.floor(x),
        width: w,
        height: h,
        x,
        y,
        color: '#FFFFFF',
        textColor: '#000000',
        layers: [{
          id: `layer-${keyId}-0`,
          type: 'text',
          content: legend,
          alignment: 'center',
          verticalAlignment: 'center',
          offsetX: 0,
          offsetY: -4,
        }],
      });
      if (x + w > maxX) maxX = x + w;
    };

    // JSON rows, use unit increments with equal gaps
    let x = 0; let y = 0;
    // Row R4 function row
    ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert']
      .forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });

    // Top number row
    y = 1; x = 0;
    ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
    addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);

    // R3
    y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5;
    ;['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y, 1);

    // R2
    y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75;
    ;['A','S','D','F','G','H','J','K','L',';','\''] .forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
    addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y, 1);

    // R1
    y = 4; x = 0; addKey('Shift', x, y, 2.25); x += 2.25;
    ;['Z','X','C','V','B','N','M',',','.','/'] .forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
    addKey('RShift', x, y, 1.75); x += 1.75; const upX_75_1 = x; addKey('↑', upX_75_1, y, 1); x = upX_75_1 + 1; addKey('PgUp', x, y, 1);

    // Bottom R1
    y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25;
    addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1); x += 1; addKey('Fn', x, y, 1); x += 1; addKey('Ctrl', x, y, 1); x += 1;
    // Align arrow cluster with Up: left at upX-1, down at upX, right at upX+1
    addKey('←', upX_75_1 - 1, y, 1);
    addKey('↓', upX_75_1, y, 1);
    addKey('→', upX_75_1 + 1, y, 1);

    return {
      id: '75% #1',
      name: '%75',
      keys,
      totalKeys: keys.length,
      width: Math.max(maxX, x),
      height: 6,
    } as KeyboardLayout;
  })(),
  '75% #1-ISO': build75_1_ISO_helper(),
  '75% #2-ANSI': ((): KeyboardLayout => {
    // Build from 75% #1 specification with bottom row change
    const keys: any[] = [];
    let keyId = 0; let maxX = 0;
    const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
      keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: -4 }] });
      if (x + w > maxX) maxX = x + w;
    };
    let x = 0; let y = 0;
    ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
    y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; ['Q','W','E','R','T','Y','U','I','O','P','[',']'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y, 1);
    y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; ['A','S','D','F','G','H','J','K','L',';','\''].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y, 1);
    y = 4; x = 0; addKey('Shift', x, y, 2.25); x += 2.25; ['Z','X','C','V','B','N','M',',','.','/'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); const upX_75_2_shiftEnd = x; addKey('RShift', upX_75_2_shiftEnd, y, 1.75); const upX_75_2 = upX_75_2_shiftEnd + 1.75; addKey('↑', upX_75_2, y, 1); addKey('PgUp', upX_75_2 + 1, y, 1);
    // Bottom row variant: AltGr 1.25u, Fn 1.25u, no right Ctrl
    y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1.25); x += 1.25; addKey('Fn', x, y, 1.25); x += 1.25; addKey('←', upX_75_2 - 1, y, 1); addKey('↓', upX_75_2, y, 1); addKey('→', upX_75_2 + 1, y, 1);
    return { id: '75% #2', name: '%75 #2', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
  })(),
  '75% #2-ISO': build75_2_ISO_helper(),
};