import { KeyboardLayout, LayoutOption, KeyboardLanguage } from '@/types/keyboard';
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
const generate60Layout = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
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
        offsetY: 0,
      }],
    });
    x += width;
  });

  // Row 2 (Tab and QWERTY) - Language specific
  const row2Keys = language === 'TR' 
    ? ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü', '\\']
    : ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'];
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
        offsetY: 0,
      }],
    });
    x += width;
  });

  // Row 3 (Caps Lock and ASDF) - Language specific
  const row3Keys = language === 'TR'
    ? ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', "İ", 'Enter']
    : ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'];
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
        offsetY: 0,
      }],
    });
    x += width;
  });

  // Row 4 (Shift and ZXCV) - Language specific
  const row4Keys = language === 'TR'
    ? ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', ':', 'Shift']
    : ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'];
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
        offsetY: 0,
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
        offsetY: 0,
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
const generateTKLLayout = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
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
        offsetY: 0,
      }],
    });
  });

  // Main 60% section (offset by 1 row)
  const sixtyLayout = generate60Layout(language);
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
        offsetY: 0,
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
const generateTKLISOLayout = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
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
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }],
    });
  });

  // Main 60% ISO section (offset by 1.5 rows)
  const sixtyISO = generateISO60Layout(language);
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
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }],
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
const generateFullLayout = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const tklLayout = generateTKLLayout(language);
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
        offsetY: 0,
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

const generateFullISOLayout = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const tklISO = generateTKLISOLayout(language);
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
    keys.push({ id: `key-${keyId++}`, row: Math.floor(y), col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
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
const build65_ANSI_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
    keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
  };
  // Row indices y=0..4
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  ['1','2','3','4','5','6','7','8','9','0','-','='].forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y);
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  getRow2Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y);
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  getRow3Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y);
  x = 0; y = 3; addKey('Shift', x, y, 2.25); x += 2.25;
  getRow4Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Shift', x, y, 1.75); x += 1.75; const upX = x; addKey('↑', upX, y); x = upX + 1; addKey('', x, y);
  x = 0; y = 4; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y); x += 1; addKey('FN', x, y); x += 1; addKey('CTRL', x, y); x += 1; addKey('←', x, y); x += 1; addKey('↓', x, y); x += 1; addKey('→', x, y);
  return { id: '65%-ANSI', name: '%65', keys, totalKeys: keys.length, width: 17.5, height: 5 } as KeyboardLayout;
};

const build65_ISO_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => {
    keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
  };
  // Top row
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  ['1','2','3','4','5','6','7','8','9','0','-','='].forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; 
  const delX = x; addKey('Del', delX, y);
  // Row with Tab: ISO Enter top piece at row end (height 2), no trailing backslash
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  getRow2Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  // ISO Enter top segment (1.5u x 2u)
  addKey('Enter', x, y, 1.5, 2); x += 1.5;
  // Home should be in same column as Del (delX), which is after Backspace (x=14)
  addKey('Home', delX, y);
  // Caps row: Enter bottom is '#' key
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  getRow3Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('#', x, y, 1); 
  // End should be in same column as Del and Home (delX)
  addKey('End', delX, y);
  // ISO left Shift short (1.25) + extra backslash key next to it
  x = 0; y = 3; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1;
  getRow4Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Shift', x, y, 1.75); x += 1.75; const upX = x; addKey('↑', upX, y); x = upX + 1; addKey('', x, y);
  // Bottom row
  x = 0; y = 4; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y); x += 1; addKey('FN', x, y); x += 1; addKey('CTRL', x, y); x += 1; addKey('←', x, y); x += 1; addKey('↓', x, y); x += 1; addKey('→', x, y);
  return { id: '65%-ISO', name: '%65 (ISO)', keys, totalKeys: keys.length, width: 17.5, height: 5 } as KeyboardLayout;
};
const build65_2_ANSI_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
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
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }],
    });
  };
  // Copy rows R4..R1 from 65%
  let x = 0; let y = 0;
  addKey('ESC', x, y); x += 1;
  const nums = ['1','2','3','4','5','6','7','8','9','0','-','='];
  nums.forEach(n => { addKey(n, x, y); x += 1; });
  addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y);
  x = 0; y = 1; addKey('Tab', x, y, 1.5); x += 1.5;
  getRow2Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y);
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  getRow3Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y);
  x = 0; y = 3; addKey('Shift', x, y, 2.25); x += 2.25;
  getRow4Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
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

