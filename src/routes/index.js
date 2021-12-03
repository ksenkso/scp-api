import objects from './objects.js';
import stats from './stats.js';
import admin from './admin.js';

export const routes = [
    ...objects,
    ...stats,
    ...admin,
];
