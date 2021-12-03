import {withConnection} from "./db.js";

const OBJECTS_COUNT_SQL = `
select
    count(number) as \`total\`,
    max(cast((substring(link, 30)) as unsigned)) as \`last\`
from objects
`
const LAST_PULL_SQL = 'select value as lastPull from stats where name = \'lastPull\''

export const StatsService = {
    /**
     * @return {Promise<{total: number, last: number, lastPull: number|null}>}
     */
    getAllStats() {
        return withConnection(async connection => {
            const [rows] = await connection.query(OBJECTS_COUNT_SQL);
            const [lastPull] = await connection.query(LAST_PULL_SQL);

            return {
                total: rows[0].total,
                last: rows[0].last,
                lastPull: lastPull[0] ? +lastPull[0].lastPull : null
            }
        })
    }
}
