import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async data => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async data => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne({
        ...validData,
        boardId: ObjectId.createFromHexString(validData.boardId),
        columnId: ObjectId.createFromHexString(validData.columnId)
      })
  } catch (_error) {
    throw new Error(_error)
  }
}

const findOneById = async cardId => {
  try {
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(cardId) })
  } catch (_error) {
    throw new Error(_error)
  }
}

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updateData[fieldName]
    })

    if (updateData.columnId) updateData.columnId = ObjectId.createFromHexString(updateData.columnId)

    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(cardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )
  } catch (_error) {
    throw new Error(_error)
  }
}

const deleteManyByColumnId = async columnId => {
  try {
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: ObjectId.createFromHexString(columnId) })
  } catch (_error) {
    throw new Error(_error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}
