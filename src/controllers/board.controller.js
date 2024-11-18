import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    res.status(StatusCodes.CREATED).json({ message: 'APIs v1 created new board!', code: StatusCodes.CREATED })
  } catch (_error) {
    next(_error)
  }
}

export const boardController = {
  createNew
}
