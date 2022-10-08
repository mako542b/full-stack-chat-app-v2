const { Server } = require('socket.io')
const { Server: HttpServer } = require('http')

class ServerSocket {
    static instance
    io

    constructor(server) {
        ServerSocket.instance = this

        this.io = new Server(server, {
            cors: {
                origin:"*",
                method: ["GET", "POST"]
            }
        })

        this.io.on('connection', this.startListeners)

    }

    startListeners = (socket) => {
        console.log(`${socket.id} just connected`)

        socket.emit('updateUsers', users)

        socket.on('newUser', user => {
            users.push({name: user, id:socket.id})
            this.io.emit('updateUsers', users)
        })
        
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
            users = users.filter(user => user.id !== socket.id)
            this.io.emit('updateUsers', users)
        })
        
        socket.on('message', (message) => {
            console.log(message)
            if(defaultMessages[message.room.name]){
                defaultMessages[message.room.name].push(message)
            }
            if(message.room.channel){
            this.io.to(message.room.name).emit('newMessage', message)
            } else {
                this.io.to(message.room.id).emit('newMessage', message)
            }
        })
        
        socket.on('joinRoom', (room, callback) => {
            socket.join(room.name)
            if(defaultMessages[room.name]){
                callback(defaultMessages[room.name], room.name)
            }
        })
    }
}

let users = []


let defaultMessages = {
    general: [],
    jokes: [],
    trips: []
  }

module.exports = {ServerSocket}

