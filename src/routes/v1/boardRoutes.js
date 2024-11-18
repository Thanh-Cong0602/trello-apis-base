import express from 'express'
import { StatusCodes } from 'http-status-codes'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use boards!', code: StatusCodes.OK })
  })
  .post((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use!', code: StatusCodes.OK })
  })

export const boardRoutes = Router
