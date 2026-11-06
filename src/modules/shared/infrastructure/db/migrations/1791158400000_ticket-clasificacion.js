exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    ALTER TABLE service_ticket
      ADD COLUMN equipo_categoria text NOT NULL DEFAULT 'otro'
        CHECK (equipo_categoria IN ('laptop', 'pc', 'todo_en_uno', 'otro')),
      ADD COLUMN garantia_dias integer CHECK (garantia_dias BETWEEN 0 AND 365);

    -- Los tickets existentes se clasifican por su texto libre
    UPDATE service_ticket SET equipo_categoria = CASE
      WHEN equipo_tipo ~* '(laptop|port[aá]til|notebook)' THEN 'laptop'
      WHEN equipo_tipo ~* '(todo en uno|all.?in.?one|\\maio\\M)' THEN 'todo_en_uno'
      WHEN equipo_tipo ~* '(\\mpc\\M|escritorio|\\mcpu\\M|gabinete|computadora)' THEN 'pc'
      ELSE 'otro' END;

    ALTER TABLE service_ticket_item
      ADD COLUMN clase text NOT NULL DEFAULT 'otro'
        CHECK (clase IN ('pieza', 'mano_de_obra', 'mantenimiento', 'sistema', 'programa', 'ensamble', 'diagnostico', 'otro')),
      ADD COLUMN pieza text
        CHECK (pieza IN ('disco', 'ram', 'bateria', 'ventilador', 'fuente', 'placa', 'procesador', 'video', 'gabinete')),
      ADD COLUMN etiqueta text CHECK (char_length(etiqueta) <= 32),
      ADD COLUMN pieza_anterior text CHECK (char_length(pieza_anterior) <= 32),
      ADD CONSTRAINT service_ticket_item_pieza_clase_chk CHECK (pieza IS NULL OR clase IN ('pieza', 'diagnostico')),
      ADD CONSTRAINT service_ticket_item_anterior_clase_chk CHECK (pieza_anterior IS NULL OR clase = 'pieza');

    -- Clasificación inicial de los conceptos existentes (mismas reglas principales que sugerirClasificacion)
    UPDATE service_ticket_item SET clase = CASE
      WHEN concepto ~* '(mantenimiento|limpieza|pasta t[eé]rmica)' THEN 'mantenimiento'
      WHEN concepto ~* '(armado|ensambl)' THEN 'ensamble'
      WHEN concepto ~* '(diagn[oó]stic|revisi[oó]n)' THEN 'diagnostico'
      WHEN concepto ~* '(windows|sistema operativo|\\mso\\M|format)' THEN 'sistema'
      WHEN concepto ~* '(ssd|disco|hdd|nvme)' THEN 'pieza'
      WHEN concepto ~* '(\\mram\\M|memoria)' THEN 'pieza'
      WHEN concepto ~* '(office|antivirus|programa|software|licencia)' THEN 'programa'
      ELSE 'otro' END;
    UPDATE service_ticket_item SET pieza = 'disco' WHERE clase = 'pieza' AND concepto ~* '(ssd|disco|hdd|nvme)';
    UPDATE service_ticket_item SET pieza = 'ram'   WHERE clase = 'pieza' AND pieza IS NULL AND concepto ~* '(\\mram\\M|memoria)';
    -- Un ensamble en un equipo que no es PC quedaría inválido para el dominio
    UPDATE service_ticket_item i SET clase = 'otro'
      FROM service_ticket t WHERE i.ticket_id = t.id AND i.clase = 'ensamble' AND t.equipo_categoria <> 'pc';
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE service_ticket_item
      DROP CONSTRAINT service_ticket_item_pieza_clase_chk,
      DROP CONSTRAINT service_ticket_item_anterior_clase_chk,
      DROP COLUMN clase,
      DROP COLUMN pieza,
      DROP COLUMN etiqueta,
      DROP COLUMN pieza_anterior;
    ALTER TABLE service_ticket
      DROP COLUMN equipo_categoria,
      DROP COLUMN garantia_dias;
  `)
}
