import jwt from 'jsonwebtoken'
import { CONFIG } from '../config'

function generateToken(payload: jwt.JwtPayload, expiry: string) {
  return jwt.sign(payload, CONFIG.JWT_SECRET, {
    expiresIn: expiry
  })
}

function verifyToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, CONFIG.JWT_SECRET)
}

export default {
  verifyToken,
  generateToken
}
