'use strict'
const CANVAS_WIDTH=500
const CANVAS_HEIGHT=500

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

module.exports = {getRandomObstacle,addNewObstacle,checkObstacleBounds,obstacleControl}
