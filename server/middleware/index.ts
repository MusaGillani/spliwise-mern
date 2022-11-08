import { Express } from 'express'
import { urlencoded, json } from 'body-parser'
import morgan from 'morgan'

import { ENV } from '../config'

const isDev = ENV.NODE_ENV === 'development'
const isProd = ENV.NODE_ENV === 'production'

const middlewares = (app: Express) => {
  app.use(json())
  app.use(urlencoded({ extended: false }))
  if (isDev) app.use(morgan('dev'))
}

export default middlewares
