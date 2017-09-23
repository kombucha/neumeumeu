const bunyan = require("bunyan");

const log = bunyan.createLogger({ name: "jeu-de-carte" });

module.exports = log;
