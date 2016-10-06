'use strict'
 var c=document.getElementById("game");
var ctx=c.getContext("2d");
let keyState={}
let player1 ={}
window.onload = function() {
		
		player1.image=document.getElementById("player1");
		player1.x=250;
		player1.y=250;
    ctx.drawImage(player1.image,player1.x,player1.y);

    window.addEventListener('keydown',e=>{
    	keyState[e.keyCode || e.which]=true;
    })

     window.addEventListener('keyup',e=>{
    	keyState[e.keyCode || e.which]=false;
    })

gameLoop()
};

let gameLoop=()=>{

  ctx.clearRect(0,0,500,500)
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
       player1.x -=2;
      }
  else if (keyState[39]){
       player1.x +=2;
      }
  else if (keyState[38]){
       player1.y -=2;
      }
  else if (keyState[40]){
       player1.y +=2;
      }
    ctx.drawImage(player1.image,player1.x,player1.y)
    setTimeout(gameLoop,10)
  }
