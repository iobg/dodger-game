'use strict'

const express=require('express')
const app = express()
const { Server }= require('http')
const server = Server(app)
const mongoose = require('mongoose')
mongoose.Promise = Promise
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000

app.set('view engine', 'pug')
app.use(express.static('public'))

//routes
app.get('/',(req,res)=>{
	res.render('index')
})

mongoose.connect(MONGODB_URL,()=>{
	server.listen(PORT,()=> console.log('Server is listening on port', PORT))
})

io.on('connect',socket=>{
	console.log(`Socket connected: ${socket.id}`)
})
