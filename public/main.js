'use strict'
var c=document.getElementById("game");
var ctx=c.getContext("2d");
var status=document.querySelector('.status')
let player1 ={}
//obstacles will be randomly generated
let obstacles=[ {width:50,height:50,x:50,y:50, ySpd:1, xSpd:1},
                {width:50,height:50,x:100,y:150, ySpd:-1, xSpd:2},
                {width:50,height:50,x:100,y:200, ySpd:-1, xSpd:2},
                {width:50,height:50,x:20,y:150, ySpd:-1, xSpd:2},
                {width:50,height:50,x:17,y:19, ySpd:-1, xSpd:2},
                {width:50,height:50,x:140,y:430, ySpd:-1, xSpd:2}]

window.onload = function() {

		player1.image=document.getElementById("player1");
		player1.x=250;
		player1.y=250;
    player1.keyState={}
  
    window.addEventListener('keydown',e=>{
    	player1.keyState[e.keyCode || e.which]=true;
    })

     window.addEventListener('keyup',e=>{
      player1.keyState[e.keyCode || e.which]=false;
    })

gameLoop()
};

const gameLoop=()=>{
  let loopTimer=setTimeout(gameLoop,10)
  clearScreen()
  checkInput(player1)
  checkBounds(player1)
  drawPlayer(player1)
  obstacleControl(player1,loopTimer)

  }
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
    obstacle.xSpd= -Math.random()*3
  }
  else if(obstacle.x <= 0){
    obstacle.xSpd= Math.random()*3
  }
  else if(obstacle.y + obstacle.height >= c.height){
    obstacle.ySpd= -Math.random()*3
  }
  else if(obstacle.y <= 0){
    obstacle.ySpd= Math.random()*3
  }
}

 
const obstacleControl=(player,loopTimer)=>{
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


