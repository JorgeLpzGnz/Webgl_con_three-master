const express = require('express')

const app = express()

app.use(express.static(__dirname + './public'))

app.get('./public/index.html', (req, res) => res.sendFile(__dirname + './public/index.html'))

app.listen(3000, () => console.log('servidor corriendo en el puerto', 3000))