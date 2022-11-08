import express, { Express, Request, Response } from 'express'
import middlewares from './middleware'
import routes from './routes'
import { ENV } from './config'
const app: Express = express()
const port = ENV.PORT || 3000

middlewares(app)
routes(app)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at PORT:${port}`)
})