const build75_1_ANSI_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; getRow2Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y, 1);
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; getRow3Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y, 1);
  y = 4; x = 0; addKey('Shift', x, y, 2.25); x += 2.25; getRow4Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('RShift', x, y, 1.75); x += 1.75; const upX_75_1 = x; addKey('↑', upX_75_1, y, 1); x = upX_75_1 + 1; addKey('PgUp', x, y, 1);
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1); x += 1; addKey('Fn', x, y, 1); x += 1; addKey('Ctrl', x, y, 1); x += 1; addKey('←', upX_75_1 - 1, y, 1); addKey('↓', upX_75_1, y, 1); addKey('→', upX_75_1 + 1, y, 1);
  return { id: '75% #1-ANSI', name: '%75', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

const build75_1_ISO_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0; let navX = -1;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  // Row with Tab: true ISO Enter top piece at the row end (height 2)
  // Remove trailing backslash here (moved next to left Shift)
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; getRow2Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  // ISO Enter top segment (like 60% ISO), 1.5u wide and 2 rows tall
  // Place the Enter top segment; then fix a navigation column to its right
  addKey('Enter', x, y, 1.5, 2); x += 1.5; navX = x; addKey('Home', navX, y, 1);
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; getRow3Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  // ISO: no long Enter on this row; place '#' under where ANSI had Enter-left
  // Place 'End' aligned to navigation column set on the row above
  addKey('#', x, y, 1);
  if (navX < 0) { navX = x + 2; }
  addKey('End', navX, y, 1);
  // ISO left Shift short + extra backslash
  y = 4; x = 0; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1; getRow4Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('RShift', x, y, 1.75); x += 1.75; const upX_75_1 = x; addKey('↑', upX_75_1, y, 1); x = upX_75_1 + 1; addKey('PgUp', x, y, 1);
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1); x += 1; addKey('Fn', x, y, 1); x += 1; addKey('Ctrl', x, y, 1); x += 1; addKey('←', upX_75_1 - 1, y, 1); addKey('↓', upX_75_1, y, 1); addKey('→', upX_75_1 + 1, y, 1);
  return { id: '75% #1-ISO', name: '%75 (ISO)', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

const build65_2_ISO_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
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
      layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }],
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
  getRow2Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  // ISO Enter top segment (1.5u x 2u)
  addKey('Enter', x, y, 1.5, 2); 
  // Home should be in same column as Del (delX), which is after Backspace (x=14)
  addKey('Home', delX, y);
  // Caps row: Enter bottom is '#' key
  x = 0; y = 2; addKey('CapsLock', x, y, 1.75); x += 1.75;
  getRow3Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
  addKey('#', x, y, 1); 
  // End should be in same column as Del and Home (delX), not after '#'
  addKey('End', delX, y);
  // ISO left Shift short (1.25u) + backslash next to it
  x = 0; y = 3; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1;
  getRow4Keys(language).forEach(k => { addKey(k, x, y); x += 1; });
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

