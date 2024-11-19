import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/board.route'
import { cardRoute } from '~/routes/v1/card.route'
import { columnRoute } from '~/routes/v1/column.route'

const Router = express.Router()
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use!', code: StatusCodes.OK })
})

/* Board APIs */
Router.use('/boards', boardRoute)

/* Column APIs */
Router.use('/columns', columnRoute)

/* Card APIs */
Router.use('/cards', cardRoute)

export const APIs_V1 = Router
