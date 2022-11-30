import jwt, { JwtPayload } from 'jsonwebtoken'
import { v4 } from 'uuid'
import { Token } from '../models'
import { CONFIG } from '../config'

function generateToken(payload: jwt.JwtPayload, expiry: string) {
  return jwt.sign(payload, CONFIG.JWT_SECRET, {
    expiresIn: expiry
  })
}

function verifyToken(token: string): string | JwtPayload {
  try {
    const payload = jwt.verify(token, CONFIG.JWT_SECRET)
    return payload
  } catch (error) {
    return ''
  }
}

async function createRefreshToken(userId: string, family?: string) {
  const tokenFamily = family ?? v4()
  const refreshToken = generateToken({ userId, tokenFamily }, '1d')

  await Token.create({
    userId,
    refreshToken,
    tokenFamily
  })

  return refreshToken
}

async function checkIsValid(token: string, tokenFamily: string) {
  return await Token.findOne({ tokenFamily, refreshToken: token })
}

async function checkTokenReuse(userId: string, tokenFamily: string): Promise<boolean> {
  const reuseCheck = await Token.findOne({ tokenFamily })

  if (reuseCheck !== null) {
    await deleteAllTokens(userId)
    return true
  }
  return false
}

async function rotateRefreshToken(
  token: string,
  userId: string,
  tokenFamily: string
): Promise<string> {
  const newToken = await createRefreshToken(userId, tokenFamily)
  await Token.deleteOne({ refreshToken: token })
  return newToken
}

async function deleteAllTokens(userId: string) {
  await Token.deleteMany({ userId })
}

export default {
  verifyToken,
  generateToken,
  createRefreshToken,
  checkTokenReuse,
  rotateRefreshToken,
  checkIsValid,
  deleteAllTokens
}
