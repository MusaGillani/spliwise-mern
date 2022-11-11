import passport from 'passport'

import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'

import User from '../models/user'
import { CONFIG } from '../config'

const jwtStrategy = new JWTStrategy(
  { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: CONFIG.JWT_SECRET },
  async (payload, done) => {
    try {
      const user = await User.findById(payload._id)
      if (!user) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  }
)

passport.use(jwtStrategy)

export default {
  authJWT: passport.authenticate('jwt', { session: false })
}
