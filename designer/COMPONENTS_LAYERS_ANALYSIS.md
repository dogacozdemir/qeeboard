# Components & Layers Konteynırı Görüntüleme Analizi

## Genel Bakış

`LayerManager` komponenti, sidebar'daki "Components & Layers" konteynırında iki farklı görüntüleme modu kullanır. Bu modlar, keycap seçim durumuna göre otomatik olarak değişir.

---

## 1. Keycap Seçildiğinde Oluşan Görüntüleme

### Koşul
```typescript
(isMultiSelection || (selectedKeys && selectedKeys.length === 1)) && multiSelectionStats
```

### Ne Zaman Aktif Olur?
- Tek bir keycap seçildiğinde (`selectedKeys.length === 1`)
- VEYA birden fazla keycap seçildiğinde (`isMultiSelection === true`)
- VE `multiSelectionStats` null değilse

### Nasıl Çalışır?

**Index.tsx'te (satır 315-343):**
```typescript
const currentKeyLayers = editingKeyId ? getKeyLayers(editingKeyId) : [];
const isMultiSelection = config.selectedKeys.length > 1;
const multiSelectionStats = activeKeys.length > 0 ? (() => {
  let textCount = 0;
  let iconCount = 0;
  let imageCount = 0;
  activeKeys.forEach(keyId => {
    const layers = getKeyLayers(keyId);
    layers.forEach(layer => {
      if (layer.type === 'text') textCount++;
      else if (layer.type === 'icon') iconCount++;
      else if (layer.type === 'image') imageCount++;
    });
  });
  return { text: textCount, icon: iconCount, image: imageCount };
})() : null;
```

**UnifiedSidebar'a geçirilen props (satır 914-915):**
```typescript
editingKeyId={isMultiSelection ? null : editingKeyId}
currentKeyLayers={isMultiSelection ? [] : currentKeyLayers}
```

**LayerManager.tsx'te render (satır 232-310):**
- İstatistik görünümü gösterilir
- "Keycaps (Nx)" başlığı
- Her layer tipi için sayısal istatistikler:
  - "Text (Nx)" - eğer text layer'ları varsa
  - "Icon (Nx)" - eğer icon layer'ları varsa
  - "Image (Nx)" - eğer image layer'ları varsa
- Her istatistik tıklanabilir ve ilgili layer'ları seçer

### Görsel Yapı
```
┌─────────────────────────┐
│ Keycaps (1x)            │ ← Tıklanabilir, tüm layer'ları seçer
├─────────────────────────┤
│   📝 Text (2x)          │ ← Tıklanabilir, sadece text layer'ları seçer
│   🎨 Icon (1x)          │ ← Tıklanabilir, sadece icon layer'ları seçer
│   🖼️ Image (0x)         │ ← Görünmez (sayı 0 ise)
└─────────────────────────┘
```

### Özellikler
- **İstatistiksel görünüm**: Layer'ların detaylarını değil, sayılarını gösterir
- **Toplu seçim**: Tüm layer'ları veya belirli tip layer'ları seçebilme
- **Multi-selection desteği**: Birden fazla keycap seçildiğinde de çalışır

---

## 2. Keycap Deselect Edildiğinde Oluşan Görüntüleme

### Koşul
```typescript
layers.length === 0
```

### Ne Zaman Aktif Olur?
- Hiç keycap seçili değilken (`selectedKeys.length === 0`)
- VEYA seçili keycap'in layer'ları yoksa (`currentKeyLayers.length === 0`)
- VE ilk koşul sağlanmıyorsa (yani `multiSelectionStats` null veya koşul false)

### Nasıl Çalışır?

**Index.tsx'te:**
```typescript
// Keycap deselect edildiğinde
editingKeyId = null
currentKeyLayers = [] // Boş array
selectedKeys.length = 0
multiSelectionStats = null // activeKeys.length === 0 olduğu için
```

**UnifiedSidebar'a geçirilen props:**
```typescript
editingKeyId={isMultiSelection ? null : editingKeyId} // null
currentKeyLayers={isMultiSelection ? [] : currentKeyLayers} // []
```

**LayerManager.tsx'te render (satır 311-314):**
```typescript
) : layers.length === 0 ? (
  <p className="text-sm text-muted-foreground text-center py-4">
    No layers yet. Click + to add one.
  </p>
) : (
```

### Görsel Yapı
```
┌─────────────────────────┐
│                         │
│  No layers yet.         │
│  Click + to add one.    │
│                         │
└─────────────────────────┘
```

### Özellikler
- **Boş durum mesajı**: Kullanıcıya layer eklemesi gerektiğini hatırlatır
- **Basit görünüm**: Sadece bilgilendirici mesaj
- **Add butonları görünür**: Üstteki Type, Image, Palette butonları hala görünür

