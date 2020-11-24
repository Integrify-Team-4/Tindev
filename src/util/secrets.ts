import dotenv from 'dotenv'
import fs from 'fs'
import logger from './logger'

import Entities from '../entities'

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables')
  dotenv.config({ path: '.env' })
} else {
  logger.error('Please make a .env file')
}

export const ENVIRONMENT = process.env.NODE_ENV
const prod = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

export const JWT_SECRET = process.env['JWT_SECRET'] as string
const DB_PASSWORD = process.env['DB_PASSWORD'] as string

export const ormConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: DB_PASSWORD,
  database: 'tindev',
  synchronize: true,
  logging: false,
  entities: Entities,
  cli: {
    entitiesDir: 'entities',
    migrationsDir: 'migrations',
    subscribersDir: 'subscribers',
  },
}

if (!JWT_SECRET) {
  logger.error(
    'No client secret. Set SESSION_SECRET or JWT_SECRET environment variable.'
  )
  process.exit(1)
}

if (!DB_PASSWORD) {
  logger.error('No postgres password. Set DB_PASSWORD environment variable.')
  process.exit(1)
}
