const passport = require('passport');
const bcrypt = require('bcrypt');
const { TYPES_LOGIN } = require('../library/statics');

const Route = (req, res, next, typeLogin, services) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (!user) return res.status(401).json({ message: 'Authentication login failed' });
            if (user) {
                if (user.typeLogin === typeLogin || user.typeLogin === TYPES_LOGIN.SUPER_ADMIN) {
                    return services(req, res, next, user);
                } else {
                    return res.status(401).json({ message: 'You are not authorized' })
                }
            }
            if (err) return res.status(500).json({
                message: info,
                raw: err,
            });
            res.status(500).json({ message: 'Something wrong with server' })
        })(req, res, next);
    } catch (error) {
        next(error)
    }
}

const _DEFAULT_PASSWORD = process?.env?.USER_DEFAULT_PASSWORD_REGISTER
const GetDefaultPasswordHash = (password) => {
    const pw = password ? password : _DEFAULT_PASSWORD
    return new Promise(resolve => {
        bcrypt.hash(pw, 10, function (err, hash) {
            if (err) {
                resolve({ error: true, message: err })
            } else {
                resolve({ error: false, hash: hash })
            }
        })
    })
}
module.exports = {
    Route,
    GetDefaultPasswordHash,
}