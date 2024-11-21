import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators'

const USERS_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(...Object.values(USERS_ROLES))
    .default(USERS_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async data => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async data => {
  try {
    const validData = await validateBeforeCreate(data)
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validData)
  } catch (_error) {
    throw new Error(_error)
  }
}

const findOneById = async userId => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(userId) })
  } catch (_error) {
    throw new Error(_error)
  }
}

const findOneByEmail = async emailValue => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: emailValue })
  } catch (_error) {
    throw new Error(_error)
  }
}

const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) delete updateData[fieldName]
    })

    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        { returnDocument: 'after' }
      )
  } catch (_error) {
    throw new Error(_error)
  }
}

export const userModal = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  USERS_ROLES,
  findOneById,
  findOneByEmail,
  update
}
