import JWT from 'jsonwebtoken'

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (_error) {
    throw new Error(_error)
  }
}

const verifyToken = async (userInfo, secretSignature) => {
  try {
    return JWT.verify(userInfo, secretSignature)
  } catch (_error) {
    throw new Error(_error)
  }
}

export const JwtProvider = { generateToken, verifyToken }
