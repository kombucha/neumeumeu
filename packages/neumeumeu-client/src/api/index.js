let api;

if (process.env.REACT_APP_USE_MOCKS) {
  api = require("./mock").default;
} else {
  api = require("./api").default;
}

export default api;
