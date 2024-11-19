import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async data => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async data => {
  try {
    const validData = await validateBeforeCreate(data)

    return await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne({ ...validData, boardId: ObjectId.createFromHexString(validData.boardId) })
  } catch (_error) {
    throw new Error(_error)
  }
}

const findOneById = async id => {
  try {
    return await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(id) })
  } catch (_error) {
    throw new Error(_error)
  }
}

const pushCardOrderIds = async card => {
  try {
    const result = GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: card.columnId },
        { $push: { cardOrderIds: card._id } },
        { returnDocument: 'after' }
      )
    return result
  } catch (_error) {
    throw new Error(_error)
  }
}

const update = async (columnId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updateData[fieldName]
    })

    if (updateData.cardOrderIds)
      updateData.cardOrderIds = updateData.cardOrderIds.map(cardId => ObjectId.createFromHexString(cardId))

    return await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(columnId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )
  } catch (_error) {
    throw new Error(_error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update
}
