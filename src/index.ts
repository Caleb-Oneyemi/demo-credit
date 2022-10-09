import dotenv from 'dotenv'
dotenv.config()

import { app } from './app'
import { logger } from './logger'

const port = process.env.PORT

app.listen(port, () => {
  logger.debug(`listening on port ${port}...`)
})
