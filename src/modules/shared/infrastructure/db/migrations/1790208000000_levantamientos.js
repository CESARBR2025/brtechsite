/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    CREATE SEQUENCE levantamiento_folio_seq START 1;

    -- Levantamiento de requisitos de un cliente nuevo. Las columnas fijas son
    -- lo que se lista y filtra; el resto de la captura vive en "contenido"
    -- (JSONB validado por el dominio, con versión de esquema).
    CREATE TABLE levantamiento (
      id                uuid PRIMARY KEY,
      public_slug       text NOT NULL UNIQUE,
      folio             text NOT NULL UNIQUE,
      estado            text NOT NULL DEFAULT 'borrador'
                          CHECK (estado IN ('borrador', 'publicado', 'archivado')),
      cliente_nombre    text NOT NULL,
      cliente_contacto  text,
      proyecto_nombre   text,
      fecha_reunion     date NOT NULL,
      contenido         jsonb NOT NULL DEFAULT '{}'::jsonb,
      esquema_version   integer NOT NULL DEFAULT 1,
      creado_en         timestamptz NOT NULL DEFAULT now(),
      actualizado_en    timestamptz NOT NULL DEFAULT now(),
      publicado_en      timestamptz,
      confirmado_en     timestamptz
    );

    CREATE INDEX levantamiento_estado_creado_idx
      ON levantamiento (estado, creado_en DESC);
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS levantamiento;
    DROP SEQUENCE IF EXISTS levantamiento_folio_seq;
  `)
}
