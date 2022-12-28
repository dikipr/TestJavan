const models = require('../database/models');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { TYPES_LOGIN } = require('../library/statics');

require('dotenv').config();

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
}

const are_you = "are you kidding?"
const not_active = "account not active"

module.exports = passport => {
    passport.use(
        new Strategy(opts, async (payload, done) => {
            const dataUser = await models?.user?.findOne({
                where: { id: payload.id },
            })
            if (!dataUser.isActive) return done(null, false, { message: not_active });
            const _obj = {
                id: dataUser.id,
                username: dataUser.username,
                email: dataUser.email,
                isActive: dataUser.isActive,
            }
            if (payload.typeLogin === TYPES_LOGIN.SUPER_ADMIN) {
                _obj.typeLogin = TYPES_LOGIN.SUPER_ADMIN
            } else if (payload.typeLogin === TYPES_LOGIN.PRIVATE) {
                _obj.typeLogin = TYPES_LOGIN.PRIVATE
            } else {
                return done(null, false, { message: are_you });
            }
            return done(null, _obj, null)
        })
    )
}