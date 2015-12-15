import config from '../config';
import {Server} from 'http';
import path from 'path';
import express from 'express';
import html5History from 'connect-history-api-fallback';
import compression from 'compression';
// import attachRealtimeServer from 'server/socket';
import socketService from 'server/services/socket';
import actionHandler from 'server/services/actionHandler';
import realtimeHandler from 'server/services/realtimeHandler';
import log from 'server/log';

const app = express(),
    server = Server(app),
    staticAssetsPath = path.resolve(__dirname, '..', '..', 'dist');

app.use(html5History())
    .use(compression())
    .use(express.static(staticAssetsPath));

// Init app
socketService.init(server);
actionHandler.start();
realtimeHandler.start();

server.listen(config.port, 'localhost', () => log.info('Server started on port', config.port));
