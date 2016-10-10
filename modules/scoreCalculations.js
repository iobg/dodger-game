'use strict'
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const checkCoin=(game,player,coin)=>{
	if(player.x  < coin.x + coin.width && player.x + player.width > coin.x
      && player.y  < coin.y + coin.height && player.y + player.height >coin.y){
		player.score +=500
		game.coin=getScoreCoin()
	}
}
function getScoreCoin(){
	let coin = {}
	coin.height=15
	coin.width=15
	coin.x= Math.random()*CANVAS_WIDTH
  coin.y= Math.random()*CANVAS_HEIGHT
  return coin;

}
const scoreControl=(player)=>{
	if(player.alive){
		player.score++
	}
}

module.exports={checkCoin,getScoreCoin,scoreControl}
