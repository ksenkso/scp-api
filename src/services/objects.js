import {withConnection} from "./db.js";
import debug from "debug";

const log = debug('App:ObjectsService');

/**
 * @typedef {{
 *     name: string,
 *     number: string,
 *     link: string,
 *     class: string
 * }} SCPObject
 */

export const ObjectsService = {
    getByNumber(number) {
        return withConnection(async connection => getObject(connection, number));
    },

    getAll() {
        return withConnection(async connection => {
            log('Getting all objects...');
            const [rows] = await connection.query('select * from objects');
            log(`Got ${rows.length} objects.`);

            return rows;
        });
    },

    /**
     * @param {SCPObject} object
     * @return {Promise<*>}
     */
    create(object) {
        return withConnection(async connection => {
            const [rows] = await connection.query({
                sql: 'insert into objects (name, number, link, class) value (?, ?, ?, ?)',
                values: [object.name, object.number, object.link, object.class],
            });
            log(`Affected rows: ${rows.affectedRows}.`);

            return rows
        })
    },

    /**
     *
     * @param {string} number
     * @param {Partial<Omit<SCPObject, 'number'>>} object
     * @return {Promise<*>}
     */
    async update(number, object) {
        return withConnection(async connection => {
            const keys = ['name', 'link', 'class'].filter(k => object[k] !== undefined);
            const values = keys.map(k => object[k]);

            log(`Setting ${keys.join(', ')} for SCP-${number}...`);

            await connection.query({
                sql: `update objects set ${keys.map(k => `${k} = ?`).join(',')} where number = ?`,
                values: [...values, number],
            });

            log(`SCP-${number} created.`);

            return getObject(connection, number);
        });
    },

    delete(number) {
        return withConnection(async connection => {
            log(`Deleting SCP-${number}...`);
            await connection.query({
                sql: 'delete from objects where number = ?',
                values: [number],
            });
            log('Deleted.');
        })
    }
}


async function getObject(connection, number) {
    log(`Getting SCP-${number}...`);
    const [rows] = await connection.query({
        sql: 'select * from objects where number = ?',
        values: [number],
    });
    log(`Found ${rows.length} object(s).`);
    return rows[0] || null;
}
