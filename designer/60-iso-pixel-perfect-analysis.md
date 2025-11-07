# 60% ISO SVG Pixel Perfect Analiz

## SVG Keycap Analizi (Pixel Bazlı)

### Genel Bilgiler
- **SVG boyutu**: 820x280 piksel
- **Standart keycap**: 52x52 piksel
- **Inner keycap**: 40x40 piksel
- **1 unit = 54 piksel** (52 + 2 border)

### Row 1 (Y=1): Numbers Row
- **14 keycap**
- **Pozisyonlar**: x=1, 55, 109, 163, 217, 271, 325, 379, 433, 487, 541, 595, 649, 703
- **Boyutlar**: 13 adet 52x52, 1 adet 106x52 (Backspace)
- **Backspace**: x=703, width=106 (2 unit)

### Row 2 (Y=55): QWERTY Row
- **14 keycap**
- **Pozisyonlar**: x=1, 82, 136, 190, 244, 298, 352, 406, 460, 514, 568, 622, 676, 730
- **Boyutlar**: 1 adet 79x52 (Tab), 12 adet 52x52, 1 adet 65.5x106 (Enter)
- **Tab**: x=1, width=79 (1.5 unit)
- **Enter**: x=730, width=65.5, height=106 (1.25 unit x 2 unit)

### Row 3 (Y=109): ASDF Row
- **13 keycap**
- **Pozisyonlar**: x=1, 95.5, 149.5, 203.5, 257.5, 311.5, 365.5, 419.5, 473.5, 527.5, 581.5, 635.5, 689.5
- **Boyutlar**: 1 adet 92.5x52 (Caps Lock), 12 adet 52x52
- **Caps Lock**: x=1, width=92.5 (1.75 unit)

### Row 4 (Y=163): ZXCV Row
- **13 keycap**
- **Pozisyonlar**: x=1, 68.5, 122.5, 176.5, 230.5, 284.5, 338.5, 392.5, 446.5, 500.5, 554.5, 608.5, 662.5
- **Boyutlar**: 1 adet 65.5x52 (Left Shift), 11 adet 52x52, 1 adet 146.5x52 (Right Shift)
- **Left Shift**: x=1, width=65.5 (1.25 unit)
- **Right Shift**: x=662.5, width=146.5 (2.75 unit)

### Row 5 (Y=217): Bottom Row
- **8 keycap**
- **Pozisyonlar**: x=1, 68.5, 136, 203.5, 541, 608.5, 676, 743.5
- **Boyutlar**: 3 adet 65.5x52, 1 adet 335.5x52 (Space), 4 adet 65.5x52
- **Space**: x=203.5, width=335.5 (6.2 unit)

### Özel Keycap'ler

#### Enter Tuşu (Ters L Şekli)
- **Ana kısım**: x=730, y=55, width=65.5, height=106
- **2 satır yüksekliğinde**: Row 2 ve Row 3'ü kaplıyor
- **Unit cinsinden**: 1.25 unit genişlik x 2 unit yükseklik

#### Space Tuşu
- **Boyut**: width=335.5, height=52
- **Pozisyon**: x=203.5, y=217
- **Unit cinsinden**: 6.2 unit

### Unit Hesaplaması
- **1 unit = 54 piksel** (52 + 2 border)
- **Enter**: 65.5 piksel = 1.21 unit
- **Space**: 335.5 piksel = 6.21 unit
- **Tab**: 79 piksel = 1.46 unit
- **Caps Lock**: 92.5 piksel = 1.71 unit
- **Left Shift**: 65.5 piksel = 1.21 unit
- **Right Shift**: 146.5 piksel = 2.71 unit

### Sağ Kenar Hizası
- **Row 1**: Backspace (x=703, width=106) → sağ kenar x=809
- **Row 2**: Enter (x=730, width=65.5) → sağ kenar x=795.5
- **Row 3**: Son keycap (x=689.5, width=52) → sağ kenar x=741.5
- **Row 4**: Right Shift (x=662.5, width=146.5) → sağ kenar x=809
- **Row 5**: Right Ctrl (x=743.5, width=65.5) → sağ kenar x=809

### Layout Boyutları
- **Toplam genişlik**: 15 unit (810 piksel)
- **Toplam yükseklik**: 5 satır (270 piksel)
- **Toplam keycap**: 61 adet
