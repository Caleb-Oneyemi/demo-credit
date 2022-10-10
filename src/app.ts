import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { errorHandler } from './common'
import {
  userRoutes,
  authRoutes,
  accountRoutes,
  transferRoutes,
} from './modules'

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

app.use('/api/users', userRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/accounts', accountRoutes)

app.use('/api/transfers', transferRoutes)

app.use(errorHandler)

export { app }
