'use strict'

const socket = io()

//establish canvas for the game screen
var c=document.getElementById("game");
var ctx=c.getContext("2d");
var status=document.querySelector('.status')
//listen for user input
window.addEventListener('keydown',e=>{
  socket.emit('keyPress', e.keyCode)
})

window.addEventListener('keyup',e=>{
  socket.emit('keyRelease',e.keyCode)
})
//is called 100x per second on server's emit
socket.on('update', game=>{
  console.log("loop")
  game.player1.image=document.querySelector('#player1')
  clearScreen()
  drawPlayer(game.player1)
  drawObstacles(game.obstacles)
  ctx.font="30px Arial";
  ctx.fillText(game.score, 10, 490)
  })
//wipes the screen to prevent duplicate objects
const clearScreen=()=>{
  ctx.clearRect(0,0,c.width,c.height)
}
//all 'enemy' objects drawn
const drawObstacles=(obstacles)=>{
  obstacles.forEach(obstacle=>{
    ctx.fillRect(obstacle.x,obstacle.y,obstacle.width,obstacle.height)
  })
}
//player drawn
const drawPlayer=(player)=>{
  ctx.drawImage(player.image,player.x,player.y)
}

//sockets
socket.on('connect', () => console.log(`Socket conected ${socket.id}`))
socket.on('disconnect', () => console.log(`Socket disconnected ${socket.id}`))
socket.on('error', console.error)
