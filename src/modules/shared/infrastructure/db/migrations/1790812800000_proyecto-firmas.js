/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    -- Firmas de quienes aceptan la propuesta: [{ nombre, trazo }], donde el
    -- trazo es un path SVG. "aceptado_por" sigue guardando los nombres.
    ALTER TABLE proyecto
      ADD COLUMN aceptado_firmas jsonb NOT NULL DEFAULT '[]'::jsonb;
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE proyecto DROP COLUMN IF EXISTS aceptado_firmas;
  `)
}
