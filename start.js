import fastify from './server.js';
import {defineRoutes} from './utils.js';
import objects from './routes/objects.js';
import stats from './routes/stats.js';
import admin from './routes/admin.js';

const start = async () => {
    // register routes
    defineRoutes(fastify, objects);
    defineRoutes(fastify, stats);
    defineRoutes(fastify, admin);
    try {
        await fastify.listen(3000, '0.0.0.0');
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
};

start();
