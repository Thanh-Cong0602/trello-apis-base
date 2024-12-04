import express from 'express'
import { inviationController } from '~/controllers/invitation.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitation.validation'

const Router = express.Router()

Router.route('/board').post(
  authMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  inviationController.createNewBoardInvitation
)

Router.route('/').get(
  authMiddleware.isAuthorized,
  inviationController.getInvitations
)

Router.route('/board/:invitationId').put(authMiddleware.isAuthorized, inviationController.updateBoardInvitation)

export const invitationRoute = Router
