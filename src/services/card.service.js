import { cardModel } from '~/models/card.model'

const createNew = async reqBody => {
  try {
    const newCard = { ...reqBody }

    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId.toString())

    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}
