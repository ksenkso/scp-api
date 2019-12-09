import fastify from '../server.js';

/**
 *
 * @return {Promise<{total: number, lastModified: number, last: number}>}
 */
export const getStats = async () => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('select count(id) as `total`, max(cast((substring(link, 30)) as unsigned)) as `last` from objects');
    console.log(rows[0]);
    return {
        total: rows[0].total,
        last: rows[0].last,
        lastModified: +Date.now()
    }
};
