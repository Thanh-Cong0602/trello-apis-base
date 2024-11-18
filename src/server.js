/* eslint-disable no-console */

import express from 'express'
import { CONNECT_DB, GET_DB } from './config/mongodb'

const START_SERVER = () => {
  const app = express()
  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())
  })
  const hostname = 'localhost'
  const port = 8017

  app.listen(port, hostname, () => {
    console.log(`3. Halo Thanh Cong Nguyen, I'm running successfully at Host: ${hostname} and Port: ${port}`)
  })
}

/* Chỉ khi kết nối tới Database thành công thì mới start server Back-end lên */
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (_error) {
    console.error(_error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(_error => {
//     console.error(_error)
//     process.exit(0)
//   })
