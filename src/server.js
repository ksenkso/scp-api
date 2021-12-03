/**
 *
 * @typedef {{id: number | null, name: string, number: number, link: string, class: string}} ScpObject
 */
import Fastify from 'fastify';
import fastifyMysql from 'fastify-mysql';
import cors from 'fastify-cors';

export const server = Fastify({logger: true});

server.register(fastifyMysql, {
    promise: true,
    connectionString: 'mysql://root:root@localhost/scp'
});

server.register(cors, {
    origin: true,
});
