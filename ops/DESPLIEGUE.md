# Despliegue — sitio BR TECH (VPS + Dokploy)

## Estado

- BD `brtech_site` + rol `brtech_app` **ya creados** en el contenedor
  `parrillasoft-db` (Postgres 17). Migración inicial aplicada.
- Servicio en Dokploy: `br-tech-digital-systems-sitioweb-gfn1ha` (hoy 0/1, sin desplegar).

## Variables de entorno (Dokploy → el servicio → Environment)

```
DATABASE_URL=postgresql://brtech_app:<PASSWORD>@parrillasoft-db:5432/brtech_site
DB_POOL_MAX=3
PANEL_PASSWORD=<contraseña fuerte del panel>
PANEL_SESSION_SECRET=<openssl rand -hex 32>
SITE_URL=https://<dominio del sitio>
RESEND_API_KEY=<key de Resend>
CONTACT_TO_EMAIL=barcenasrosalescesarivan@gmail.com
NODE_ENV=production
```

El `<PASSWORD>` de `brtech_app` es el generado al crear el rol (guardado aparte,
no está en el repo). Si se perdió, rotarlo:
`docker exec -it parrillasoft-db psql -U parrillasoft -c "ALTER ROLE brtech_app WITH PASSWORD '...';"`

## Build

- Comando: `npm run build` · Start: `npm run start` (o el buildpack de Dokploy).
- Límite de memoria del contenedor: **256 MB** (`mem_limit`) para proteger a parrilla.
- La red debe ser `dokploy-network` (misma que `parrillasoft-db`).

## Migraciones en cada release

Ejecutar tras desplegar (hook post-deploy de Dokploy, o manual):

```
npx dotenv -e .env -- node-pg-migrate -m src/modules/shared/infrastructure/db/migrations up
```

En prod `DATABASE_URL` ya apunta a `parrillasoft-db:5432`, sin túnel.

## Backups (pendiente — hacer antes del uso real)

1. Copiar `ops/backup-brtech.sh` a `/root/scripts/backup-brtech.sh` en el VPS (`chmod +x`).
2. Añadir a `crontab -e`:
   `45 3 * * * /root/scripts/backup-brtech.sh >> /root/backups/brtech/backup.log 2>&1`

## Desarrollo local

Túnel SSH a la BD del VPS:

```
ssh -i ~/.ssh/id_ed25519_hetzner -o ServerAliveInterval=30 -N -L 5433:127.0.0.1:5433 root@204.168.144.99
```

Luego `npm run dev`. Migraciones: `npm run migrate:up`.
