'use strict'
const {getScoreCoin} = require('./scoreCalculations.js')
module.exports={
    //obstacles will be randomly generated later
    obstacles:[],
    score:0,
    coin: getScoreCoin(),
    player1:{
      x:250,
      y:250,
      name: "test",
      alive:true,
      keyState:{'38':false,
                '39':false,
                '40':false,
                '37':false},
      width:30,
      height:30,
      score:0
    },
    player2:{
      x:300,
      y:300,
      name: "test",
      alive:true,
      keyState:{'38':false,
                '39':false,
                '40':false,
                '37':false},
      width:30,
      height:30,
      score:0
    },
    active:true
  }
