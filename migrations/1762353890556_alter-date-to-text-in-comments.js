exports.up = (pgm) => {
  pgm.alterColumn("comments", "date", {
    type: "TEXT",
    using: "date::TEXT",
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("comments", "date", {
    type: "TIMESTAMP",
    using: "date::TIMESTAMP",
  });
};
