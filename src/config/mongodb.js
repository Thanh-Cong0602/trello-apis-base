import { MongoClient, ServerApiVersion } from 'mongodb'

const password = encodeURIComponent('tcn0602C@')

const MONGODB_URL = `mongodb+srv://th_cong_ng:${password}@cluster0-thanhcongnguye.in6kz.mongodb.net`

const DATABASE_NAME = 'trello-by-thanh-cong-nguyen'

let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first...')
  return trelloDatabaseInstance
}
