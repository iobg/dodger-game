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



const gameObj={
    //obstacles will be randomly generated later
    obstacles:[],
    score:0,
    coin: getScoreCoin(),
    player1:{
      x:250,
      y:250,
      name: "test",
      alive:true,
      keyState:{'38':false,
                '39':false,
                '40':false,
                '37':false},
      width:30,
      height:30,
      score:0
    },
    player2:{
      x:300,
      y:300,
      name: "test",
      alive:true,
      keyState:{'38':false,
                '39':false,
                '40':false,
                '37':false},
      width:30,
      height:30,
      score:0
    },
    active:true
  }
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
const checkCoin=(game,player,coin)=>{
	if(player.x  < coin.x + coin.width && player.x + player.width > coin.x
      && player.y  < coin.y + coin.height && player.y + player.height >coin.y){
		player.score +=500
		game.coin=getScoreCoin()
	}
}
function getScoreCoin(){
	let coin = {}
	coin.height=15
	coin.width=15
	coin.x= Math.random()*CANVAS_WIDTH
  coin.y= Math.random()*CANVAS_HEIGHT
  return coin;

}
const scoreControl=(player)=>{
	if(player.alive){
		player.score++
	}
}
function getRandomObstacle(){
  const maxSize = 50
  const maxSpeed = 2
  var posOrNeg = Math.random() < 0.5 ? -1 : 1
  let obstacle={}
  obstacle.width= Math.random() * maxSize + 20
  obstacle.height= Math.random() * maxSize + 20
  obstacle.x= Math.random()*CANVAS_WIDTH
  obstacle.y= Math.random()*CANVAS_HEIGHT
  //allows objects to have different speeds and trajectories
  obstacle.xSpd= Math.random()*(1 * posOrNeg)
  obstacle.ySpd= Math.random()*(1 * posOrNeg)
  return obstacle
}


const addNewObstacle=(time,obstacles)=>{
  if(time % 500 === 0){
    obstacles.push(getRandomObstacle())
  }
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
//checks player input and increments its position accordingly
const checkInput=(player)=>{
  if(player.keyState[37] && player.keyState[40]){
    player.x-=3
    player.y+=3
  }
  else if(player.keyState[39] && player.keyState[40]){
    player.x+=3
    player.y+=3
  }
  else if(player.keyState[37] && player.keyState[38]){
    player.x-=3
    player.y-=3
  }
  else if(player.keyState[39] && player.keyState[38]){
    player.x+=3
    player.y-=3
  }
  else if (player.keyState[37]){
       player.x -=4;
      }
  else if (player.keyState[39]){
       player.x +=4;
      }
  else if (player.keyState[38]){
       player.y -=4;
      }
  else if (player.keyState[40]){
       player.y +=4;
      }

}
//prevents player from going outside of the canvas
const checkBounds=(player)=>{
  if(player.x + player.width > CANVAS_WIDTH){
    player.x=CANVAS_WIDTH-player.width
  }
  else if(player.x < 0){
    player.x=0
  }
  else if(player.y + player.height > CANVAS_HEIGHT){
    player.y=CANVAS_HEIGHT-player.height
  }
  else if(player.y < 0){
    player.y=0
  }
}
//prevents obstacles from going outside of canvas and sets random speed/direction
const checkObstacleBounds=(obstacle)=>{
  if(obstacle.x + obstacle.width >= CANVAS_WIDTH){
    obstacle.xSpd= -Math.random()
  }
  else if(obstacle.x <= 0){
    obstacle.xSpd= Math.random()
  }
  else if(obstacle.y + obstacle.height >= CANVAS_HEIGHT){
    obstacle.ySpd= -Math.random()
  }
  else if(obstacle.y <= 0){
    obstacle.ySpd= Math.random()
  }
}
//checks if a player intersects an obstacle, and ends the game it does
const obstacleControl=(obstacles,player)=>{
  obstacles.forEach(obstacle=>{
    checkObstacleBounds(obstacle)
    obstacle.x += obstacle.xSpd;
    obstacle.y += obstacle.ySpd;
    if(player.x  < obstacle.x + obstacle.width && player.x + player.width > obstacle.x
      && player.y  < obstacle.y + obstacle.height && player.y + player.height >obstacle.y){
      player.alive=false
    }
  })
}
