'use strict'

const express=require('express')
const app = express()
const { Server }= require('http')
const server = Server(app)
const mongoose = require('mongoose')
mongoose.Promise = Promise
const socketio = require('socket.io')
const io = socketio(server)

const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/dodger'

app.set('view engine', 'pug')
app.use(express.static('public'))

//routes
app.get('/',(req,res)=>{
	res.render('index')
})
app.get('/game',(req,res)=>{
	res.render('game')
})

mongoose.connect(MONGODB_URL,()=>{
	server.listen(PORT,()=> console.log('Server is listening on port', PORT))
})

io.on('connect',socket=>{
	console.log(`Socket connected: ${socket.id}`)
	const game = {}
	game.obstacles=[ {width:50,height:50,x:50,y:50, ySpd:1, xSpd:1},
                {width:50,height:50,x:100,y:150, ySpd:-1, xSpd:2},
                {width:50,height:50,x:100,y:200, ySpd:-1, xSpd:2},
                {width:50,height:50,x:20,y:150, ySpd:-1, xSpd:2},
                {width:50,height:50,x:17,y:19, ySpd:-1, xSpd:2},
                {width:50,height:50,x:140,y:430, ySpd:-1, xSpd:2}]
  game.score=0;
  game.player1={
  	x:250,
  	y:250,
  	name: "test"
  }
  game.player2=undefined
  
  socket.emit('game start', game)

})
