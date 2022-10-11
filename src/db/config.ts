import path from 'path'
import dotenv from 'dotenv'
import { Knex } from 'knex'

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: process.env.MIGRATIONS_TABLE,
  },
  useNullAsDefault: true,
} as Knex.Config

export default config
