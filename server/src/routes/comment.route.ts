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
commentRoutes.get(':id', commentController.findById)
commentRoutes.put('/:id', authorization, validate(commentSchema), commentController.update)
commentRoutes.delete('/:id', authorization, commentController.delete)
commentRoutes.post('/likes/:id', authorization, commentController.like)

export default commentRoutes
