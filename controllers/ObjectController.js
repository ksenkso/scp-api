import fastify from "../server.js";

export const deleteObject = async (req) => {
    const connection = await fastify.mysql.getConnection();
    await connection.query({
        sql: 'delete from objects where id = ?',
        values: [req.params.id]
    });
    connection.release();
    return req.params.id;
};


export const getById = async (req, reply) => {
    const connection = await fastify.mysql.getConnection();
    const object = await getObject(connection, req.params.id);
    connection.release();
    reply
        .code(object ? 200 : 204)
        .send(object)
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
    const keys = ['name', 'number', 'link', 'class'].filter(k => req.body[k] !== undefined);
    const values = keys.map(k => req.body[k]);
    await connection.query({
        sql: `update objects set ${keys.map(k => `${k} = ?`).join(',')} where id = ?`,
        values: [...values, req.params.id]
    });
    const object = await getObject(connection, req.params.id);
    connection.release();
    return object
};


export const getAll = async () => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('select * from objects');
    connection.release();
    return rows;
};

export const createObject = async (req, res) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query({
        sql: 'insert into objects (name, number, link) value (?, ?, ?)',
        values: [req.body.name, req.body.number, req.body.link]
    });
    connection.release();
    res.status(201).send(rows.insertId);
};

async function getObject(connection, id) {
    console.log(id);
    const [rows] = await connection.query({
        sql: 'select * from objects where id = ?',
        values: [id]
    });
    return rows[0] || null;
}
