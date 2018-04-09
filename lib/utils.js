/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var linspace = require('linspace')
var logspace = require('logspace')
var log10 = require('log10')
var arrayRange = require('array-range')

var globals = require('./globals')

module.exports = {
  isValidNumber: function (v) {
    return typeof v === 'number' && !isNaN(v)
  },

  space: function (chart, range, n) {
    var lo = range[0]
    var hi = range[1]
    if (chart.options.xAxis.scale === 'log') {
      return logspace(log10(lo), log10(hi), n)
    } else if (chart.options.xAxis.domain.type === 'discrete') {
      return arrayRange(lo, hi);
    }
    // default is linear
    return linspace(lo, hi, n)
  },

  getterSetter: function (config, option) {
    var me = this
    this[option] = function (value) {
      if (!arguments.length) {
        return config[option]
      }
      config[option] = value
      return me
    }
  },

  sgn: function (v) {
    if (v < 0) { return -1 }
    if (v > 0) { return 1 }
    return 0
  },

  color: function (data, index) {
    return data.color || globals.COLORS[index]
  },

  toDegree: function (r) {
    if ( r === 0 || r === -0 ) {
      return 0;
    } else {
      return (r * 360) % 360
    }
  }
}
