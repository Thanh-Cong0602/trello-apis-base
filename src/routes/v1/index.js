import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/board.route'
import { cardRoute } from '~/routes/v1/card.route'
import { columnRoute } from '~/routes/v1/column.route'
import { invitationRoute } from '~/routes/v1/invitation.route'
import { userRoute } from '~/routes/v1/user.route'

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

/* User APIs */
Router.use('/users', userRoute)

Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router
