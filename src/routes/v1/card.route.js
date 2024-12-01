import express from 'express'
import { cardController } from '~/controllers/card.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/card.validation'

const Router = express.Router()

Router.route('/').post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/:id').put(authMiddleware.isAuthorized, cardValidation.update, cardController.update)

export const cardRoute = Router
