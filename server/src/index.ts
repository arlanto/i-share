import './utils/validate-env'
import { App } from './app'
import { startDB } from './utils/db'
import { env } from './utils/env'

const app = new App()

;(() => {
  startDB(env.DB_URI)
  app.listen()
})()
