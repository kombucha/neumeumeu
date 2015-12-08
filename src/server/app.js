import config from '../config';
import {Server} from 'http';
import path from 'path';
import express from 'express';
import html5History from 'connect-history-api-fallback';
import compression from 'compression';
import attachRealtimeServer from 'server/socket';
import log from 'server/log';

const app = express(),
    server = Server(app),
    staticAssetsPath = path.resolve(__dirname, '..', '..', 'dist');

app.use(html5History())
    .use(compression())
    .use(express.static(staticAssetsPath));

attachRealtimeServer(server);
server.listen(config.port, () => log.info('Server started on port', config.port));
