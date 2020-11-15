import fastify from "../server.js";
import debug from 'debug';
const log = debug('App:ObjectController');

export const deleteObject = async (req) => {
    const connection = await fastify.mysql.getConnection();
    log(`Deleting SCP-${req.params.number}...`);
    await connection.query({
        sql: 'delete from objects where number = ?',
        values: [req.params.number]
    });
    log('Deleted.');
    connection.release();
    return req.params.number;
};

export const getByNumber = async (req, reply) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query({
        sql: 'select * from objects where number = ?',
        values: [req.params.number]
    });
    connection.release();
    reply
        .code(rows.length ? 200 : 204)
        .send(rows[0]);
};


export const updateObject = async (req) => {
    const connection = await fastify.mysql.getConnection();
    const keys = ['name', 'link', 'class'].filter(k => req.body[k] !== undefined);
    const values = keys.map(k => req.body[k]);
    log(`Setting ${keys.join(', ')} for SCP-${req.params.number}...`);
    await connection.query({
        sql: `update objects set ${keys.map(k => `${k} = ?`).join(',')} where number = ?`,
        values: [...values, req.params.number]
    });
    log(`SCP-${req.params.number} created.`);
    const object = await getObject(connection, req.params.number);
    connection.release();
    return object
};


export const getAll = async () => {
    log('Getting all objects...');
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('select * from objects');
    log(`Got ${rows.length} objects.`);
    connection.release();
    return rows;
};

export const createObject = async (req, res) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query({
        sql: 'insert into objects (name, number, link, class) value (?, ?, ?, ?)',
        values: [req.body.name, req.body.number, req.body.link, req.body.class]
    });
    connection.release();
    log(`Affected rows: ${rows.affectedRows}.`);
    res.status(201).send(rows.insertId);
};

async function getObject(connection, number) {
    log(`Getting SCP-${number}...`);
    const [rows] = await connection.query({
        sql: 'select * from objects where number = ?',
        values: [number]
    });
    log(`Found ${rows.length} object(s).`);
    return rows[0] || null;
}
