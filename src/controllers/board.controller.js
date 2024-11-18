import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use!', code: StatusCodes.OK })
  } catch (_error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: _error.message
    })
  }
}

export const boardController = {
  createNew
}
