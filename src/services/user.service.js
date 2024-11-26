import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidv4 } from 'uuid'
import { env } from '~/config/environment'
import { userModal } from '~/models/user.model'
import { BrevoProvider } from '~/providers/Brevo.provider'
import { CloundinaryProvider } from '~/providers/Cloudinary.provider'
import { JwtProvider } from '~/providers/Jwt.provider'
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

    await BrevoProvider.sendEmail(getNewUser.email, customSubject, customHtmlContent)

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const verifyAccount = async reqBody => {
  try {
    /* Querry user trong Database  */
    const existUser = await await userModal.findOneByEmail(reqBody.email)

    /* Các bước kiểm tra cần thiết */
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')

    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')

    if (reqBody.token !== existUser.verifyToken)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

    /* Nếu như mọi thứ đã ok thì bắt đầu cập nhật lại thông tin của User để verify account */
    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModal.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (_error) {
    throw _error
  }
}

const login = async reqBody => {
  try {
    /* Querry user trong Database  */
    const existUser = await await userModal.findOneByEmail(reqBody.email)

    /* Các bước kiểm tra cần thiết */
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect!')
    }

    /* Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE */
    /* Tạo thông tin để đính kèm trong jWT Token: bao gồm _id và email của user */

    const userInfo = { _id: existUser._id, email: existUser.email }

    /* Tạo ra 2 Token, accessToken và refreshToken để trả về cho phía FE */
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (_error) {
    throw _error
  }
}

const refreshToken = async clientRefreshToken => {
  try {
    const refreshToken = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    const userInfo = {
      _id: refreshToken._id,
      email: refreshToken.email
    }
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (_error) {
    throw _error
  }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existUser = await userModal.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    let updatedUser = {}

    /* TH1: Change Password */
    if (reqBody.current_password && reqBody.new_password) {
      if (!bcrypt.compareSync(reqBody.current_password, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is incorrect!')
      }

      updatedUser = await userModal.update(existUser._id, {
        password: bcrypt.hashSync(reqBody.new_password, 8)
      })
    } else if (userAvatarFile) {
      /* Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary */
      const uploadResult = await CloundinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
      console.log('🚀 ~ update ~ uploadResult:', uploadResult)

      /* Lưu lại secure_url của cái file ảnh vào trong Database */
      updatedUser = await userModal.update(existUser._id, { avatar: uploadResult.secure_url })
    } else {
      updatedUser = await userModal.update(existUser._id, reqBody)
    }

    return pickUser(updatedUser)
  } catch (_error) {
    throw _error
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}
