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
    const entities = connection.entityMetadatas

    await Promise.all(
      entities.map(async (entity) => {
        const repository = connection.getRepository(entity.name)
        await repository.clear()
      })
    )
  },
}
export default connection
