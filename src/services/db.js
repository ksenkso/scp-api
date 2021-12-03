import {server} from "../server.js";

export async function withConnection(cb) {
    const connection = await server.mysql.getConnection();
    const result = await cb(connection);
    connection.release();
    return result;
}
