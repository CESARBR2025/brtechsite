#!/bin/bash
# Backup de la BD brtech_site (vive en el contenedor parrillasoft-db).
# Instalar en el VPS en /root/scripts/backup-brtech.sh y agregar a crontab:
#   45 3 * * * /root/scripts/backup-brtech.sh >> /root/backups/brtech/backup.log 2>&1
set -e

CONTAINER=$(docker ps --filter "name=parrillasoft-db" --format "{{.Names}}" | head -1)
if [ -z "$CONTAINER" ]; then
  echo "$(date): parrillasoft-db no encontrado, se omite backup" >&2
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p /root/backups/brtech

docker exec "$CONTAINER" pg_dump -U brtech_app -d brtech_site \
  | gzip > "/root/backups/brtech/brtech_site_${TIMESTAMP}.sql.gz"

# Retención: 14 días
find /root/backups/brtech -name "brtech_site_*.sql.gz" -mtime +14 -delete

echo "$(date): backup ok -> brtech_site_${TIMESTAMP}.sql.gz"
