import express from 'express'
import { columnController } from '~/controllers/column.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnService } from '~/services/column.service'
import { columnValidation } from '~/validations/column.validation'

const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  columnValidation.createNew,
  columnController.createNew,
  columnService.createNew
)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, columnValidation.update, columnController.update)
  .delete(authMiddleware.isAuthorized, columnValidation.deleteItem, columnController.deleteItem)

export const columnRoute = Router
