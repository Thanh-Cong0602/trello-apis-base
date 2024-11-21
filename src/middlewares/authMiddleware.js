import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/Jwt.provider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    /* Bước 1: Thực hiện giải mã token xem có hợp lệ hay không */
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    /* Bước 2: Quan trọng: Nếu như cái token hợp lệ, cần phải lưu thông tin giải mã được vào req.jwtDecoded
    để sử dụng cho các tầng phía sau */
    req.jwtDecoded = accessTokenDecoded

    /* Bước 3: Cho phép request đi tiếp */
    next()
  } catch (_error) {
    // console.log('🚀 ~ isAuthorized ~ _error:', _error)
    /* Nếu accessToken nó bị hết hạn thì cần trả mã lỗi cho phía FE biết để gọi API refreshToken */
    if (_error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }

    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = { isAuthorized }
