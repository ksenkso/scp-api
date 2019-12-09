import fastify from './server.js';
import {pull} from "./pull.js";
import {defineRoutes} from './utils.js';
import objects from './routes/objects.js';
import stats from './routes/stats.js';
const start = async () => {
    // register routes
    defineRoutes(fastify, objects);
    defineRoutes(fastify, stats);
    // `pull` route will be here for some time
    fastify.route({
        url: '/pull',
        method: 'GET',
        handler: async (req, res) => {
            const connection = await fastify.mysql.getConnection();
            return pull(connection)
                .then(() => {
                    connection.release();
                    res.status(200).send('OK')
                });
        }
    });
    try {
        await fastify.listen(3000, '0.0.0.0');
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
};

start();
