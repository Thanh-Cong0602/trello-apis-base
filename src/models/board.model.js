import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { cardModel } from './card.model'
import { columnModel } from './column.model'
import { pagingSkipValue } from '~/utils/algorithms'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  /* Những Admin của board */
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  /* Những thành viên của board */

  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async data => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async data => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
  } catch (_error) {
    throw new Error(_error)
  }
}

const findOneById = async boardId => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(boardId) })
  } catch (_error) {
    throw new Error(_error)
  }
}

const getDetails = async id => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: ObjectId.createFromHexString(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ])
      .toArray()

    return result[0] || null
  } catch (_error) {
    throw new Error(_error)
  }
}

const pushColumnOrderIds = async column => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: column.boardId },
        { $push: { columnOrderIds: column._id } },
        { returnDocument: 'after' }
      )
  } catch (_error) {
    throw new Error(_error)
  }
}

const pullColumnOrderIds = async column => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: column.boardId },
        { $pull: { columnOrderIds: column._id } },
        { returnDocument: 'after' }
      )
  } catch (_error) {
    throw new Error(_error)
  }
}

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updateData[fieldName]
    })

    if (updateData.columnOrderIds)
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => ObjectId.createFromHexString(_id))

    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(boardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )
  } catch (_error) {
    throw new Error(_error)
  }
}

const getBoards = async (userId, page, itemPerPage) => {
  try {
    const queryConditions = [
      /* Điều kiện 01: Board chưa bị xóa */
      { _destroy: false },

      /* Điều kiện 02: Cái thằng userId đang thực hiện request này nó phải thuộc 1 trong 2 mảng ownerIds hoặc memberIds,
      sử dụng toán tử $all của mongodb */
      {
        $or: [
          { ownerIds: { $all: [ObjectId.createFromHexString(userId)] } },
          { memberIds: { $all: [ObjectId.createFromHexString(userId)] } }
        ]
      }
    ]

    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryConditions } },
          { $sort: { title: 1 } },
          /* $facet để xử lý nhiều luồng trong một query */
          {
            $facet: {
              /* Luồng thứ nhất: Query boards */
              queryBoards: [
                /* Bỏ qua số lượng bản ghi của những page trước đó */
                { $skip: pagingSkipValue(page, itemPerPage) },
                /* Giới hạn tối đa số lượng bản ghi trả về trên một page */
                { $limit: itemPerPage }
              ],
              /* Luồng thứ hai: Query đếm tổng tất cả bảng ghi board trong DB và trả về */
              queryTotalBoards: [{ $count: 'countAllBoards' }]
            }
          }
        ],
        /* Khai báo thêm thuộc tính collation locale 'en' để fix vụ chữ B đứng trước a thường ở trên
        https://www.mongodb.com/docs/v6.0/reference/collation/#std-label-collation-document-fields */
        { collation: { locale: 'en' } }
      )
      .toArray()

    console.log('🚀 ~ getBoards ~ query:', query)

    const res = query[0]

    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countAllBoards || 0
    }
  } catch (_error) {
    throw new Error(_error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getBoards
}
