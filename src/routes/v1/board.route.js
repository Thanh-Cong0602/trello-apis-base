import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/board.validation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use boards!', code: StatusCodes.OK })
  })
  .post(boardValidation.createNew)

export const boardRoute = Router
