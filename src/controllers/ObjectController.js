import {ObjectsService} from "../services/objects.js";

export const ObjectController = {
    async deleteObject(req, reply) {
        await ObjectsService.delete(req.params.number);

        reply.code(200).send(req.params.number);
    },

    async getByNumber(req, reply) {
        const object = ObjectsService.getByNumber(req.params.number);

        reply
            .code(object ? 200 : 204)
            .send(object ? object : '');
    },

    async updateObject(req, reply) {
        const updated = await ObjectsService.update(req.params.number, req.body)

        reply.code(200).send(updated)
    },

    async getAll(req, reply) {
        const objects = await ObjectsService.getAll()

        reply.send(objects);
    },

    async createObject(req, reply) {
        const object = await ObjectsService.create(req.body);

        reply.status(201).send(object.insertId);
    }
}
