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
ctx.font="20px Arial"
ctx.fillText("Waiting for another player to join", c.width/2 - 120 , c.height/2)
//is called 100x per second on server's emit
socket.on('update', game=>{
  console.log("loop")
  game.player1.image=document.querySelector('#player1')
  game.player2.image=document.querySelector('#player2')
  clearScreen()
  drawPlayer(game.player1)
  drawPlayer(game.player2)
  drawCoin(game.coin)
  drawObstacles(game.obstacles)
  ctx.font="30px Arial";
  ctx.fillText(game.player1.score, 10, 490)
  ctx.fillText(game.player2.score, 420, 490)
  })

socket.on('end',game=>{
  let winner = game.player1.score > game.player2.score ? "Player 1" : "Player 2"
  console.log(winner)
  clearScreen()
  ctx.font="50px Arial";
  ctx.fillText("Game Over", c.width/2-110, c.height/2)
  ctx.font="30px Arial";
  ctx.fillText(`${winner} Wins!`, c.width/2-90, c.height/2+30)


})
//wipes the screen to prevent duplicate objects
const clearScreen=()=>{
  ctx.clearRect(0,0,c.width,c.height)
}
//all 'enemy' objects drawn
const drawObstacles=(obstacles)=>{
  ctx.fillStyle="#000000"
  obstacles.forEach(obstacle=>{
    ctx.fillRect(obstacle.x,obstacle.y,obstacle.width,obstacle.height)
  })
}
const drawCoin=(coin)=>{
  ctx.fillStyle="#FFFF00"
  ctx.fillRect(coin.x,coin.y,coin.width,coin.height)
}
//player drawn
const drawPlayer=(player)=>{
  if(player.alive){
     ctx.drawImage(player.image,player.x,player.y)
  }
}

//sockets
socket.on('connect', () => console.log(`Socket conected ${socket.id}`))
socket.on('disconnect', () => console.log(`Socket disconnected ${socket.id}`))
socket.on('error', console.error)
