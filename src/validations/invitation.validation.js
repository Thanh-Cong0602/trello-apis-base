import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'

const createNewBoardInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteeEmail: Joi.string().required(),
    boardId: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (_error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(_error).message))
  }
}

export const invitationValidation = { createNewBoardInvitation }
