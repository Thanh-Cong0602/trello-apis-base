import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/column.service'

const createNew = async (req, res, next) => {
  try {
    const createcolumn = await columnService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createcolumn)
  } catch (_error) {
    next(_error)
  }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const updatedColumn = await columnService.update(columnId, req.body)
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (_error) {
    next(_error)
  }
}

export const columnController = { createNew, update }
