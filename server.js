/**
 *
 * @typedef {{id?: number, name: string, number: number, link: string, class: string}} ScpObject
 */
import {pull} from './pull.js';
import Fastify from 'fastify';
import fastifyMysql from 'fastify-mysql';
import cors from 'fastify-cors';

const fastify = Fastify({logger: true});

fastify.register(fastifyMysql, {
    promise: true,
    connectionString: 'mysql://root:root@localhost/scp'
});

fastify.register(cors, {
    origin: true,
});

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
const types = {OBJECT_DATA, CREATED_OBJECT};

async function getObject(connection, id) {
    console.log(id);
    const [rows] = await connection.query({
        sql: 'select * from objects where id = ?',
        values: [id]
    });
    return rows[0] || null;
}
fastify.route({
    url: '/objects',
    method: 'GET',
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {type: 'integer'},
                        name: {type: 'string'},
                        number: {type: 'integer'},
                        link: {type: 'string'},
                        class: {type: 'string'},
                    }
                }
            }
        }
    },
    handler: async (req, res) => {
        const connection = await fastify.mysql.getConnection();
        const [rows] = await connection.query('select * from objects');
        return rows;
    }
});

fastify.route({
    url: '/objects',
    method: 'POST',
    schema: {
        body: types.OBJECT_DATA,
        response: {
            201: {
                type: 'integer'
            }
        }
    },
    handler: async (req, res) => {
        const connection = await fastify.mysql.getConnection();
        const [rows] = await connection.query({
            sql: 'insert into objects (name, number, link) value (?, ?, ?)',
            values: [req.body.name, req.body.number, req.body.link]
        });
        res.status(201).send(rows.insertId);
    }
});

fastify.route({
    url: '/objects/:id',
    method: 'PATCH',
    schema: {
        body: types.OBJECT_DATA,
        response: {
            200: types.CREATED_OBJECT
        }
    },
    handler: async (req, res) => {
        const connection = await fastify.mysql.getConnection();
        const keys = ['name', 'number', 'link', 'class'].filter(k => req.body[k] !== undefined);
        const values = keys.map(k => req.body[k]);
        const [rows] = await connection.query({
            sql: `update objects set ${keys.map(k => `${k} = ?`).join(',')} where id = ?`,
            values: [...values, req.params.id]
        });
        return await getObject(connection, req.params.id);
    }
});

fastify.route({
    url: '/objects/:number',
    method: 'GET',
    handler: async (req, res) => {
        const connection = await fastify.mysql.getConnection();
        const [rows] = await connection.query({
            sql: 'select * from objects where number = ?',
            values: [req.params.number]
        });
        return rows || null;
    }
});

fastify.route({
    url: '/objects/byId/:id',
    method: 'GET',
    handler: async (req, res) => {
        const connection = await fastify.mysql.getConnection();
        return await getObject(connection, req.params.id);
    }
});

fastify.route({
    url: '/objects/:id',
    method: 'DELETE',
    handler: async (req, res) => {
        const connection = await fastify.mysql.getConnection();
        await connection.query({
            sql: 'delete from objects where id = ?',
            values: [req.params.id]
        });
        return req.params.id;
    }
});

fastify.route({
    url: '/pull',
    method: 'GET',
    handler: async (req, res) => {
        return pull(await fastify.mysql.getConnection())
            .then(() => res.status(200).send('OK'));
    }
});

const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0');
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (e) {
        fastify.log.error(e);
        process.exit(1);
    }
};

start();
