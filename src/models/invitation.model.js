import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPES)),

  boardInvitation: Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS))
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'inviterId', 'inviteeId', 'createdAt']

const validateBeforeCreate = async data => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNewBoardInvitation = async data => {
  try {
    const validData = await validateBeforeCreate(data)

    let newInvitationToAdd = {
      ...validData,
      inviterId: ObjectId.createFromHexString(validData.inviterId),
      inviteeId: ObjectId.createFromHexString(validData.inviteeId)
    }

    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: ObjectId.createFromHexString(validData.boardInvitation.boardId)
      }
    }
    return await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationToAdd)
  } catch (_error) {
    throw new Error(_error)
  }
}

const findOneById = async invitationId => {
  try {
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(invitationId) })
  } catch (_error) {
    throw new Error(_error)
  }
}

const update = async (invitationId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updateData[fieldName]
    })

    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: ObjectId.createFromHexString(updateData.boardInvitation.boardId)
      }
    }
    return await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOneAndUpdate({ _id: invitationId }, { $set: updateData }, { returnDocument: 'after' })
  } catch (_error) {
    throw new Error(_error)
  }
}

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  update
}
