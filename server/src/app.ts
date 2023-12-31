import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors'
import authRoutes from './routes/auth.route'
import postRoutes from './routes/post.route'
import userRoutes from './routes/user.route'
import commentRoutes from './routes/comment.route'
import { errorMiddleware } from './middlewares/error.middleware'
import { env } from './utils/env'

const port = env.APP_PORT
const secret = env.COOKIE_SECRET
const domain = env.ALLOWED_DOMAIN
const corsOptions: CorsOptions = {
  origin: domain,
}

export class App {
  app: Application

  constructor() {
    this.app = express()
    this.initConfig()
    this.initRoutes()
    this.initErrorHandler()
  }

  private initConfig() {
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(cookieParser(secret))
    this.app.use(cors(corsOptions))
  }

  private initRoutes() {
    this.app.use('/api/auth', authRoutes)
    this.app.use('/api/posts', postRoutes)
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/comments', commentRoutes)
  }

  private initErrorHandler() {
    this.app.use(errorMiddleware)
  }

  listen(): void {
    this.app.listen(port, () => {
      console.log(`APP RUNNING ON PORT ${port}`)
    })
  }
}
