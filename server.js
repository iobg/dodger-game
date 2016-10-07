'use strict'

const express=require('express')
const app = express()
const { Server }= require('http')
const server = Server(app)
const mongoose = require('mongoose')
mongoose.Promise = Promise
const socketio = require('socket.io')
const io = socketio(server)
const CANVAS_WIDTH=500
const CANVAS_HEIGHT=500

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
  	name: "test",
  	keyState: {},
  	width:30,
  	height:30
  }
  game.player2=undefined

  socket.emit('game start', game)
  gameLoop(game)
socket.on('keyPress', key=>{
	game.player1.keyState[key]=true;
})
socket.on('keyRelease', key=>{
	game.player1.keyState[key]=false;
})

})

const gameLoop=(game)=>{
	let loopTimer=setTimeout(()=>{gameLoop(game)},10)
	checkInput(game.player1)
	checkBounds(game.player1)
	obstacleControl(game.obstacles,game.player1,loopTimer)
	game.score++;
	io.emit('update',game)
	}

const checkInput=(player)=>{
  if(player.keyState[37] && player.keyState[40]){
    player.x-=2
    player.y+=2
  }
  else if(player.keyState[39] && player.keyState[40]){
    player.x+=2
    player.y+=2
  }
  else if(player.keyState[37] && player.keyState[38]){
    player.x-=2
    player.y-=2
  }
  else if(player.keyState[39] && player.keyState[38]){
    player.x+=2
    player.y-=2
  }
  else if (player.keyState[37]){
       player.x -=3;
      }
  else if (player.keyState[39]){
       player.x +=3;
      }
  else if (player.keyState[38]){
       player.y -=3;
      }
  else if (player.keyState[40]){
       player.y +=3;
      }

}

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

const checkObstacleBounds=(obstacle)=>{
  if(obstacle.x + obstacle.width >= CANVAS_WIDTH){
    obstacle.xSpd= -Math.random()*2-1
  }
  else if(obstacle.x <= 0){
    obstacle.xSpd= Math.random()*2+1
  }
  else if(obstacle.y + obstacle.height >= CANVAS_HEIGHT){
    obstacle.ySpd= -Math.random()*2-1
  }
  else if(obstacle.y <= 0){
    obstacle.ySpd= Math.random()*2+1
  }
}

const obstacleControl=(obstacles,player,loopTimer)=>{
  obstacles.forEach(obstacle=>{
    checkObstacleBounds(obstacle)
      obstacle.x += obstacle.xSpd;
      obstacle.y += obstacle.ySpd;

    if(player.x  < obstacle.x + obstacle.width && player.x + player.width > obstacle.x
      && player.y  < obstacle.y + obstacle.height && player.y + player.height >obstacle.y){
      clearTimeout(loopTimer)
    }

  })
}




