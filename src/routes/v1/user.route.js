import express from 'express'
import { userController } from '~/controllers/user.controller'
import { userValidation } from '~/validations/user.validation'

const Router = express.Router()

Router.route('/register').post(userValidation.createNew, userController.createNew)

export const userRoute = Router
