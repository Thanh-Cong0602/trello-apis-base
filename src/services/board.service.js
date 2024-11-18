/* eslint-disable no-useless-catch */

import { boardModel } from '~/models/board.model'
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

export const boardService = {
  createNew
}
