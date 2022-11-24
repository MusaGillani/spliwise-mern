import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import { Token } from '../models'
import { CONFIG } from '../config'

function generateToken(payload: jwt.JwtPayload, expiry: string) {
  return jwt.sign(payload, CONFIG.JWT_SECRET, {
    expiresIn: expiry
  })
}

function verifyToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, CONFIG.JWT_SECRET)
}

async function createRefreshToken(userId: string) {
  const refreshToken = generateToken({ userId }, '1d')
  const token = await Token.findOne({ userId })
  let tokenFamily

  if (token) {
    ;({ tokenFamily } = token)
    token.delete()
  } else {
    tokenFamily = v4()
  }

  await Token.create({
    userId,
    refreshToken,
    tokenFamily
  })

  return refreshToken
}

export default {
  verifyToken,
  generateToken,
  createRefreshToken
}
