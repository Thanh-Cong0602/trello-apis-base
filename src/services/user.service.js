import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { userModal } from '~/models/user.model'
import ApiError from '~/utils/ApiError'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'

const createNew = async reqBody => {
  try {
    const existUser = await userModal.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    const nameFromEmail = reqBody.email.split('@')[0]

    const newUser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModal.createNew(newUser)
    return pickUser(await userModal.findOneById(createdUser.insertedId.toString()))
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}
