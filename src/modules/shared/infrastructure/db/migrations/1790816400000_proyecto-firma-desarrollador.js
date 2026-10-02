/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    -- Firma del desarrollador en la propuesta: { trazo, en }, donde el trazo
    -- es un path SVG. Se firma desde la página con sesión del panel.
    ALTER TABLE proyecto ADD COLUMN firma_desarrollador jsonb;
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE proyecto DROP COLUMN IF EXISTS firma_desarrollador;
  `)
}
