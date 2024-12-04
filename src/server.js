/* eslint-disable no-console */

import exitHook from 'async-exit-hook'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import socketIo from 'socket.io'
import { corsOptions } from '~/config/cors'
import { env } from '~/config/environment'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { APIs_V1 } from '~/routes/v1'
import { inviteUserToBoardSocket } from '~/sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  /* Cấu hình Cookie parser */
  app.use(cookieParser())
  /* Handle cors */
  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  /* Middleware xử lý lỗi tập trung */
  app.use(errorHandlingMiddleware)

  /* Tạo một cái server mới bọc thằng app của express để làm real-time với socket.io */
  const server = http.createServer(app)
  const io = socketIo(server, { cors: corsOptions })

  io.on('connection', socket => {
    console.log('User connected', socket.id)

    inviteUserToBoardSocket(socket)

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id)
    })
  })

  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Halo ${env.AUTHOR}, I'm running successfully at Host: ${env.APP_HOST} and Port: ${env.APP_PORT}`
    )
  })

  exitHook(() => {
    console.log('4. Server is sutting down...')
    CLOSE_DB()
    console.log('5. Disconnected to MongoDB Cloud Atlas')
  })
}

/* Chỉ khi kết nối tới Database thành công thì mới start server Back-end lên */
;(async () => {
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
