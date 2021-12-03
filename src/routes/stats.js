import {StatsController} from '../controllers/StatsController.js';
import {types} from "../../utils.js";

const stats = [
    {
        url: '/stats',
        method: 'GET',
        schema: {
            response: {
                200: types.STATS_DATA
            }
        },
        handler: StatsController.getStats
    }
];

export default stats;
