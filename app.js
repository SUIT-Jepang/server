const app = require('express')()
const server = require('http').createServer(app)
const io = require("socket.io")(server)
const PORT = 3000

const {createRoom, joinRoom, exitRoom, rooms} = require('./util/rooms')
const {userConnected, connectedUser, initializeChoice, makeMove, moves, choices} = require('./util/users')
let roomProperty = {}
io.on("connect", (socket) => {
    console.log('connect')
    socket.on('createRoom', (roomId) => {
        if(rooms[roomId]){
            const error = 'this room already exists'
            socket.emit('error-create-room', error)
        }
        else {
            userConnected(socket.client.id)
            createRoom(roomId, socket.client.id)
            socket.emit('room-joined', roomId)
            socket.emit('player-1-connected')
            socket.join(roomId)
        }
        console.log(rooms)
    })
    socket.on('joinRoom', (roomId) => {
        console.log('masuk')
        if(!rooms[roomId]){
            const error = "This room doen't exist"
            socket.emit('error-join-room', error)
        }
        else {
            userConnected(socket.client.id)
            createRoom(roomId, socket.client.id)
            socket.emit('room-created', roomId)
            socket.emit('player-1-connected')
            socket.join(roomId)
            console.log(rooms)
        }
        console.log(rooms)
    })
    socket.on('join-random', () => {
        let roomId = ''
        for(let id in rooms){
            if(rooms[id][1] === ''){
                roomId = id
                break
            }
        }

        if(roomId === '') {
            const error = 'all room are full or none exist'
            socket.emit('error', error)
        }
        else {
            userConnected(socket.client.id)
            createRoom(roomId, socket.client.id)
            socket.emit('room-created', roomId)
            socket.emit('player-1-connected')
            socket.join(roomId)
        }
    })
    socket.on('make-move', ({playerId, myChoice, roomId}) => {
        makeMove(roomId, playerId, myChoice)
        if(choices[roomId][0] !== '' && choices[roomId][1] === ''){
            let playerOne = choices[roomId][0];
            let playerTwo = choices[roomId][1];
            if(playerOne === playerTwo){
                let message = 'Both of you chose ' +  playerOne + ' . So its draw'
                io.to(roomId).emit('draw', message)
            } else if (moves[playerOne] === playerTwo){
                let enemyChoice = ''
                if(playerId === 1){
                    enemyChoice = playerTwo
                }
                else {
                    enemyChoice = playerOne
                }
                choices[rooms] = ['', '']
                io.to(roomId).emit('players-1-wins', {myChoice, enemyChoice})
            } else {
                let enemyChoice = ''
                if(playerId === 1){
                    enemyChoice = playerTwo
                }
                else {
                    enemyChoice = playerOne
                }
                choices[rooms] = ['', '']
                io.to(roomId).emit('players-2-wins', {myChoice, enemyChoice})
            }
        }

    })
})

server.listen(PORT, () => console.log(`listening on PORT ${PORT}`))

