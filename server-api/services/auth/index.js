const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../database/models');
const { TYPES_LOGIN } = require('../../library/statics');
const Op = Sequelize.Op;

require('dotenv').config();
const login_expired = process.env.LOGIN_EXPIRED

const login = async (req, res, next) => {
    try {
        const { username, email, password, } = req.body || {};
        const where = {}
        if (username) where.username = username
        if (email) where.email = email
        const dataUser = await models.user.findOne({
            where: {
                [Op.or]: where,
            },
        })
        if (!dataUser) throw new Error('User tidak terdaftar.');
        if (!dataUser.isActive) {
            return res.status(423).json({
                isActive: false,
                id: dataUser.id,
                message: 'Akun sudah terdaftar dalam sistem, namun sudah tidak aktif.',
            });
        }
        bcrypt.compare(password, dataUser.password)
            .then(async isMatch => {
                if (isMatch) {
                    const payload = {
                        id: dataUser.id,
                        username: dataUser.username,
                        email: dataUser.email,
                        typeLogin: null,
                        isActive: dataUser.isActive,
                    }
                    if (process.env.ID_SUPERADMIN.split(';').includes(dataUser.id)) {
                        payload.typeLogin = TYPES_LOGIN.SUPER_ADMIN
                        payload.roleCode = TYPES_LOGIN.SUPER_ADMIN
                    } else {
                        payload.typeLogin = TYPES_LOGIN.PRIVATE
                        payload.roleCode = TYPES_LOGIN.PRIVATE
                    }
                    jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: login_expired },
                        (err, token) => {
                            if (err) {
                                res.status(500).json({ message: 'Error token login!' })
                                console.log(err);
                            } else {
                                let expiresIn = Date()
                                jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                                    expiresIn = decoded.exp
                                })
                                return res.status(200).json({
                                    message: 'Login Berhasil',
                                    token,
                                    expiresIn,
                                    payload,
                                })
                            }
                        }
                    );
                } else {
                    res.status(406).json({ message: 'PASSWORD SALAH!!' })
                }
            })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
}