---

## 3. Alternatif Görüntüleme: Detaylı Layer Listesi

### Koşul
```typescript
// İlk iki koşul sağlanmıyorsa VE layers.length > 0
```

### Ne Zaman Aktif Olur?
- Tek keycap seçili (`selectedKeys.length === 1`)
- `editingKeyId` set edilmiş
- `currentKeyLayers` dolu
- AMA `multiSelectionStats` null veya koşul false ise
- Bu durum normalde oluşmaz çünkü tek keycap seçildiğinde `multiSelectionStats` hesaplanır

**LayerManager.tsx'te render (satır 316-406):**
- Her layer için detaylı kart gösterilir
- Layer tipi ikonu (Type, Image, Palette)
- Layer içeriği (text için içerik, icon için icon adı, image için "Image")
- Up/Down butonları (sıralama için)
- Delete butonu (X)

### Görsel Yapı
```
┌─────────────────────────┐
│ 📝 "Hello World"    ↑↓✕ │
│ 🎨 Icon: home       ↑↓✕ │
│ 🖼️ Image            ↑↓✕ │
└─────────────────────────┘
```

---

## Render Mantığı Özeti

```typescript
// LayerManager.tsx satır 232-407
{(isMultiSelection || (selectedKeys && selectedKeys.length === 1)) && multiSelectionStats ? (
  // MOD 1: İstatistik görünümü (keycap seçildiğinde)
  <div className="space-y-2">
    <div>Keycaps ({selectedKeys.length}x)</div>
    {multiSelectionStats.text > 0 && <div>Text ({multiSelectionStats.text}x)</div>}
    {multiSelectionStats.icon > 0 && <div>Icon ({multiSelectionStats.icon}x)</div>}
    {multiSelectionStats.image > 0 && <div>Image ({multiSelectionStats.image}x)</div>}
  </div>
) : layers.length === 0 ? (
  // MOD 2: Boş durum mesajı (deselect edildiğinde)
  <p>No layers yet. Click + to add one.</p>
) : (
  // MOD 3: Detaylı layer listesi (normalde oluşmaz)
  <div className="space-y-2">
    {layers.map((layer, index) => (
      <div key={layer.id}>
        {/* Layer detayları */}
      </div>
    ))}
  </div>
)}
```

---

## State Akışı

### Keycap Seçildiğinde:
1. `handleKeySelect` çağrılır (Index.tsx:397)
2. `selectKey(keyId, false)` → `config.selectedKeys` güncellenir
3. `startEditingKey(keyId)` → `editingKeyId` set edilir
4. `currentKeyLayers = getKeyLayers(editingKeyId)` → Layer'lar alınır
5. `multiSelectionStats` hesaplanır (tek keycap için)
6. `isMultiSelection = false` (tek keycap seçili)
7. Koşul: `(false || (true && true)) && multiSelectionStats` = `true`
8. **MOD 1** gösterilir (İstatistik görünümü)

### Keycap Deselect Edildiğinde:
1. `config.selectedKeys` boş array olur
2. `editingKeyId = null` (useEffect ile temizlenir)
3. `currentKeyLayers = []` (editingKeyId null olduğu için)
4. `multiSelectionStats = null` (activeKeys.length === 0)
5. `isMultiSelection = false`
6. Koşul: `(false || (false && false)) && null` = `false`
7. `layers.length === 0` kontrolü: `true`
8. **MOD 2** gösterilir (Boş durum mesajı)

---

## Önemli Notlar

1. **`currentKeyLayers` prop'u**: UnifiedSidebar'a geçirilirken, multi-selection durumunda boş array olarak geçirilir (satır 915). Bu, tek keycap seçildiğinde layer'ların gösterilmemesini sağlar.

2. **`multiSelectionStats` hesaplama**: Sadece `activeKeys.length > 0` olduğunda hesaplanır. Deselect durumunda null olur.

3. **Koşul mantığı**: İlk koşul (`isMultiSelection || selectedKeys.length === 1`) tek keycap seçildiğinde true olur, ama `multiSelectionStats` null ise tüm koşul false olur.

4. **Layer listesi görünümü**: Normalde tek keycap seçildiğinde istatistik görünümü gösterilir. Detaylı layer listesi görünümü sadece özel durumlarda (muhtemelen bug) oluşabilir.

---

## Kod Referansları

- **LayerManager.tsx**: Satır 232-407 (render mantığı)
- **Index.tsx**: Satır 315-343 (state hesaplama)
- **Index.tsx**: Satır 914-915 (prop geçirme)
- **Index.tsx**: Satır 397-425 (keycap seçim handler'ı)

