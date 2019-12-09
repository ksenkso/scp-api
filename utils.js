const OBJECT_DATA = {
    type: 'object',
    properties: {
        name: {type: 'string'},
        number: {type: 'integer'},
        link: {type: 'string'},
        class: {type: 'string'},
    }
};

const CREATED_OBJECT = {
    type: 'object',
    properties: {
        id: {type: 'integer'},
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
        lastModified: {type: 'integer'},
    }
};
export const types = {OBJECT_DATA, CREATED_OBJECT, STATS_DATA};

export async function getObject(connection, id) {
    console.log(id);
    const [rows] = await connection.query({
        sql: 'select * from objects where id = ?',
        values: [id]
    });
    return rows[0] || null;
}

/**
 *
 * @param {fastify.FastifyInstance} fastify
 * @param {*[]} routes
 */
export function defineRoutes(fastify, routes) {
    routes.forEach(route => fastify.route(route));
}
