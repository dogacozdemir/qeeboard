# QeeBoard Deployment Guide - CloudPanel + Ubuntu

## Ön Hazırlık

### 1. Database Connection String'i Öğrenme

CloudPanel'de PostgreSQL database oluşturduğunuzda, connection string şu formatta olacaktır:

```
postgresql://username:password@localhost:5432/database_name
```

**CloudPanel'de bulma yöntemleri:**

**Yöntem 1: CloudPanel UI**
1. CloudPanel'e giriş yapın
2. "Databases" bölümüne gidin
3. Oluşturduğunuz PostgreSQL database'e tıklayın
4. Connection details bölümünde connection string gösterilir

**Yöntem 2: SSH ile kontrol**
```bash
# CloudPanel genelde şu formatta tutar:
# Database name: qeeboard_db (veya sizin verdiğiniz isim)
# Username: qeeboard_user (veya sizin verdiğiniz isim)
# Password: CloudPanel'de gösterilen password
# Host: localhost (veya 127.0.0.1)
# Port: 5432 (PostgreSQL default)

# Connection string formatı:
postgresql://qeeboard_user:your_password@localhost:5432/qeeboard_db
```

**Yöntem 3: CloudPanel config dosyası**
```bash
# SSH ile sunucuya bağlanın
cat /home/cloudpanel/htdocs/*/wp-config.php | grep DB_
# veya CloudPanel'in database config dosyasını kontrol edin
```

---

## Deployment Adımları

### 1. Dosyaları VPS'e Yükleme

**Yöntem 1: Git ile (Önerilen)**
```bash
# VPS'de proje klasörüne gidin
cd /home/cloudpanel/htdocs/
git clone <your-repo-url> qeeboard
cd qeeboard
```

**Yöntem 2: SFTP/SCP ile**
```bash
# Local makinenizden
scp -r /Users/uygardogacozdemir/Desktop/qeeboard.com user@your-vps-ip:/home/cloudpanel/htdocs/
```

### 2. Backend Kurulumu

```bash
cd /home/cloudpanel/htdocs/qeeboard/backend

# .env dosyasını oluşturun
cp .env.example .env
nano .env  # veya vi .env

# .env dosyasına şunları ekleyin:
# DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
# JWT_SECRET="your-super-secret-jwt-key-here-min-32-chars"
# PORT=5001
# NODE_ENV=production
# CORS_ORIGIN="https://yourdomain.com"

# Dependencies yükle
npm install

# Prisma client generate
npm run db:generate

# Database migrations
npm run db:deploy

# Build
npm run build
```

### 3. Frontend Kurulumu

```bash
cd /home/cloudpanel/htdocs/qeeboard/frontend

# .env dosyasını oluşturun
cp .env.example .env
nano .env

# .env dosyasına ekleyin:
# VITE_API_URL=https://yourdomain.com/api

# Dependencies yükle
npm install

# Production build
npm run build
```

### 4. Designer Kurulumu

```bash
cd /home/cloudpanel/htdocs/qeeboard/designer

# .env dosyasını oluşturun
cp .env.example .env
nano .env

# .env dosyasına ekleyin:
# VITE_API_URL=https://yourdomain.com/api

# Dependencies yükle
npm install

# Production build
npm run build
```

### 5. PM2 ile Backend'i Çalıştırma

```bash
# PM2 global install (eğer yoksa)
npm install -g pm2

# PM2 ecosystem dosyasını kullanarak başlat
cd /home/cloudpanel/htdocs/qeeboard
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
pm2 save
```

### 6. Nginx Configuration (Path Bazlı Routing)

CloudPanel'de site oluşturduktan sonra, Nginx config dosyasını düzenleyin:

```bash
# CloudPanel genelde şu yerde tutar:
nano /home/cloudpanel/htdocs/*/nginx.conf
# veya
nano /etc/nginx/sites-available/your-site
```

Nginx config içeriği için `nginx.conf` dosyasına bakın.

### 7. Static Files için Symbolic Links

```bash
# Frontend static files
ln -s /home/cloudpanel/htdocs/qeeboard/frontend/dist /home/cloudpanel/htdocs/qeeboard/public/frontend

# Designer static files  
ln -s /home/cloudpanel/htdocs/qeeboard/designer/dist /home/cloudpanel/htdocs/qeeboard/public/designer
```

### 8. Uploads Klasörü İzinleri

```bash
# Preview images için
mkdir -p /home/cloudpanel/htdocs/qeeboard/backend/uploads/previews
chmod -R 755 /home/cloudpanel/htdocs/qeeboard/backend/uploads
```

### 9. SSL Sertifikası (Let's Encrypt)

CloudPanel'de site oluşturduktan sonra:
1. Site ayarlarına gidin
2. "SSL" bölümüne gidin
3. "Let's Encrypt" seçeneğini seçin
4. Domain'i doğrulayın ve sertifikayı oluşturun

---

## Güncelleme İşlemi

```bash
cd /home/cloudpanel/htdocs/qeeboard

# Backend güncelleme
cd backend
git pull  # veya yeni dosyaları yükleyin
npm install
npm run build
npm run db:deploy  # Yeni migrations varsa
pm2 restart qeeboard-backend

# Frontend güncelleme
cd ../frontend
git pull
npm install
npm run build

# Designer güncelleme
cd ../designer
git pull
npm install
npm run build
```

---

## Troubleshooting

### Backend çalışmıyor
```bash
# PM2 logları kontrol
pm2 logs qeeboard-backend

# PM2 status
pm2 status

# Backend'i yeniden başlat
pm2 restart qeeboard-backend
```

### Database bağlantı hatası
```bash
# .env dosyasını kontrol
cat backend/.env | grep DATABASE_URL

# PostgreSQL servisini kontrol
sudo systemctl status postgresql

# Database'e bağlanmayı test et
psql -U username -d database_name -h localhost
```

### Nginx 404 hatası
```bash
# Nginx config'i test et
sudo nginx -t

# Nginx'i yeniden yükle
sudo systemctl reload nginx

# Nginx error logları
sudo tail -f /var/log/nginx/error.log
```

---

## Önemli Notlar

1. **Environment Variables**: `.env` dosyalarını asla Git'e commit etmeyin
2. **Database Backups**: Düzenli olarak database backup alın
3. **File Permissions**: Uploads klasörü yazılabilir olmalı
4. **CORS**: Production'da CORS_ORIGIN'i doğru domain ile ayarlayın
5. **JWT_SECRET**: Güçlü bir secret kullanın (min 32 karakter)

