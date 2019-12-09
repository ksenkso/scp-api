import * as ObjectController from '../controllers/ObjectController.js';
import {types} from "../utils.js";

export default [
    {
        url: '/objects',
        method: 'GET',
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {type: 'integer'},
                            name: {type: 'string'},
                            number: {type: 'integer'},
                            link: {type: 'string'},
                            class: {type: 'string'},
                        }
                    }
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
        url: '/objects/:id',
        method: 'PATCH',
        schema: {
            body: types.OBJECT_DATA,
            response: {
                200: types.CREATED_OBJECT
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
        url: '/objects/byId/:id',
        method: 'GET',
        handler: ObjectController.getById
    },
    {
        url: '/objects/:id',
        method: 'DELETE',
        handler: ObjectController.deleteObject
    },
]
