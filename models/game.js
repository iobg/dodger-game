'use strict'

const mongoose = require('mongoose')

module.exports = mongoose.model('Game', {
  obstacles: [Object],
  score: Number,
  player1: {
    x: Number,
    y: Number,
    name: String
  },
  player2: {
    x: Number,
    y: Number,
    name: String
  }
})
