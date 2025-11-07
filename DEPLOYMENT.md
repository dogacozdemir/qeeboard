# QeeBoard Deployment Guide - CloudPanel + Ubuntu

## Ön Hazırlık

### 1. PostgreSQL Database Oluşturma (Manuel)

CloudPanel'de PostgreSQL database oluşturma seçeneği yoksa, manuel olarak oluşturun:

**Yöntem 1: Otomatik Script (Önerilen)**

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com
sudo ./setup-database.sh
```

Script sizden şifre isteyecek ve database'i otomatik oluşturacak.

**Yöntem 2: Manuel Komutlar**

```bash
# PostgreSQL'e root/postgres kullanıcısı ile bağlanın
sudo -u postgres psql
# veya
sudo su - postgres
psql
```

**PostgreSQL içinde komutlar:**

```sql
-- Database oluştur
CREATE DATABASE qeeboard_db;

-- Kullanıcı oluştur (eğer yoksa)
CREATE USER qeeboard_user WITH PASSWORD 'güçlü_bir_şifre_buraya';

-- Kullanıcıya database üzerinde tüm yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE qeeboard_db TO qeeboard_user;

-- PostgreSQL 15+ için schema yetkisi de gerekli
\c qeeboard_db
GRANT ALL ON SCHEMA public TO qeeboard_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO qeeboard_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO qeeboard_user;

-- Çıkış
\q
```

**Connection String:**
```
postgresql://qeeboard_user:güçlü_bir_şifre_buraya@localhost:5432/qeeboard_db
```

**Not:** `qeeboard_db` ve `qeeboard_user` isimlerini istediğiniz gibi değiştirebilirsiniz. Şifreyi güçlü bir şifre ile değiştirmeyi unutmayın!

---

## Deployment Adımları

### 1. Dosyaları VPS'e Yükleme

**Site Kök Dizini: `/home/qeeboard/htdocs/www.qeeboard.com`**

**Yöntem 1: Git ile (Önerilen)**

**Eğer dizin boşsa:**
```bash
cd /home/qeeboard/htdocs/www.qeeboard.com
git clone https://github.com/dogacozdemir/qeeboard.git .
```

**Eğer dizin yoksa:**
```bash
mkdir -p /home/qeeboard/htdocs/www.qeeboard.com
cd /home/qeeboard/htdocs/www.qeeboard.com
git clone https://github.com/dogacozdemir/qeeboard.git .
```

**Eğer dizinde mevcut dosyalar varsa (güvenli yöntem):**
```bash
cd /home/qeeboard/htdocs/
mv www.qeeboard.com www.qeeboard.com.backup 2>/dev/null || true
git clone https://github.com/dogacozdemir/qeeboard.git www.qeeboard.com
cd www.qeeboard.com
```

**Yöntem 2: SFTP/SCP ile**
```bash
# Local makinenizden
scp -r /Users/uygardogacozdemir/Desktop/qeeboard.com user@your-vps-ip:/home/qeeboard/htdocs/www.qeeboard.com
```

### 2. Backend Kurulumu

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com/backend

# .env dosyasını oluşturun
nano .env  # veya vi .env

# .env dosyasına şunları ekleyin:
# DATABASE_URL="postgresql://qeeboard_user:your_password@localhost:5432/qeeboard_db"
# JWT_SECRET="your-super-secret-jwt-key-here-min-32-chars"
# PORT=5001
# NODE_ENV=production
# CORS_ORIGIN="https://yourdomain.com"

# Dependencies yükle
npm install

# Prisma client generate
npm run db:generate

# Database migrations (tabloları oluşturur)
npm run db:deploy

# Build
npm run build
```

**Önemli:** `npm run db:deploy` komutu Prisma migrations'ları çalıştırır ve database'de tüm tabloları oluşturur. Bu komut production için güvenlidir ve mevcut verileri silmez.

### 3. Frontend Kurulumu

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com/frontend

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
cd /home/qeeboard/htdocs/www.qeeboard.com/designer

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
cd /home/qeeboard/htdocs/www.qeeboard.com
pm2 start ecosystem.config.js

# PM2'yi sistem başlangıcında çalıştır
pm2 startup
pm2 save
```

### 6. Nginx Configuration (Path Bazlı Routing)

**NOT:** CloudPanel'de site oluştururken port ayarı zorunluysa ve 80/443 zaten kullanılıyorsa, herhangi bir port (örn: 5173) kullanabilirsiniz. Bu port sadece CloudPanel'in referansı içindir - gerçek çalışma portları:
- **Nginx**: 80/443 (zaten çalışıyor)
- **Backend**: 5001 (PM2 ile çalışacak)
- **Frontend/Designer**: Static files (Nginx serve edecek)

Port ayarı site çalışmasını engellemez çünkü routing Nginx config'de yapılacak.

CloudPanel'de site oluşturduktan sonra, Nginx config dosyasını düzenleyin:

```bash
# CloudPanel genelde şu yerde tutar:
nano /home/qeeboard/htdocs/www.qeeboard.com/nginx.conf
# veya CloudPanel'in oluşturduğu config:
nano /etc/nginx/sites-available/www.qeeboard.com
# veya
nano /etc/nginx/conf.d/www.qeeboard.com.conf
```

Nginx config içeriği için proje kökündeki `nginx.conf` dosyasına bakın. CloudPanel'in oluşturduğu config dosyasını bu içerikle değiştirin veya merge edin.

### 7. Static Files için Symbolic Links

**Not:** Path bazlı routing kullanıldığı için symbolic link'e gerek yok. Nginx direkt dist klasörlerine yönlendirecek.

### 8. Uploads Klasörü İzinleri

```bash
# Preview images için
mkdir -p /home/qeeboard/htdocs/www.qeeboard.com/backend/uploads/previews
chmod -R 755 /home/qeeboard/htdocs/www.qeeboard.com/backend/uploads
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
cd /home/qeeboard/htdocs/www.qeeboard.com

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

