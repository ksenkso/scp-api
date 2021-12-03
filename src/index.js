import {server} from './server.js';
import {routes} from './routes/index.js';

const start = async () => {
    // register routes
    routes.forEach(route => server.route(route))
    try {
        await server.listen(3000, '0.0.0.0');
        server.log.info(`server listening on ${server.server.address().port}`);
    } catch (e) {
        server.log.error(e);
        process.exit(1);
    }
};

start();
