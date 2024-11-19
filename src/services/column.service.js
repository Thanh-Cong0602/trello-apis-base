import { boardModel } from '~/models/board.model'
import { columnModel } from '~/models/column.model'

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

export const columnService = { createNew, update }
