const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8000;

const proxy = require('cors-anywhere');

proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
