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

export const columnController = {
  createNew
}