import * as ObjectController from '../controllers/ObjectController.js';
import {types} from "../../utils.js";

export default [
    {
        url: '/objects',
        method: 'GET',
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: types.OBJECT_DATA
                }
            }
        },
        handler: ObjectController.getAll
    },
    {
        url: '/objects',
        method: 'POST',
        schema: {
            body: types.OBJECT_DATA,
            response: {
                201: {
                    type: 'integer'
                }
            }
        },
        handler: ObjectController.createObject
    },
    {
        url: '/objects/:number',
        method: 'PATCH',
        schema: {
            body: types.OBJECT_DATA,
            response: {
                200: types.OBJECT_DATA
            }
        },
        handler: ObjectController.updateObject
    },
    {
        url: '/objects/:number',
        method: 'GET',
        handler: ObjectController.getByNumber
    },
    {
        url: '/objects/:number',
        method: 'DELETE',
        handler: ObjectController.deleteObject
    },
]
