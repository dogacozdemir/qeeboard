# Manuel Let's Encrypt SSL Kurulumu

## Adım 1: Certbot Kurulumu

```bash
# Certbot'u yükleyin
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

## Adım 2: Nginx Config'i Güncelleyin

```bash
cd /home/qeeboard/htdocs/www.qeeboard.com
git pull
sudo cp nginx.conf /etc/nginx/sites-enabled/www.qeeboard.com.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Adım 3: SSL Sertifikası Oluşturun

```bash
# Certbot ile SSL sertifikası oluşturun
sudo certbot --nginx -d www.qeeboard.com -d qeeboard.com
```

Certbot size şunları soracak:
- Email adresi (gerekli)
- Terms of Service kabulü (A ile kabul edin)
- Email paylaşımı (opsiyonel, N ile geçebilirsiniz)

## Adım 4: HTTP'den HTTPS'e Redirect Aktif Edin

SSL kurulumu tamamlandıktan sonra, HTTP server bloğundaki redirect'i aktif edin:

```bash
sudo nano /etc/nginx/sites-enabled/www.qeeboard.com.conf
```

Şu satırı bulun ve `#` işaretini kaldırın:
```nginx
# return 301 https://$server_name$request_uri;
```

Şöyle olmalı:
```nginx
return 301 https://$server_name$request_uri;
```

## Adım 5: Nginx'i Test Edin ve Restart Edin

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Adım 6: Otomatik Yenileme Kontrolü

Certbot otomatik olarak yenileme cron job'u ekler. Kontrol edin:

```bash
sudo certbot renew --dry-run
```

## Sorun Giderme

### Sertifika yolu farklıysa:
```bash
# Sertifika yolunu kontrol edin
ls -la /etc/letsencrypt/live/

# Eğer farklı bir yol varsa (örneğin qeeboard.com), config'i güncelleyin
sudo nano /etc/nginx/sites-enabled/www.qeeboard.com.conf
```

### Sertifika yenileme:
```bash
# Manuel yenileme
sudo certbot renew

# Yenileme sonrası nginx'i reload edin
sudo systemctl reload nginx
```

