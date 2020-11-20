import { createConnection, getConnection, ConnectionOptions } from 'typeorm'
import User from '../src/entities/User.postgres'

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
      entities: [User],
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
