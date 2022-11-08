type DefaultConfig = {
  PORT: Number
  ENVIRONMENT?: String
}

type Config = {
  MONGO_URL: String
  JWT_SECRET?: String
}
const devConfig: Config = {
  MONGO_URL: 'mongodb://localhost:27017/splitwise-dev',
  JWT_SECRET: 'thisisasecret'
}

const prodConfig: Config = {
  MONGO_URL: 'mongodb://localhost:27017/splitwise-prod'
}

const defaultConfig: DefaultConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  ENVIRONMENT: process.env.NODE_ENV
}

function envConfig(env?: String) {
  switch (env) {
    case 'development':
      return devConfig
    default:
      return prodConfig
  }
}

export default { ...defaultConfig, ...envConfig(process.env.NODE_ENV) }
