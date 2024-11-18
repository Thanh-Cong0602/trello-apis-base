import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/board.service'

const createNew = async (req, res, next) => {
  try {
    /* Điều hướng sang tầng Service */
    const createBoard = await boardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (_error) {
    next(_error)
  }
}

export const boardController = {
  createNew
}
