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
    keyState: Object
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
