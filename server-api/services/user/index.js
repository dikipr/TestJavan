const models = require('../../database/models');
const { TYPES_LOGIN } = require('../../library/statics')
const { GetDefaultPasswordHash } = require('../../utils/authorizations')
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment')


const all = async (req, res, next, user) => {
    try {
        const where = { ...req?.params }
        const data = await models?.user?.findAll({
            where,
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
        const data = await models?.user?.findOne({
            where,
        })
        if (!data) throw Error('Data tidak ditemukan!')
        res.json({ data: data })
    } catch (error) {
        next(error)
    }
}

const register = async (req, res, next) => {
    try {
        const { username, email, password, } = req.body || {};
        const defaultPassword = await GetDefaultPasswordHash(password);
        if (defaultPassword.error) throw Error((defaultPassword.message));
        await models.sequelize.transaction(async transaction => {
            const where = {}
            if (username) where.username = username
            if (email) where.email = email
            const get = await models.user.findOne({
                where: {
                    [Op.or]: where,
                },
            })
            if (get) {
                if (get?.username === username) throw Error('Username sudah digunakan, silahkan gunakan username yang lain')
                if (get?.email === email) throw Error('Email sudah digunakan, silahkan gunakan email yang lain')
            }
            const data = await models?.user?.create({
                username,
                email,
                password: defaultPassword?.hash,
            }, {
                transaction,
            })
            if (data) delete data?.dataValues?.password
            return res.json({
                message: `Registrasi berhasil`,
                data: data,
            })
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    all,
    get,
    register,
}