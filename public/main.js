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
  clearScreen()
  drawPlayer(game.player1)
  drawObstacles(game.obstacles)
  ctx.font="30px Arial";
  ctx.fillText(game.score, 10, 490)
  })

const clearScreen=()=>{
  ctx.clearRect(0,0,c.width,c.height)
}
const drawObstacles=(obstacles)=>{
  obstacles.forEach(obstacle=>{
    ctx.fillRect(obstacle.x,obstacle.y,obstacle.width,obstacle.height)
  })
  
}

const drawPlayer=(player)=>{
  ctx.drawImage(player.image,player.x,player.y)
}


socket.on('connect', () => console.log(`Socket conected ${socket.id}`))
socket.on('disconnect', () => console.log(`Socket disconnected ${socket.id}`))
socket.on('error', console.error)
