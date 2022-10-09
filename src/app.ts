import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { errorHandler } from './common'

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(errorHandler)

export { app }