const build75_2_ANSI_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; getRow2Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('\\\\', x, y, 1.5); x += 1.5; addKey('Home', x, y, 1);
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; getRow3Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Enter', x, y, 2.25); x += 2.25; addKey('End', x, y, 1);
  y = 4; x = 0; addKey('Shift', x, y, 2.25); x += 2.25; getRow4Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); const upX_75_2_shiftEnd = x; addKey('RShift', upX_75_2_shiftEnd, y, 1.75); const upX_75_2 = upX_75_2_shiftEnd + 1.75; addKey('↑', upX_75_2, y, 1); addKey('PgUp', upX_75_2 + 1, y, 1);
  // Bottom row variant: AltGr 1.25u, Fn 1.25u, no right Ctrl
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1.25); x += 1.25; addKey('Fn', x, y, 1.25); x += 1.25; addKey('←', upX_75_2 - 1, y, 1); addKey('↓', upX_75_2, y, 1); addKey('→', upX_75_2 + 1, y, 1);
  return { id: '75% #2-ANSI', name: '%75 #2', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

const build75_2_ISO_helper = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys: any[] = []; let keyId = 0; let maxX = 0; let navX = -1;
  const addKey = (legend: string, x: number, y: number, w = 1, h = 1) => { keys.push({ id: `key-${keyId++}`, row: y, col: Math.floor(x), width: w, height: h, x, y, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] }); if (x + w > maxX) maxX = x + w; };
  let x = 0; let y = 0; ['ESC','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','PrtSc','ScrLk','Insert'].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  y = 1; x = 0; ['~','1','2','3','4','5','6','7','8','9','0','-','='].forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); addKey('Backspace', x, y, 2); x += 2; addKey('Del', x, y, 1);
  // Row with Tab: ISO Enter top piece at row end (height 2), no trailing backslash
  y = 2; x = 0; addKey('Tab', x, y, 1.5); x += 1.5; getRow2Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  // ISO Enter top segment (1.5u x 2u)
  addKey('Enter', x, y, 1.5, 2); x += 1.5; navX = x; addKey('Home', navX, y, 1);
  // Caps row: Enter bottom is '#' key
  y = 3; x = 0; addKey('Caps', x, y, 1.75); x += 1.75; getRow3Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; });
  addKey('#', x, y, 1); if (navX < 0) { navX = x + 2; } addKey('End', navX, y, 1);
  // ISO left Shift short (1.25u) + backslash next to it
  y = 4; x = 0; addKey('Shift', x, y, 1.25); x += 1.25; addKey('\\\\', x, y, 1); x += 1; getRow4Keys(language).forEach(lbl => { addKey(lbl, x, y, 1); x += 1; }); const upX_75_2_shiftEnd = x; addKey('RShift', upX_75_2_shiftEnd, y, 1.75); const upX_75_2 = upX_75_2_shiftEnd + 1.75; addKey('↑', upX_75_2, y, 1); addKey('PgUp', upX_75_2 + 1, y, 1);
  // Bottom row: AltGr 1.25u, Fn 1.25u, no right Ctrl (same as ANSI)
  y = 5; x = 0; addKey('Ctrl', x, y, 1.25); x += 1.25; addKey('Win', x, y, 1.25); x += 1.25; addKey('Alt', x, y, 1.25); x += 1.25; addKey('Space', x, y, 6.25); x += 6.25; addKey('AltGr', x, y, 1.25); x += 1.25; addKey('Fn', x, y, 1.25); x += 1.25; addKey('←', upX_75_2 - 1, y, 1); addKey('↓', upX_75_2, y, 1); addKey('→', upX_75_2 + 1, y, 1);
  return { id: '75% #2-ISO', name: '%75 #2 (ISO)', keys, totalKeys: keys.length, width: Math.max(maxX, x), height: 6 } as KeyboardLayout;
};

