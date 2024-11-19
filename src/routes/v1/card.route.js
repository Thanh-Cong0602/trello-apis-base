import express from 'express'
import { cardController } from '~/controllers/card.controller'
import { cardService } from '~/services/card.service'
import { cardValidation } from '~/validations/card.validation'

const Router = express.Router()

Router.route('/').post(cardValidation.createNew, cardController.createNew, cardService.createNew)

export const cardRoute = Router
