# 60% ISO SVG Analiz Raporu

## SVG Dosyası: 60-iso.svg

### Genel Bilgiler
- **Toplam boyut**: 820x280 piksel
- **Keycap boyutu**: 52x52 piksel (standart keycap)
- **Inner keycap boyutu**: 40x40 piksel
- **Border kalınlığı**: 6 piksel (outer), 3 piksel (inner)

### Keycap Analizi

#### Row 1 (Y=1): Numbers Row
- **14 keycap** (1-13: 52x52, 14: 106x52 - Backspace)
- **Pozisyonlar**: x=1, 55, 109, 163, 217, 271, 325, 379, 433, 487, 541, 595, 649, 703
- **Backspace**: width=106 (2 unit), x=703

#### Row 2 (Y=55): QWERTY Row  
- **14 keycap** (1: 79x52 - Tab, 2-13: 52x52, 14: 106x52 - Enter)
- **Pozisyonlar**: x=1, 82, 136, 190, 244, 298, 352, 406, 460, 514, 568, 622, 676, 730
- **Tab**: width=79 (1.5 unit), x=1
- **Enter**: width=106 (2 unit), x=730

#### Row 3 (Y=109): ASDF Row
- **13 keycap** (1: 92.5x52 - Caps Lock, 2-13: 52x52)
- **Pozisyonlar**: x=1, 95.5, 149.5, 203.5, 257.5, 311.5, 365.5, 419.5, 473.5, 527.5, 581.5, 635.5, 689.5
- **Caps Lock**: width=92.5 (1.75 unit), x=1

#### Row 4 (Y=163): ZXCV Row
- **13 keycap** (1: 65.5x52 - Left Shift, 2-12: 52x52, 13: 146.5x52 - Right Shift)
- **Pozisyonlar**: x=1, 68.5, 122.5, 176.5, 230.5, 284.5, 338.5, 392.5, 446.5, 500.5, 554.5, 608.5, 662.5
- **Left Shift**: width=65.5 (1.25 unit), x=1
- **Right Shift**: width=146.5 (2.75 unit), x=662.5

#### Row 5 (Y=217): Bottom Row
- **8 keycap** (1-3: 65.5x52, 4: 335.5x52 - Space, 5-8: 65.5x52)
- **Pozisyonlar**: x=1, 68.5, 136, 203.5, 541, 608.5, 676, 743.5
- **Space**: width=335.5 (6.25 unit), x=203.5

### Özel Keycap'ler

#### Enter Tuşu (Ters L Şekli)
- **Ana kısım**: x=730, y=55, width=79, height=52
- **Alt kısım**: x=743.5, y=55, width=65.5, height=106
- **Toplam boyut**: 2 unit genişlik, 2 unit yükseklik
- **Özel yapı**: İki ayrı rect ile oluşturulmuş

#### Space Tuşu
- **Boyut**: width=335.5, height=52
- **Pozisyon**: x=203.5, y=217
- **Unit cinsinden**: 6.25 unit (çok geniş)

### Unit Hesaplaması
- **1 unit = 54 piksel** (52 + 2 border)
- **Gap**: 3 piksel keycap'ler arası

### Mevcut Layout ile Karşılaştırma

#### Sorunlar:
1. **Enter tuşu**: Ters L şekli eksik - sadece 1.5 unit olarak tanımlanmış, 2x2 unit olmalı
2. **Space tuşu**: 6.25 unit olarak tanımlanmış ama SVG'de 335.5 piksel = 6.2 unit
3. **Tab tuşu**: 1.5 unit doğru
4. **Caps Lock**: 1.75 unit doğru
5. **Shift tuşları**: Left 1.25, Right 2.75 unit doğru

### Düzeltilmesi Gerekenler:
1. Enter tuşunu 2x2 unit yapmak (height=2 eklemek)
2. Space tuşunu 6.2 unit yapmak
3. Tüm pozisyonları SVG'ye göre düzeltmek
