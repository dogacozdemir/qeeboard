# VPS Setup Komutları

## Site Kök Dizini: `/home/qeeboard/htdocs/www.qeeboard.com`

### Senaryo 1: Dizin boşsa veya yoksa (Önerilen)

```bash
# Dizine git
cd /home/qeeboard/htdocs/www.qeeboard.com

# Eğer dizin yoksa oluştur
mkdir -p /home/qeeboard/htdocs/www.qeeboard.com
cd /home/qeeboard/htdocs/www.qeeboard.com

# Git repository'yi clone et
git clone https://github.com/dogacozdemir/qeeboard.git .

# Veya eğer dizin zaten varsa ve içinde dosyalar varsa:
cd /home/qeeboard/htdocs/www.qeeboard.com
git clone https://github.com/dogacozdemir/qeeboard.git temp
mv temp/* temp/.* . 2>/dev/null || true
rmdir temp
```

### Senaryo 2: Dizin zaten doluysa (Güvenli Yöntem)

```bash
# Önce mevcut dosyaları yedekle (opsiyonel)
cd /home/qeeboard/htdocs/
mv www.qeeboard.com www.qeeboard.com.backup

# Yeni dizin oluştur ve clone et
mkdir -p www.qeeboard.com
cd www.qeeboard.com
git clone https://github.com/dogacozdemir/qeeboard.git .
```

### Senaryo 3: Direkt Clone (En Basit - Dizin boş olmalı)

```bash
cd /home/qeeboard/htdocs/
rm -rf www.qeeboard.com  # DİKKAT: Bu komut mevcut dosyaları siler!
git clone https://github.com/dogacozdemir/qeeboard.git www.qeeboard.com
cd www.qeeboard.com
```

---

## Önerilen Komut (Dizin Durumuna Göre)

**Eğer dizin boşsa veya yoksa:**
```bash
cd /home/qeeboard/htdocs/www.qeeboard.com && git clone https://github.com/dogacozdemir/qeeboard.git . || (mkdir -p /home/qeeboard/htdocs/www.qeeboard.com && cd /home/qeeboard/htdocs/www.qeeboard.com && git clone https://github.com/dogacozdemir/qeeboard.git .)
```

**Eğer dizinde dosyalar varsa (güvenli):**
```bash
cd /home/qeeboard/htdocs/
mv www.qeeboard.com www.qeeboard.com.backup 2>/dev/null || true
git clone https://github.com/dogacozdemir/qeeboard.git www.qeeboard.com
cd www.qeeboard.com
```

---

## Clone Sonrası Kontrol

```bash
# Dosyaların geldiğini kontrol et
ls -la

# Backend, frontend, designer klasörlerinin olduğunu kontrol et
ls -d backend frontend designer
```

