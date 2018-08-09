/**
 * Created by mauricio on 3/29/15.
 */
'use strict'

var d3 = window.d3
var Globals = {
  FLAT_COLORS : {
    red: '#e74c3c',
    blue: '#2980b9',
    green: '#27ae60',
    orange: '#e67e22',
    black: '#2c3e50',
    gray: '#95a5a6'
  },
  COLORS: [
    'steelblue',
    'red',
    '#05b378',      // green
    'orange',
    '#4040e8',      // purple
    'yellow',
    'brown',
    'magenta',
    'cyan'
  ].map(function (v) {
    return d3.hsl(v)
  }),
  DEFAULT_WIDTH: 550,
  DEFAULT_HEIGHT: 350,
  TIP_X_EPS: 1
}

Globals.DEFAULT_ITERATIONS = null
Globals.MAX_ITERATIONS = Globals.DEFAULT_WIDTH * 4

module.exports = Globals
