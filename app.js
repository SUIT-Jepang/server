const app = require('express')()
const server = require('http').createServer(app)
const cors = require('cors')
const io = require("socket.io")(server)
const PORT = 3000

let data = {
    user: []
}
let rooms = []
let propertyRoom = {}
app.use(cors())
io.on("connection", (socket) => {
    console.log('Socket.Io is connected')
    socket.on('joinRoom', (room) => {
        if (Object.keys(io.sockets.adapter.rooms).includes(room)){
            let length = Object.keys(io.sockets.adapter.rooms[room].sockets).length
            if (length !== 2){
                console.log('room sudah ada')
                socket.join(room)
                socket.emit('updateCurrRoom',room)
                propertyRoom[room]['players'].push(socket.id)
            } else {
                //socket.join(room)
                console.log('masuk')
                io.emit('isFull',room)
            }
        }else{
            console.log('room belum adass')
            propertyRoom[room] = {}
            propertyRoom[room]['players'] = [socket.id]
            socket.join(room)
            socket.emit('updateCurrRoom',room)
            rooms.push(room)
        }
    })

    socket.emit('init', { message: 'Ini dari server' })

    socket.on('choose', function (payload) {
        console.log(payload)
        io.emit('choose', payload)
    })

    socket.on('login', function (payload) {
        console.log('login')
        if (data.user.length <= 2) {

            if (data.user.length === 0) {
                data.user.push({ player: `player1`, name: payload })
                socket.emit('login', data.user[0])
                console.log('>>> user login ', data.user)
            } else {
                data.user.push({ player: `player2`, name: payload })
                socket.emit('login', data.user[1])
                console.log('>>> user login ', data.user)
            }
        }
    })

})

server.listen(PORT, () => console.log(`listening on PORT ${PORT}`))

