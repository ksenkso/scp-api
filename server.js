/**
 *
 * @typedef {{id: number | null, name: string, number: number, link: string, class: string}} ScpObject
 */
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
export default fastify;



