import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/board.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { boardService } from '~/services/board.service'
import { boardValidation } from '~/validations/board.validation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use boards!', code: StatusCodes.OK })
  })
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