// Generate ISO 60% layout with normalized keyboard units
const generateISO60Layout = (language: KeyboardLanguage = 'TR'): KeyboardLayout => {
  const keys = [];
  let keyId = 0;

  // Row 1: standard 1u keys, Backspace 2u
  let x = 0;
  ['`','1','2','3','4','5','6','7','8','9','0','-','='].forEach((legend, i) => {
    const w = legend === 'Backspace' ? 2 : 1;
    keys.push({ id: `key-${keyId++}`, row: 0, col: i, width: 1, height: 1, x, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
    x += 1;
  });
  // Backspace
  keys.push({ id: `key-${keyId++}`, row: 0, col: 13, width: 2, height: 1, x, y: 0, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: 'Backspace', alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });

  // Row 2: Tab 1.5u, Q..], Enter top 1.5u x 2u - Language specific
  x = 0;
  const row2Left = language === 'TR'
    ? ['Tab','Q','W','E','R','T','Y','U','I','O','P','Ğ','Ü']
    : ['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']'];
  row2Left.forEach((legend, i) => {
    const w = legend === 'Tab' ? 1.5 : 1;
    keys.push({ id: `key-${keyId++}`, row: 1, col: i, width: w, height: 1, x, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
    x += w;
  });
  // ISO Enter top segment
  keys.push({ id: `key-${keyId++}`, row: 1, col: row2Left.length, width: 1.5, height: 2, x, y: 1, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: 'Enter', alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });

  // Row 3: Caps 1.75u, A..', '#' - Language specific
  x = 0;
  const row3 = language === 'TR'
    ? [{ legend: 'Caps Lock', w: 1.75 }, 'A','S','D','F','G','H','J','K','L','Ş','İ', '#']
    : [{ legend: 'Caps Lock', w: 1.75 }, 'A','S','D','F','G','H','J','K','L',';','\'', '#'];
  row3.forEach((item, i) => {
    const legend = typeof item === 'string' ? item : item.legend;
    const w = typeof item === 'string' ? 1 : item.w;
    keys.push({ id: `key-${keyId++}`, row: 2, col: i, width: w, height: 1, x, y: 2, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
    x += w;
  });

  // Row 4: ISO left Shift 1.25u + backslash, ... , right Shift 2.75u - Language specific
  x = 0;
  const row4Left = language === 'TR'
    ? [{ legend: 'Shift', w: 1.25 }, { legend: '\\', w: 1 }, 'Z','X','C','V','B','N','M','Ö','Ç', ':']
    : [{ legend: 'Shift', w: 1.25 }, { legend: '\\', w: 1 }, 'Z','X','C','V','B','N','M',',','.', '/'];
  row4Left.forEach((item, i) => {
    const legend = typeof item === 'string' ? item : item.legend;
    const w = typeof item === 'string' ? 1 : item.w;
    keys.push({ id: `key-${keyId++}`, row: 3, col: i, width: w, height: 1, x, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
    x += w;
  });
  // Right Shift 2.75u
  keys.push({ id: `key-${keyId++}`, row: 3, col: row4Left.length, width: 2.75, height: 1, x, y: 3, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: 'Shift', alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });

  // Row 5: 1.25u,1.25u,1.25u,6.25u,1.25u,1.25u,1.25u,1.25u
  x = 0;
  const row5 = [
    { legend: 'Ctrl', w: 1.25 }, { legend: 'Win', w: 1.25 }, { legend: 'Alt', w: 1.25 },
    { legend: 'Space', w: 6.25 }, { legend: 'AltGr', w: 1.25 }, { legend: 'Win', w: 1.25 },
    { legend: 'Menu', w: 1.25 }, { legend: 'Ctrl', w: 1.25 },
  ];
  row5.forEach((k, i) => {
    keys.push({ id: `key-${keyId++}`, row: 4, col: i, width: k.w, height: 1, x, y: 4, color: '#FFFFFF', textColor: '#000000', layers: [{ id: `layer-${keyId}-0`, type: 'text', content: k.legend, alignment: 'center', verticalAlignment: 'center', offsetX: 0, offsetY: 0 }] });
    x += k.w;
  });

  return { id: 'ISO-60%', name: '%60 (ISO)', keys, totalKeys: keys.length, width: 15, height: 5 };
};

// Helper function to get language-specific row keys
const getRow2Keys = (language: KeyboardLanguage) => {
  return language === 'TR' 
    ? ['Q','W','E','R','T','Y','U','I','O','P','Ğ','Ü']
    : ['Q','W','E','R','T','Y','U','I','O','P','[',']'];
};

const getRow3Keys = (language: KeyboardLanguage) => {
  return language === 'TR'
    ? ['A','S','D','F','G','H','J','K','L','Ş','İ']
    : ['A','S','D','F','G','H','J','K','L',';','\''];
};

const getRow4Keys = (language: KeyboardLanguage) => {
  return language === 'TR'
    ? ['Z','X','C','V','B','N','M','Ö','Ç',':']
    : ['Z','X','C','V','B','N','M',',','.','/'];
};

export const keyboardLayouts: Record<string, KeyboardLayout> = {
  // 60% layouts
  '60%-ANSI-TR': generate60Layout('TR'),
  '60%-ANSI-EN': generate60Layout('EN'),
  '60%-ISO-TR': generateISO60Layout('TR'),
  '60%-ISO-EN': generateISO60Layout('EN'),
  // Legacy keys for backward compatibility
  '60%-ANSI': generate60Layout('TR'),
  '60%-ISO': generateISO60Layout('TR'),
  // 65% layouts
  '65%-ANSI-TR': build65_ANSI_helper('TR'),
  '65%-ANSI-EN': build65_ANSI_helper('EN'),
  '65%-ISO-TR': build65_ISO_helper('TR'),
  '65%-ISO-EN': build65_ISO_helper('EN'),
  // Legacy keys for backward compatibility
  '65%-ANSI': build65_ANSI_helper('TR'),
  '65%-ISO': ((): KeyboardLayout => {
    const base = build65_ISO_helper('TR');
    return { ...base, id: '65%-ISO', name: '%65 (ISO)' };
  })(),
  // 65% #2 layouts
  '65% #2-ANSI-TR': build65_2_ANSI_helper('TR'),
  '65% #2-ANSI-EN': build65_2_ANSI_helper('EN'),
  '65% #2-ISO-TR': build65_2_ISO_helper('TR'),
  '65% #2-ISO-EN': build65_2_ISO_helper('EN'),
  // Legacy keys for backward compatibility
  '65% #2-ANSI': build65_2_ANSI_helper('TR'),
  '65% #2-ISO': build65_2_ISO_helper('TR'),
  'thockfactory-60': thockFactory60Layout,
  // TKL layouts
  'TKL-ANSI-TR': generateTKLLayout('TR'),
  'TKL-ANSI-EN': generateTKLLayout('EN'),
  'TKL-ISO-TR': generateTKLISOLayout('TR'),
  'TKL-ISO-EN': generateTKLISOLayout('EN'),
  // Legacy keys for backward compatibility
  'TKL-ANSI': generateTKLLayout('TR'),
  'TKL-ISO': generateTKLISOLayout('TR'),
  // Full layouts
  'Full-ANSI-TR': generateFullLayout('TR'),
  'Full-ANSI-EN': generateFullLayout('EN'),
  'Full-ISO-TR': generateFullISOLayout('TR'),
  'Full-ISO-EN': generateFullISOLayout('EN'),
  // Legacy keys for backward compatibility
  'Full-ANSI': generateFullLayout('TR'),
  'Full-ISO': generateFullISOLayout('TR'),
  // 75% #1 layouts
  '75% #1-ANSI-TR': build75_1_ANSI_helper('TR'),
  '75% #1-ANSI-EN': build75_1_ANSI_helper('EN'),
  '75% #1-ISO-TR': build75_1_ISO_helper('TR'),
  '75% #1-ISO-EN': build75_1_ISO_helper('EN'),
  // Legacy keys for backward compatibility
  '75% #1-ANSI': build75_1_ANSI_helper('TR'),
  '75% #1-ISO': build75_1_ISO_helper('TR'),
  // 75% #2 layouts
  '75% #2-ANSI-TR': build75_2_ANSI_helper('TR'),
  '75% #2-ANSI-EN': build75_2_ANSI_helper('EN'),
  '75% #2-ISO-TR': build75_2_ISO_helper('TR'),
  '75% #2-ISO-EN': build75_2_ISO_helper('EN'),
  // Legacy keys for backward compatibility
  '75% #2-ANSI': build75_2_ANSI_helper('TR'),
  '75% #2-ISO': build75_2_ISO_helper('TR'),
};