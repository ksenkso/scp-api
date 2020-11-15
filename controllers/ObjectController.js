import debug from 'debug';
import {withConnection} from '../utils.js';

const log = debug('App:ObjectController');

export const deleteObject = async (req, reply) => {
    withConnection(async connection => {
        log(`Deleting SCP-${req.params.number}...`);
        await connection.query({
            sql: 'delete from objects where number = ?',
            values: [req.params.number],
        });
        log('Deleted.');
        reply.code(200).send(req.params.number);
    })
};

export const getByNumber = async (req, reply) => {
    withConnection(async connection => {
        const object = await getObject(connection, req.params.number);
        reply
            .code(object ? 200 : 204)
            .send(object ? object : '');
    });
};


export const updateObject = async (req, reply) => {
    withConnection(async connection => {
        const keys = ['name', 'link', 'class'].filter(k => req.body[k] !== undefined);
        const values = keys.map(k => req.body[k]);
        log(`Setting ${keys.join(', ')} for SCP-${req.params.number}...`);
        await connection.query({
            sql: `update objects set ${keys.map(k => `${k} = ?`).join(',')} where number = ?`,
            values: [...values, req.params.number],
        });
        log(`SCP-${req.params.number} created.`);
        const object = await getObject(connection, req.params.number);
        reply.code(200).send(object);
    });
};


export const getAll = async (req, reply) => {
    withConnection(async connection => {
        log('Getting all objects...');
        const [rows] = await connection.query('select * from objects');
        log(`Got ${rows.length} objects.`);
        reply.send(rows);
    });
};

export const createObject = async (req, reply) => {
    withConnection(async connection => {
        const [rows] = await connection.query({
            sql: 'insert into objects (name, number, link, class) value (?, ?, ?, ?)',
            values: [req.body.name, req.body.number, req.body.link, req.body.class],
        });
        log(`Affected rows: ${rows.affectedRows}.`);
        reply.status(201).send(rows.insertId);
    })
};

async function getObject(connection, number) {
    log(`Getting SCP-${number}...`);
    const [rows] = await connection.query({
        sql: 'select * from objects where number = ?',
        values: [number],
    });
    log(`Found ${rows.length} object(s).`);
    return rows[0] || null;
}
