const models = require('../../database/models');
const { TYPES_LOGIN } = require('../../library/statics')
const { GetDefaultPasswordHash } = require('../../utils/authorizations')
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment')


const all = async (req, res, next, user) => {
    try {
        const where = { ...req?.params }
        const data = await models?.family?.findAll({
            where,
            order: [
                [`createdAt`, `desc`],
            ],
        })
        res.json({ count: data.length, data, })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next, user) => {
    try {
        const { id } = req.params || {};
        const where = { id }
        const data = await models?.family?.findOne({
            where,
        })
        if (!data) throw Error('Data tidak ditemukan!')
        res.json({ data: data })
    } catch (error) {
        next(error)
    }
}

async function create(req, res, next, user) {
    try {
        const {
            parentId, name, gender, description,
        } = req.body || {}
        await models.sequelize.transaction(async transaction => {
            const data = await models?.family?.create({
                parentId,
                name,
                gender,
                description,
                createdBy: user?.id,
                updatedBy: user?.id,
            }, {
                transaction,
            });
            return res.json({ message: `Sukses!`, data, })
        })
    } catch (error) {
        next(error)
    }
}

async function update(req, res, next, user) {
    try {
        const { id } = req.params || {};
        const {
            parentId, name, gender, description,
        } = req.body || {}
        await models.sequelize.transaction(async transaction => {
            const update = await models?.family?.update({
                parentId,
                name,
                gender,
                description,
                createdBy: user?.id,
                updatedBy: user?.id,
            }, {
                where: { id: id },
                transaction,
            });
            const data = await models?.family?.findOne({
                where: { id: id },
                transaction,
            })
            return res.json({ message: `Sukses!`, data, })
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req, res, next, user) {
    try {
        const { id } = req.params || {};
        await models.sequelize.transaction(async transaction => {
            const data = await models?.family?.destroy({
                where: {
                    id,
                },
                transaction,
            });
            return res.json({ message: `Sukses!`, data, })
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    all,
    get,
    create,
    update,
    destroy,
}