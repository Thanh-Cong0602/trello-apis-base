import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service'

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
