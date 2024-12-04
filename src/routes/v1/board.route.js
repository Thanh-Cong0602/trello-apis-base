import express from 'express'
import { boardController } from '~/controllers/board.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { boardService } from '~/services/board.service'
import { boardValidation } from '~/validations/board.validation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    boardController.createNew,
    boardService.createNew
  )

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(boardValidation.update, boardController.update)

Router.route('/supports/moving_card').put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
)

export const boardRoute = Router
