/* eslint-disable no-useless-catch */

import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/board.model'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async reqBody => {
  try {
    const newBoard = { ...reqBody, slug: slugify(reqBody.title) }

    /* Gọi tới tầng Modal để xử lý lưu bản ghi new Board vào trong Database */
    const createdBoard = await boardModel.createNew(newBoard)

    /* Lấy bản ghi board sau khi gọi */
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId.toString())

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async boardId => {
  try {
    const board = await boardModel.getDetails(boardId)

    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')

    return board
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
