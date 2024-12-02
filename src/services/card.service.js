import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import { CloundinaryProvider } from '~/providers/Cloudinary.provider'

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

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: new Date()
    }
    let updatedCard = {}
    if (cardCoverFile) {
      const uploadResult = await CloundinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')

      updatedCard = await cardModel.update(cardId, { cover: uploadResult.secure_url })
    } else if (updatedData.commentToAdd) {
      const commentData = {
        ...updatedData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else {
      updatedCard = await cardModel.update(cardId, updatedData)
    }

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = { createNew, update }
