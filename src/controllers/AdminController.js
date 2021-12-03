import debug from 'debug';
import {ParseService} from "../services/parse.js";
import {ObjectsService} from "../services/objects.js";
import {StatsService} from "../services/stats.js";

const log = debug('App:AdminController');

export const AdminController = {
    async pull(req, reply) {
        const tasks = []
        for await (const objects of ParseService.parseAllPages()) {
            tasks.push(
                ObjectsService.createBulk(objects)
                    .then((objects) => {
                        log('loaded')
                        return objects;
                    })
            )
        }

        Promise.all(tasks)
            .then(() => {
                StatsService.updateLastPull()
                reply.code(200).send('OK');
            })
    }
}
