import { Router } from 'express'
import { commentController } from '~/controllers/comment.controller'
import { authorization } from '~/middlewares/auth.middleware'
import { validate } from '~/middlewares/validation.middleware'
import { commentSchema } from '~/schemas/comment.schema'

const commentRoutes = Router()

commentRoutes.post(
  '/comment/post/:id',
  authorization,
  validate(commentSchema),
  commentController.create
)

commentRoutes.get('/', commentController.findAll)
commentRoutes.get('/comment/:id', commentController.findById)
commentRoutes.put('/comment/:id', authorization, validate(commentSchema), commentController.update)
commentRoutes.delete('/comment/:id', authorization, commentController.delete)
commentRoutes.post('/likes/like/:id', authorization, commentController.like)

export default commentRoutes
