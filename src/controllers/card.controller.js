import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/card.service'

const createNew = async (req, res, next) => {
  try {
    const createcard = await cardService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createcard)
  } catch (_error) {
    next(_error)
  }
}

export const cardController = {
  createNew
}
