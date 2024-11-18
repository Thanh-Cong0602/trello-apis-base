import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/board.route'

const Router = express.Router()
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use!', code: StatusCodes.OK })
})

Router.use('/boards', boardRoute)

export const APIs_V1 = Router
