import {withConnection} from '../utils.js';

/**
 *
 * @return {Promise<{total: number, lastPull: number, last: number}>}
 */
export const getStats = async (req, reply) => {
    withConnection(async connection => {
        const [rows] = await connection.query('select count(number) as `total`, max(cast((substring(link, 30)) as unsigned)) as `last` from objects');
        const [lastPull] = await connection.query('select value as lastPull from stats where name = \'lastPull\'');
        reply.send({
            total: rows[0].total,
            last: rows[0].last,
            lastPull: lastPull[0] ? +lastPull[0].lastPull : null
        });
    })

};
