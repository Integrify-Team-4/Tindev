import { createConnection, getConnection, ConnectionOptions } from 'typeorm'
import Entities from '../src/entities'

const connection = {
  async create() {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'tindev',
      synchronize: true,
      logging: false,
      entities: Entities,
      dropSchema: true,
    })

    return connection
  },

  async close() {
    await getConnection().close()
  },

  async clear() {
    const connection = getConnection()
    await connection.synchronize(true)
  },
}
export default connection
