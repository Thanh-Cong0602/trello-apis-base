import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service'
import ms from 'ms'
const createNew = async (req, res, next) => {
  try {
    const createUser = await userService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createUser)
  } catch (_error) {
    next(_error)
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (_error) {
    next(_error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    /* Xử lý trả về http only cookie cho phía client */
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(result)
  } catch (_error) {
    next(_error)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login
}
