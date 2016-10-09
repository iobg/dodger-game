'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('Game', {
  obstacles: [
  { width:Number,
    height:Number,
    x:Number,
    y:Number,
    xSpd:Number,
    ySpd:Number
  }],
  score: Number,
  player1: {
    x: Number,
    y: Number,
    name: String,
    width: Number,
    height: Number,
    alive: Boolean,
    keyState: {
      37: Boolean,
      38: Boolean,
      39: Boolean,
      40: Boolean
    }
  },
  player2: {
    x: Number,
    y: Number,
    name: String,
    width: Number,
    height: Number,
    alive: Boolean
    keyState: {
      37: Boolean,
      38: Boolean,
      39: Boolean,
      40: Boolean
    }
  }
})
