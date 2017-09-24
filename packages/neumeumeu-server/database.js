const rethinkdbdash = require("rethinkdbdash");

module.exports = rethinkdbdash({ port: process.env.DB_PORT });
