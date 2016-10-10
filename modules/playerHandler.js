'use strict'
const CANVAS_WIDTH=500
const CANVAS_HEIGHT=500
//checks player input and increments its position accordingly
const checkInput=(player)=>{
  if(player.keyState[37] && player.keyState[40]){
    player.x-=3
    player.y+=3
  }
  else if(player.keyState[39] && player.keyState[40]){
    player.x+=3
    player.y+=3
  }
  else if(player.keyState[37] && player.keyState[38]){
    player.x-=3
    player.y-=3
  }
  else if(player.keyState[39] && player.keyState[38]){
    player.x+=3
    player.y-=3
  }
  else if (player.keyState[37]){
       player.x -=4;
      }
  else if (player.keyState[39]){
       player.x +=4;
      }
  else if (player.keyState[38]){
       player.y -=4;
      }
  else if (player.keyState[40]){
       player.y +=4;
      }

}
//prevents player from going outside of the canvas
const checkBounds=(player)=>{
  if(player.x + player.width > CANVAS_WIDTH){
    player.x=CANVAS_WIDTH-player.width
  }
  else if(player.x < 0){
    player.x=0
  }
  else if(player.y + player.height > CANVAS_HEIGHT){
    player.y=CANVAS_HEIGHT-player.height
  }
  else if(player.y < 0){
    player.y=0
  }
}
module.exports={checkInput,checkBounds}
