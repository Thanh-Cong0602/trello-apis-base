import express from 'express'
import { userController } from '~/controllers/user.controller'
import { userValidation } from '~/validations/user.validation'

const Router = express.Router()

Router.route('/register').post(userValidation.createNew, userController.createNew)

Router.route('/verify').put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login').post(userValidation.login, userController.login)

export const userRoute = Router
