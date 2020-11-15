const OBJECT_DATA = {
    type: 'object',
    properties: {
        name: {type: 'string'},
        number: {type: 'integer'},
        link: {type: 'string'},
        class: {type: 'string'},
    }
};

const STATS_DATA = {
    type: 'object',
    properties: {
        total: {type: 'integer'},
        last: {type: 'integer'},
        lastPull: {type: 'integer'},
    }
};
export const types = {OBJECT_DATA, STATS_DATA};

/**
 *
 * @param {fastify.FastifyInstance} fastify
 * @param {*[]} routes
 */
export function defineRoutes(fastify, routes) {
    routes.forEach(route => fastify.route(route));
}
