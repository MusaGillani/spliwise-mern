import { Express } from 'express'
import { urlencoded, json } from 'body-parser'
import passport from 'passport'
import multer, { memoryStorage } from 'multer'
import compression from 'compression'
import helmet from 'helmet'
import morgan, { token } from 'morgan'

import { reqBodyTokenLog } from '../helpers'
import { CONFIG } from '../config'

const isProd = CONFIG.ENVIRONMENT === 'production'

const middlewares = (app: Express) => {
  app.use(json())
  app.use(urlencoded({ extended: false }))
  app.use(multer({ storage: memoryStorage() }).single('imageFile'))
  app.use(passport.initialize())
  if (!isProd) {
    token('body', reqBodyTokenLog)
    const body = CONFIG.REQ_BODY_LOG ? ':body' : ''
    const format = `:method :url :status ${body} :response-time ms - :res[content-length]`
    app.use(morgan(format))
  } else {
    app.use(compression())
    app.use(helmet())
  }
}

export default middlewares
