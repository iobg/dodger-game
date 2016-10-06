'use strict'
 var c=document.getElementById("game");
var ctx=c.getContext("2d");
let keyState={}
let player1 ={}
let obstacles=[{width:50,height:50,x:100,y:100}]
window.onload = function() {
		
		player1.image=document.getElementById("player1");
		player1.x=250;
		player1.y=250;
  
    window.addEventListener('keydown',e=>{
    	keyState[e.keyCode || e.which]=true;
    })

     window.addEventListener('keyup',e=>{
    	keyState[e.keyCode || e.which]=false;
    })

gameLoop()
};

let gameLoop=()=>{

  ctx.clearRect(0,0,c.width,c.height)
  obstacleControl(player1)
  
  if(keyState[37] && keyState[40]){
    player1.x-=2
    player1.y+=2
  }
  else if(keyState[39] && keyState[40]){
    player1.x+=2
    player1.y+=2
  }
  else if(keyState[37] && keyState[38]){
    player1.x-=2
    player1.y-=2
  }
  else if(keyState[39] && keyState[38]){
    player1.x+=2
    player1.y-=2
  }
  else if (keyState[37]){
       player1.x -=3;
      }
  else if (keyState[39]){
       player1.x +=3;
      }
  else if (keyState[38]){
       player1.y -=3;
      }
  else if (keyState[40]){
       player1.y +=3;
      }

    checkBounds(player1)
    ctx.drawImage(player1.image,player1.x,player1.y)
    setTimeout(gameLoop,10)
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

const obstacleControl=(player)=>{
  obstacles.forEach(obstacle=>{
    if(player.x  > obstacle.x && player.x < obstacle.x + obstacle.width
      || player.y  > obstacle.y && player.y < obstacle.y + obstacle.height){
      console.log('hit!')
    }
      ctx.fillRect(obstacle.x,obstacle.y,obstacle.width,obstacle.height)
      obstacle.x++;
      obstacle.y++;

  })
}


