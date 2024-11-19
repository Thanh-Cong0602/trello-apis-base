import { columnModel } from '~/models/column.model'

const createNew = async reqBody => {
  try {
    const newColumn = { ...reqBody }

    const createdColumn = await columnModel.createNew(newColumn)

    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId.toString())

    return getNewColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew
}
