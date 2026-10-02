/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(`
    -- Lo que el cliente decide al aceptar: el correo al que se le envía su
    -- contrato y si toma la bonificación de la inversión (p. ej. caso de éxito).
    ALTER TABLE proyecto
      ADD COLUMN aceptado_correo text,
      ADD COLUMN aceptado_con_bonificacion boolean NOT NULL DEFAULT false;
  `)
}

exports.down = (pgm) => {
  pgm.sql(`
    ALTER TABLE proyecto
      DROP COLUMN IF EXISTS aceptado_correo,
      DROP COLUMN IF EXISTS aceptado_con_bonificacion;
  `)
}
