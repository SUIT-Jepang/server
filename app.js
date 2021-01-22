const app = require('express')()
const server = require('http').createServer(app)
const io = require("socket.io")(server)
const PORT = 3000

let data = {
    user: []
}

io.on("connection", (socket) => {
    console.log('Socket.Io is connected')

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
            // io.emit('login', payload)

        }
    })
})

server.listen(PORT, () => console.log(`listening on PORT ${PORT}`))

