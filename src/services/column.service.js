import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/board.model'
import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import ApiError from '~/utils/ApiError'

const createNew = async reqBody => {
  try {
    const newColumn = { ...reqBody }

    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId.toString())

    if (getNewColumn) {
      getNewColumn.cards = []
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = { ...reqBody, updatedAt: Date.now() }

    return await columnModel.update(columnId, updateData)
  } catch (error) {
    throw error
  }
}

const deleteItem = async columnId => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!!')

    /* Xóa Column */
    await columnModel.deleteOneById(columnId)

    /* Xóa Card */
    await cardModel.deleteManyByColumnId(columnId)

    /* Xóa Column Id trong mảng ColumnOrderIds chứa nó */
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}

export const columnService = { createNew, update, deleteItem }
