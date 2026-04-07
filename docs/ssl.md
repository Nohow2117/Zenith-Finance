# SSL Notes

Questo file non deve contenere certificati o chiavi private.

## Produzione

- Dominio: `artdefinance.com`
- Alias: `www.artdefinance.com`
- Proxy: Cloudflare DNS proxied
- Modalita SSL raccomandata: `Full (strict)`
- Origin certificate path VPS: `/etc/ssl/artdefinance/origin.crt`
- Origin key path VPS: `/etc/ssl/artdefinance/origin.key`
- Nginx vhost path VPS: `/etc/nginx/sites-available/artdefinance`
- Runtime flag app: `COOKIE_SECURE="true"` in `/home/artdefinance/deployments/artdefinance/shared/.env`

## Sicurezza

- Non salvare mai private key o certificati completi nel repository.
- Se serve condividere materiale SSL, usare un canale sicuro temporaneo e rimuoverlo subito dopo l'installazione sulla VPS.
