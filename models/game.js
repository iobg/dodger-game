'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('Game', {
  obstacles: Array,
  score: Number,
  player1: {
    x: Number,
    y: Number,
    name: String,
    width: Number,
    height: Number,
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
    keyState: Object
  }
})
