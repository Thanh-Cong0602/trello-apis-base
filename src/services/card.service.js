import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'

const createNew = async reqBody => {
  try {
    const newCard = { ...reqBody }

    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId.toString())

    if (getNewCard) await columnModel.pushCardOrderIds(getNewCard)

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: new Date()
    }

    const updatedCard = await cardModel.update(cardId, updatedData)

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = { createNew, update }
