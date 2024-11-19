import express from 'express'
import { columnController } from '~/controllers/column.controller'
import { columnService } from '~/services/column.service'
import { columnValidation } from '~/validations/column.validation'

const Router = express.Router()

Router.route('/').post(columnValidation.createNew, columnController.createNew, columnService.createNew)

export const columnRoute = Router
