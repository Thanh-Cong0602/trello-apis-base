import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import { userModal } from '~/models/user.model'
import { BrevoProvider } from '~/providers/Brevo.provider'
import ApiError from '~/utils/ApiError'
import { WEBSITE_DOMAIN } from '~/utils/constants'
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
    const getNewUser = await userModal.findOneById(createdUser.insertedId.toString())
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Trello Web: Please verify your email before using our service!'
    const customHtmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely, <br/>Thanh Cong Nguyen</h3>
    `

    const res = await BrevoProvider.sendEmail(getNewUser.email, customSubject, customHtmlContent)
    console.log('🚀 ~ env.res:', res)
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}
