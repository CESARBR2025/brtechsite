/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    CREATE SEQUENCE proyecto_folio_seq START 1;

    -- Proyecto propuesto a un cliente (fases, módulos, calendario, inversión).
    -- Las columnas fijas son lo que se lista y filtra; el resto vive en
    -- "contenido" (JSONB validado por el dominio, con versión de esquema).
    CREATE TABLE proyecto (
      id                uuid PRIMARY KEY,
      public_slug       text NOT NULL UNIQUE,
      folio             text NOT NULL UNIQUE,
      estado            text NOT NULL DEFAULT 'borrador'
                          CHECK (estado IN ('borrador', 'publicado', 'archivado')),
      levantamiento_id  uuid REFERENCES levantamiento (id) ON DELETE SET NULL,
      cliente_nombre    text NOT NULL,
      cliente_contacto  text,
      proyecto_nombre   text,
      fecha_propuesta   date NOT NULL,
      contenido         jsonb NOT NULL DEFAULT '{}'::jsonb,
      esquema_version   integer NOT NULL DEFAULT 1,
      creado_en         timestamptz NOT NULL DEFAULT now(),
      actualizado_en    timestamptz NOT NULL DEFAULT now(),
      publicado_en      timestamptz,
      aceptado_en       timestamptz,
      aceptado_por      text,
      CHECK ((aceptado_en IS NULL) = (aceptado_por IS NULL))
    );

    CREATE INDEX proyecto_estado_creado_idx ON proyecto (estado, creado_en DESC);
    CREATE INDEX proyecto_levantamiento_idx ON proyecto (levantamiento_id);
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS proyecto;
    DROP SEQUENCE IF EXISTS proyecto_folio_seq;
  `)
}
