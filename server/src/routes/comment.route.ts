import { Router } from 'express'
import { commentController } from '~/controllers/comment.controller'
import { authorization } from '~/middlewares/auth.middleware'
import { validate } from '~/middlewares/validation.middleware'
import { commentSchema } from '~/schemas/comment.schema'

const commentRoutes = Router()

commentRoutes.post('/post/:id', authorization, validate(commentSchema), commentController.create)
commentRoutes.get('/comment/:id', commentController.findById)
commentRoutes.put('/comment/:id', authorization, validate(commentSchema), commentController.update)
commentRoutes.delete('/comment/:id', authorization, commentController.delete)

export default commentRoutes
