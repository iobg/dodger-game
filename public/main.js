'use strict'

const socket = io()

var c=document.getElementById("game");
var ctx=c.getContext("2d");
var status=document.querySelector('.status')
//obstacles will be randomly generated
var score = 0

window.addEventListener('keydown',e=>{
  socket.emit('keyPress', e.keyCode)
})

window.addEventListener('keyup',e=>{
  socket.emit('keyRelease',e.keyCode)
})

socket.on('update', game=>{


  game.player1.image=document.querySelector('#player1')
  let loopTimer =undefined;
  clearScreen()
  checkBounds(game.player1)
  drawPlayer(game.player1)
  obstacleControl(game.obstacles,game.player1,loopTimer)
  ctx.font="30px Arial";
  ctx.fillText(score, 10, 490)
  score++
  })
const clearScreen=()=>{
  ctx.clearRect(0,0,c.width,c.height)
}
const checkBounds=(player)=>{
  if(player.x + player.image.width > c.width){
    player.x=c.width-player.image.width
  }
  else if(player.x < 0){
    player.x=0
  }
  else if(player.y + player.image.height > c.height){
    player.y=c.height-player.image.height
  }
  else if(player.y < 0){
    player.y=0
  }
}

const checkObstacleBounds=(obstacle)=>{
  if(obstacle.x + obstacle.width >= c.width){
    obstacle.xSpd= -Math.random()*2-1
  }
  else if(obstacle.x <= 0){
    obstacle.xSpd= Math.random()*2+1
  }
  else if(obstacle.y + obstacle.height >= c.height){
    obstacle.ySpd= -Math.random()*2-1
  }
  else if(obstacle.y <= 0){
    obstacle.ySpd= Math.random()*2+1
  }
}


const obstacleControl=(obstacles,player,loopTimer)=>{
  obstacles.forEach(obstacle=>{
    ctx.fillRect(obstacle.x,obstacle.y,obstacle.width,obstacle.height)
    checkObstacleBounds(obstacle)
      obstacle.x += obstacle.xSpd;
      obstacle.y += obstacle.ySpd;

    if(player.x  < obstacle.x + obstacle.width && player.x + player.image.width > obstacle.x
      && player.y  < obstacle.y + obstacle.height && player.y + player.image.height >obstacle.y){
      clearTimeout(loopTimer)
    }

  })
}
const drawPlayer=(player)=>{
  ctx.drawImage(player.image,player.x,player.y)
}


socket.on('connect', () => console.log(`Socket conected ${socket.id}`))
socket.on('disconnect', () => console.log(`Socket disconnected ${socket.id}`))
socket.on('error', console.error)
