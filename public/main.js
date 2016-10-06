'use strict'
 var c=document.getElementById("game");
 var ctx=c.getContext("2d");

window.onload = function() {
		let player1 ={}
		player1.image=document.getElementById("player1");
		player1.x=250;
		player1.y=250;
    ctx.drawImage(player1.image,player1.x,player1.y);
    window.addEventListener('keydown',()=>{
    	movePlayer(player1)
    })
};


const movePlayer=(player)=>{
	ctx.drawImage(player.image,player.x+=10,player.y+=10)
}

