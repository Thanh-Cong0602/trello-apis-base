import express from 'express'
import { cardController } from '~/controllers/card.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardService } from '~/services/card.service'
import { cardValidation } from '~/validations/card.validation'

const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew,
  cardService.createNew
)

export const cardRoute = Router
