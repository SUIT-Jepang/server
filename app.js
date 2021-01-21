const express = require('express')
const app = express()
const http = require('http').createServer(app)
const cors = require('cors')
const port = 3000

http.listen(port, () => console.log(`listening on port ${port}`))

