import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/board.model'
import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import ApiError from '~/utils/ApiError'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
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

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = { ...reqBody, updatedAt: Date.now() }

    return await boardModel.update(boardId, updateData)
  } catch (error) {
    throw error
  }
}
const moveCardToDifferentColumn = async reqBody => {
  try {
    /* Bước 1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó */
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    /* Bước 2: Cập nhật mảng cardOrderIds của Column tiếp theo */
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    /* Bước 3: Cập nhật lại trường ColumnId của cái Card đã kéo */
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })
    return { updateResult: 'Successfully' }
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemPerPage) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemPerPage) itemPerPage = DEFAULT_ITEMS_PER_PAGE
    const results = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemPerPage, 10))
    return results
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}
