import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/inviation.service'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const resInvitation = await invitationService.createNewBoardInvitation(req.body, inviterId)

    res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (_error) {
    next(_error)
  }
}

export const inviationController = { createNewBoardInvitation }
