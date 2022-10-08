const express = require('express')
const app = express()
const http = require('http')
// const { Server } = require('socket.io')
const cors = require('cors')
const server = http.createServer(app)
app.use(cors())

const { ServerSocket } = require('./socket')

new ServerSocket(server)

server.listen(5000, () => {
    console.log('server listens on port 5000')
})
