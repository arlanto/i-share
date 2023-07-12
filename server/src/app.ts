import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route'
import postRoutes from './routes/post.route'
import { errorMiddleware } from './middlewares/error.middleware'
import { env } from './utils/env'

const port = env.APP_PORT
const secret = env.COOKIE_SECRET

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
  }

  private initRoutes() {
    this.app.use('/api/auth', authRoutes)
    this.app.use('/api/posts', postRoutes)
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
