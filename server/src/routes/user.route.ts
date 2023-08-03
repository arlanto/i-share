import path from 'path'
import fs from 'fs'
import { Router } from 'express'
import multer from 'multer'
import { userController } from '~/controllers/user.controller'
import { authorization } from '~/middlewares/auth.middleware'
import { validate } from '~/middlewares/validation.middleware'
import { updateUserSchema } from '~/schemas/user.schema'
import { AppException } from '~/utils/app-exception'

const userRoutes = Router()

const __dirname = path.resolve()
const uploadFolder = path.join(__dirname, 'uploads/profiles')

fs.mkdirSync(uploadFolder, { recursive: true })

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
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
    cb(new AppException(400, 'Image should be of type jpg, jpeg or png', 'image'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

userRoutes.get('/:id', userController.findById)
userRoutes.get('/posts', authorization, userController.findMyPosts)
userRoutes.put('/:id', authorization, validate(updateUserSchema), userController.update)
userRoutes.put('/password/:id', authorization, userController.changePassword)

userRoutes.put('/avatar/:id', authorization, upload.single('image'), userController.changeAvatar)

export default userRoutes
