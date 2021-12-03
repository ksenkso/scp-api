import {StatsService} from "../services/stats.js";

export const StatsController = {
    async getStats(req, reply) {
        const stats = await StatsService.getAllStats();

        reply.send(stats)
    }
}
