'use strict'
//dependancies
const express=require('express')
const app = express()
const { Server }= require('http')
const server = Server(app)
const mongoose = require('mongoose')
const gameModel = require('./models/game')
const socketio = require('socket.io')
const io = socketio(server)
mongoose.Promise = Promise
//global variables
const CANVAS_WIDTH=500
const CANVAS_HEIGHT=500
const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/dodger'
//server config
app.set('view engine', 'pug')
//middleware
app.use(express.static('public'))
//game objects
const gameObj= require('./modules/gameObj.js')
const {checkCoin,getScoreCoin,scoreControl} = require('./modules/scoreCalculations.js')
const {getRandomObstacle,addNewObstacle,checkObstacleBounds,obstacleControl} = require('./modules/obstacleHandler.js')
const {checkInput,checkBounds} =  require('./modules/playerHandler.js')
//routes
app.get('/',(req,res)=>{
	res.render('index')
})
app.get('/game',(req,res)=>{
	res.render('index')
})

app.get('/game/create', (req, res) => {
	gameModel.create(gameObj)
	.then(game=>{
		res.redirect(`/game/${game._id}`)	})
	.catch(console.error)
})
app.get('/game/:id', (req, res) => {
	res.render('game')
})
//mongoose connection
mongoose.connect(MONGODB_URL,()=>{
	server.listen(PORT,()=> console.log('Server is listening on port', PORT))
})
let playersConnected=0
let player1=undefined;
let player2=undefined;
//establishes connection with client and builds game object

//how to store game without using a global variable?
let allGames=[{}]
app.locals.games=allGames
let currentGame=0
io.on('connect',socket=>{
  playersConnected++
  if(player1){
    player2=socket.id
  }
  else{ player1=socket.id}

	console.log(`Socket connected: ${socket.id}`)
	const id = socket.handshake.headers.referer.split('/').slice(-1)[0]
  
	gameModel.findById(id)
		.then(game =>{
      socket.join(game._id)
      socket.currentGame=currentGame
      
        allGames[socket.currentGame] = game
        allGames[socket.currentGame].player1id=player1
        allGames[socket.currentGame].player2id=player2
      
      socket.on('keyPress', key=>{
        if(socket.id===allGames[socket.currentGame].player1id){
        allGames[socket.currentGame].player1.keyState[key]=true; 
             
        }
        else if(socket.id===allGames[socket.currentGame].player2id){
         allGames[socket.currentGame].player2.keyState[key]=true;
        
        }
       })
        socket.on('keyRelease', key=>{
          if(socket.id===allGames[socket.currentGame].player1id){
            allGames[socket.currentGame].player1.keyState[key]=false;            
          }
          else if(socket.id===allGames[socket.currentGame].player2id){
          allGames[socket.currentGame].player2.keyState[key]=false;
          }
         
       })
        if(playersConnected%2===0){
          console.log("game start")
          allGames[socket.currentGame].totalTime=0
          allGames[socket.currentGame].obstacles.push(getRandomObstacle())
          gameLoop(allGames[socket.currentGame])
          player1=undefined
          player2=undefined
          currentGame++
          app.locals.games=allGames

          }
        })
      })
      
//runs all game logic 100x per second and emits game object to client
const gameLoop=(game)=>{
  game.totalTime++
  addNewObstacle(game.totalTime,game.obstacles)
  checkGameActive(game)
	checkInput(game.player1)
	checkBounds(game.player1)
  obstacleControl(game.obstacles,game.player1)
  checkInput(game.player2)
  checkBounds(game.player2)
  obstacleControl(game.obstacles,game.player2)
	scoreControl(game.player1)
	scoreControl(game.player2)
	checkCoin(game,game.player1,game.coin)
	checkCoin(game,game.player2,game.coin)
	//listen for client keypresses
	}

const checkGameActive=(game)=>{
  if(!game.player1.alive && !game.player2.alive){
    game.active=false
    io.to(game.id).emit('end',game) 
  }
  else{
    setTimeout(()=>{
      gameLoop(game)},10)
      io.to(game.id).emit('update',game) 
    }
}

