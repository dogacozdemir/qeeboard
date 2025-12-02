# Production Build Sorunları - Çözüm Rehberi

## Sorun Analizi

Production sunucunuzda karşılaştığınız hatalar:

1. **Designer Build Hatası**: `socket.io-client` modülü bulunamıyor
2. **Backend Build Hataları**:
   - `socket.io` modülü bulunamıyor
   - `prisma.shareLink` bulunamıyor
   - `saved-colors.ts`'de `type` field hataları

## Kök Neden

1. **Dependencies yüklenmemiş**: `npm install` çalıştırılmamış
2. **Prisma client generate edilmemiş**: `npm run db:generate` build'den önce çalıştırılmamış

## Çözüm Adımları

### 1. Designer Build Sorununu Çöz

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com/designer
npm install
npm run build
```

### 2. Backend Build Sorununu Çöz (ÖNEMLİ: Doğru Sıralama!)

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com/backend

# 1. Dependencies yükle
npm install

# 2. Prisma client generate et (BUILD'DEN ÖNCE!)
npm run db:generate

# 3. Migrations çalıştır (yeni migrations varsa)
npm run db:deploy

# 4. Build (Prisma client generate edildikten SONRA)
npm run build
```

### 3. Tüm Projeyi Yeniden Build Et (Önerilen)

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com

# Backend
cd backend
npm install
npm run db:generate
npm run db:deploy
npm run build
cd ..

# Frontend
cd frontend
npm install
npm run build
cd ..

# Designer
cd designer
npm install
npm run build
cd ..
```

### 4. Backend'i Yeniden Başlat

```bash
pm2 restart qeeboard-backend
# veya
pm2 restart ecosystem.config.js
```

## Otomatik Çözüm (Deploy Script Kullanarak)

Güncellenmiş `deploy.sh` script'i tüm sorunları otomatik olarak çözer:

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com
chmod +x deploy.sh
./deploy.sh
```

## Önemli Notlar

1. **Prisma Client Generate Sırası**: 
   - ❌ YANLIŞ: `npm run build` → `npm run db:generate`
   - ✅ DOĞRU: `npm run db:generate` → `npm run build`

2. **Dependencies**: Her klasörde `npm install` çalıştırılmalı

3. **Migrations**: Schema değişiklikleri varsa `npm run db:deploy` çalıştırılmalı

4. **Node.js Versiyonu**: Vite uyarısı sadece bir uyarıdır, build başarılı olabilir. Ancak production için Node.js 20+ önerilir.

## Hızlı Kontrol

Build'lerin başarılı olduğunu kontrol edin:

```bash
# Backend dist klasörü kontrol
ls -la /home/qeeboard/htdocs/www.qeeboard.com/backend/dist/

# Frontend dist klasörü kontrol
ls -la /home/qeeboard/htdocs/www.qeeboard.com/frontend/dist/

# Designer dist klasörü kontrol
ls -la /home/qeeboard/htdocs/www.qeeboard.com/designer/dist/
```

Her klasörde `dist/` klasörü ve içinde build edilmiş dosyalar olmalı.

