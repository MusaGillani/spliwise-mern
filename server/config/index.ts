type DefaultConfig = {
  PORT: number
  ENVIRONMENT?: string
}

type Config = {
  MONGO_URL: string
  JWT_SECRET: string
}
const devConfig: Config = {
  MONGO_URL: 'mongodb://localhost:27017/splitwise-dev',
  JWT_SECRET: 'thisisasecret'
}

const prodConfig: Config = {
  MONGO_URL: 'mongodb://localhost:27017/splitwise-prod',
  JWT_SECRET: process.env.JWT_SECRET!
}

const defaultConfig: DefaultConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  ENVIRONMENT: process.env.NODE_ENV
}

function envConfig(env?: string) {
  switch (env) {
    case 'development':
      return devConfig
    default:
      return prodConfig
  }
}

export const CONFIG = { ...defaultConfig, ...envConfig(process.env.NODE_ENV) }
export { db as connect } from './db'
