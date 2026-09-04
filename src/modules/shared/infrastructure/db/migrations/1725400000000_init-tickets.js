/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    CREATE SEQUENCE service_ticket_folio_seq START 1;

    CREATE TABLE service_ticket (
      id                  uuid PRIMARY KEY,
      public_slug         text NOT NULL UNIQUE,
      folio               text NOT NULL UNIQUE,
      estado              text NOT NULL DEFAULT 'borrador'
                            CHECK (estado IN ('borrador', 'publicado', 'archivado')),
      cliente_nombre      text NOT NULL,
      cliente_contacto    text,
      equipo_tipo         text NOT NULL,
      equipo_detalle      text,
      problema_reportado  text,
      diagnostico         text,
      trabajo_realizado   text,
      recomendaciones     text,
      nota_garantia       text,
      moneda              text NOT NULL DEFAULT 'MXN',
      impuesto_centavos   bigint NOT NULL DEFAULT 0 CHECK (impuesto_centavos >= 0),
      pagado              boolean NOT NULL DEFAULT false,
      fecha_servicio      date NOT NULL,
      creado_en           timestamptz NOT NULL DEFAULT now(),
      actualizado_en      timestamptz NOT NULL DEFAULT now(),
      publicado_en        timestamptz
    );

    CREATE INDEX service_ticket_estado_creado_idx
      ON service_ticket (estado, creado_en DESC);

    CREATE TABLE service_ticket_item (
      id                        uuid PRIMARY KEY,
      ticket_id                 uuid NOT NULL
                                  REFERENCES service_ticket (id) ON DELETE CASCADE,
      posicion                  integer NOT NULL,
      concepto                  text NOT NULL,
      detalle                   text,
      cantidad                  numeric(10, 2) NOT NULL DEFAULT 1 CHECK (cantidad > 0),
      precio_unitario_centavos  bigint NOT NULL CHECK (precio_unitario_centavos >= 0),
      UNIQUE (ticket_id, posicion)
    );

    CREATE INDEX service_ticket_item_ticket_idx
      ON service_ticket_item (ticket_id);
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS service_ticket_item;
    DROP TABLE IF EXISTS service_ticket;
    DROP SEQUENCE IF EXISTS service_ticket_folio_seq;
  `)
}
