import path from 'path'
import fs from 'fs'
import { Router } from 'express'
import multer from 'multer'
import { postController } from '~/controllers/post.controller'
import { authorization } from '~/middlewares/auth.middleware'
import { validate } from '~/middlewares/validation.middleware'
import { createPostSchema, updatePostSchema } from '~/schemas/post.schema'
import { AppException } from '~/utils/app-exception'

const postRoutes = Router()

const __dirname = path.resolve()
const uploadFolder = path.join(__dirname, 'uploads/covers')

fs.mkdirSync(uploadFolder, { recursive: true })

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadFolder)
  },
  filename: function (_req, file, cb) {
    const originalFileName = file.originalname.split('.')[0]
    const filename = originalFileName + '-' + Date.now() + path.extname(file.originalname)
    cb(null, filename)
  },
})

const fileFilter = (_req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true)
  } else {
    cb(new AppException(400, 'Image should be of type jpg, jpeg or png', 'cover'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

postRoutes.post(
  '/',
  authorization,
  upload.single('cover'),
  validate(createPostSchema),
  postController.create
)

postRoutes.get('/', postController.findAll)
postRoutes.get('/:id', postController.findById)

postRoutes.put(
  '/:id',
  authorization,
  upload.single('cover'),
  validate(updatePostSchema),
  postController.update
)

postRoutes.delete('/post/:id', authorization, postController.delete)

postRoutes.post('/likes/:id', authorization, postController.like)

export default postRoutes
