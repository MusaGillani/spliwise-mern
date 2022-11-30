import express, { Express, Request, Response } from 'express'
import middlewares from './middleware'
import routes from './routes'
import { CONFIG, connect } from './config'

const app: Express = express()
const port = CONFIG.PORT || 3000

middlewares(app)
routes(app)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})
connect(CONFIG.MONGO_URL).then(_ => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at PORT:${port}`)
  })
})
