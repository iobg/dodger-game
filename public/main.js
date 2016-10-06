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

  let gameLoop=()=>{

	ctx.clearRect(0,0,500,500)
	if (keyState[37] || keyState[65]){
   		 player1.x -=1;
    	}
  else if (keyState[39] || keyState[65]){
   		 player1.x +=1;
    	}
  else if (keyState[38] || keyState[65]){
   		 player1.y -=1;
    	}
  else if (keyState[40] || keyState[65]){
   		 player1.y +=1;
    	}
    ctx.drawImage(player1.image,player1.x,player1.y)
    setTimeout(gameLoop,10)
	}

gameLoop()
};








// const movePlayer=(player)=>{
// 	ctx.clearRect(0,0,500,500)
// 	if(event.key==='ArrowLeft'){
// 		ctx.drawImage(player.image,player.x-=10,player.y)
// 		}
// 		if(event.key==='ArrowUp'){
// 		ctx.drawImage(player.image,player.x,player.y-=10)
// 		}
// 		if(event.key==='ArrowDown'){
// 		ctx.drawImage(player.image,player.x,player.y+=10)
// 		}
// 		if(event.key==='ArrowRight'){
// 		ctx.drawImage(player.image,player.x+=10,player.y)
// 		}
// }

