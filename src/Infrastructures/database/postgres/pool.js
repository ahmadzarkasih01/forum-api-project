// /* istanbul ignore file */
// const { Pool } = require('pg');

// let pool;

// if (process.env.NODE_ENV === 'test') {
//   // TEST ENV
//   pool = new Pool({
//     host: process.env.PGHOST_TEST,
//     port: process.env.PGPORT_TEST,
//     user: process.env.PGUSER_TEST,
//     password: process.env.PGPASSWORD_TEST,
//     database: process.env.PGDATABASE_TEST,
//   });

// } else if (process.env.NODE_ENV === 'development') {
//   // LOCAL DEVELOPMENT ENV
//   pool = new Pool({
//     host: process.env.PGHOST,
//     port: process.env.PGPORT,
//     user: process.env.PGUSER,
//     password: process.env.PGPASSWORD,
//     database: process.env.PGDATABASE,
//   });

// } else {
//   // PRODUCTION (Railway)
//   pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   });
// }

// module.exports = pool;

/* istanbul ignore file */
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

module.exports = pool;

