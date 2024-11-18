import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardController } from '~/controllers/board.controller'
import { boardService } from '~/services/board.service'
import { boardValidation } from '~/validations/board.validation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use boards!', code: StatusCodes.OK })
  })
  .post(boardValidation.createNew, boardController.createNew, boardService.createNew)

export const boardRoute = Router
