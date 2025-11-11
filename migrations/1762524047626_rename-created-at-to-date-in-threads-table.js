/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.renameColumn('threads', 'created_at', 'date');
};

exports.down = (pgm) => {
  pgm.renameColumn('threads', 'date', 'created_at');
};
