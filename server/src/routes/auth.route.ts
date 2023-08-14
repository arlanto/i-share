import { Router } from 'express'
import { authController } from '~/controllers/auth.controller'
import { validate } from '~/middlewares/validation.middleware'
import { authorization } from '~/middlewares/auth.middleware'
import { signinSchema, signupSchema } from '~/schemas/user.schema'

const authRoutes = Router()

authRoutes.post('/signup', validate(signupSchema), authController.signup)
authRoutes.post('/signin', validate(signinSchema), authController.signin)
authRoutes.post('/signout', authorization, authController.signout)
authRoutes.post('/signout-all-devices', authorization, authController.signoutAllDevices)
authRoutes.post('/refresh-token', authorization, authController.refreshAccessToken)
authRoutes.get('/me', authorization, authController.getMe)

export default authRoutes
