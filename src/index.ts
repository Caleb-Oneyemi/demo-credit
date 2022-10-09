import dotenv from 'dotenv'
import { app } from './app'
import { logger } from './logger'

dotenv.config()

const port = process.env.PORT

app.listen(port, () => {
  logger.debug(`listening on port ${port}...`)
})
