import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/board.service'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    /* Điều hướng sang tầng Service */
    const createBoard = await boardService.createNew(userId, req.body)

    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (_error) {
    next(_error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const board = await boardService.getDetails(userId, boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (_error) {
    next(_error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (_error) {
    next(_error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (_error) {
    next(_error)
  }
}

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    /*  page và itemPerPage được truyền vào query url từ phía FE và BE sẽ lấy thông qua req.query */
    const { page, itemPerPage } = req.query
    const result = await boardService.getBoards(userId, page, itemPerPage)

    res.status(StatusCodes.OK).json(result)
  } catch (_error) {
    next(_error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}
