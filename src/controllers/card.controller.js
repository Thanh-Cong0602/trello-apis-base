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

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id
    const cardCoverFile = req.file
    const updatedCard = await cardService.update(cardId, req.body, cardCoverFile)

    res.status(StatusCodes.CREATED).json(updatedCard)
  } catch (_error) {
    next(_error)
  }
}

export const cardController = {
  createNew,
  update
}
