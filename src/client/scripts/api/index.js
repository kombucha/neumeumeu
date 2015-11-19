let api;

if (__USE_MOCKS__) {
    api = require('./mock');
} else {
    api = require('./api');
}

export default api;
