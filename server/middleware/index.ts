import { Express } from 'express'
import { urlencoded, json } from 'body-parser'
import morgan from 'morgan'

import CONFIG from '../config'

const isProd = CONFIG.ENVIRONMENT === 'production'

const middlewares = (app: Express) => {
  app.use(json())
  app.use(urlencoded({ extended: false }))
  if (!isProd) app.use(morgan('tiny'))
}

export default middlewares
