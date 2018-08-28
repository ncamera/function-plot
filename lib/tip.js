/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var extend = require('extend')
var utils = require('./utils')
var clamp = require('clamp')
var globals = require('./globals')
var builtInEvaluator = require('./helpers/eval').builtIn

module.exports = function (config) {
  config = extend({
    xLine: false,
    yLine: false,
    renderer: function (x, y, index) {
      return '(' + x.toFixed(3) + ', ' + y.toFixed(3) + ')'
    },
    owner: null
  }, config)

  var MARGIN = 20

  var line = d3.svg.line()
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

  function lineGenerator (el, data) {
    return el.append('path')
      .datum(data)
      .attr('stroke', 'grey')
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.5)
      .attr('d', line)
  }

  function tip (selection) {
    var innerSelection = selection.selectAll('g.tip')
      .data(function (d) { return [d] })

    // enter
    innerSelection
      .enter().append('g')
      .attr('class', 'tip')
      .attr('clip-path', 'url(#function-plot-clip-' + config.owner.id + ')')

    // enter + update = enter inner tip
    tip.el = innerSelection.selectAll('g.inner-tip')
      .data(function (d) {
        // debugger
        return [d]
      })

    tip.el.enter()
      .append('g')
      .attr('class', 'inner-tip')
      .style('display', 'none')
      .each(function () {
        var el = d3.select(this)
        lineGenerator(el, [[0, -config.owner.meta.height - MARGIN], [0, config.owner.meta.height + MARGIN]])
          .attr('class', 'tip-x-line')
          .style('display', 'none')
        lineGenerator(el, [[-config.owner.meta.width - MARGIN, 0], [config.owner.meta.width + MARGIN, 0]])
          .attr('class', 'tip-y-line')
          .style('display', 'none')
        el.append('circle').attr('r', 3)
        el.append('text').attr('transform', 'translate(5,-5)')
      })

    // enter + update
    selection.selectAll('.tip-x-line').style('display', config.xLine ? null : 'none')
    selection.selectAll('.tip-y-line').style('display', config.yLine ? null : 'none')
  }
  
  tip.move2 = function (coordinates, color,dominios) {
    var i
    var el = tip.el
    var data = el.data()[0].data
    var x0 = coordinates.x
    var y0 = coordinates.y
    for (i = 0; i < data.length; i += 1) {
      // skipTip=true skips the evaluation in the datum
      // implicit equations cannot be evaluated with a single point
      // parametric equations cannot be evaluated with a single point
      // polar equations cannot be evaluated with a single point
      if (data[i].skipTip || data[i].fnType !== 'linear') {
        console.log(dominios[0][Math.round(x0)]);
        var j
        for(j = 0; j < data[i].points.length; j += 1){
          if ((Math.round(x0) == data[i].points[j][0]) && (Math.round(y0) == data[i].points[j][1])){
            config.owner.emit('tip:updatenew', dominios[0][Math.round(x0)], dominios[1][Math.round(y0)], 0)
          }
        }  
         
        continue
      }
    }
  }    
  tip.move = function (coordinates, color, instancia) {
    var i
    var minDist = Infinity
    var closestIndex = -1
    var indexColor = 0;
    var x, y

    var el = tip.el
    var inf = 1e8
    var meta = config.owner.meta
    var data = el.data()[0].data
    var xScale = meta.xScale
    var yScale = meta.yScale
    var width = meta.width
    var height = meta.height

    var x0 = coordinates.x
    var y0 = coordinates.y
    
    for (i = 0; i < data.length; i += 1) {
      // skipTip=true skips the evaluation in the datum
      // implicit equations cannot be evaluated with a single point
      // parametric equations cannot be evaluated with a single point
      // polar equations cannot be evaluated with a single point
      if (data[i].skipTip || data[i].fnType !== 'linear') {
     /*   console.log(data[i].points[2][1]);
        var j
        for(j = 0; j < data[i].points.length; j += 1){
          if ((Math.round(x0) == data[i].points[j][0]) && (Math.round(y0) == data[i].points[j][1])){
            config.owner.emit('tip:update', Math.round(x0), Math.round(y0), 0)
          }
        }  
        */
        
        continue
      }

      var range = data[i].range || [-inf, inf]
      if (x0 > range[0] - globals.TIP_X_EPS && x0 < range[1] + globals.TIP_X_EPS) {
        
        try {  
          //Agregado 20 de agosto
          var candidateY;
   
          var id = data[i].id;
          
          var base = instancia.options.conj[id].baseDom;
          var condicion = instancia.options.conj[id].dom;
          if(base == 'R'){
            if(condicion == 'Func'){
               var funZ = instancia.options.conj[id].sets.fdom;
               if (funZ(x0)){
                candidateY = builtInEvaluator(data[i], 'fn', {x: x0})
              }
            }else{
              candidateY = builtInEvaluator(data[i], 'fn', {x: x0})
            }
          }else if(base == 'Z'){
            var xRound = Math.round(x0);
            var xz = xRound;
            if(condicion == 'Func'){
              var funX = instancia.options.conj[id].sets.fdom;
              if (funX(xz)){
                candidateY = builtInEvaluator(data[i], 'fn', {x: xz})
              }
            }else{
              candidateY = builtInEvaluator(data[i], 'fn', {x: xz})
            }
          }else{  
            var xRound = Math.round(x0)
            var xzz = xRound
            if(xRound >= 0){
              candidateY = builtInEvaluator(data[i], 'fn', {x: xzz})
            } 
          }
        } catch (e) { }
        if (utils.isValidNumber(candidateY)) {
          
          var tDist = Math.abs(candidateY - y0)
          if (tDist < minDist) {
            
            minDist = tDist
            closestIndex = i
            indexColor = (i + 1) % globals.COLORS.length
          }
        }
      }
    }

    if (closestIndex !== -1) {
    //Agregado 20 de agosto
      if (instancia.options.conj[data[closestIndex].id].baseDom == 'R'){
        x = x0
      }else{
        x = Math.round(x0)
      }
      if (data[closestIndex].range) {
        x = Math.max(x, data[closestIndex].range[0])
        x = Math.min(x, data[closestIndex].range[1])
      }
      //Aca va la comparacion
      var baseY = instancia.options.conj[data[closestIndex].id].baseCod;
      var condicionY = instancia.options.conj[data[closestIndex].id].cod;
      var posibleY = builtInEvaluator(data[closestIndex], 'fn', {x: x});
      y = undefined;
      if(baseY == 'R'){
          if(condicionY == 'Func'){
            var funY = instancia.options.conj[data[closestIndex].id].sets.fcod;
            if(funY(posibleY)){
              y = posibleY;
            }
          }else{
            y = posibleY;
          }
      }else if(posibleY == Math.round(posibleY)){
          if(condicionY == 'Func'){
            var funY = instancia.options.conj[data[closestIndex].id].sets.fcod;
            if(funY(posibleY)){
              y = posibleY;
            }
          }else{
            y = posibleY;
          }
      }    
      if (utils.isValidNumber(y)){ //Agregado 20-agosto (if-then-else)
          tip.show()
          config.owner.emit('tip:update', x, y, closestIndex)
          
          var clampX = clamp(x, xScale.invert(-MARGIN), xScale.invert(width + MARGIN))
          var clampY = clamp(y, yScale.invert(height + MARGIN), yScale.invert(-MARGIN))
          if (!color) {
            color = utils.color(data[closestIndex], indexColor)
          }

          el.attr('transform', 'translate(' + xScale(clampX) + ',' + yScale(clampY) + ')')
          el.select('circle')
            .attr('fill', color)
            .attr('r', 4)

          el.select('text')
            .attr('fill', color)
            .text(config.renderer(x, y, closestIndex)) 
      } else {
          tip.hide()
      }
    } else {
      tip.hide()
    }
  }

  tip.show = function () {
    this.el.style('display', null)
  }

  tip.hide = function () {
    this.el.style('display', 'none')
  }
  // generations of getters/setters
  Object.keys(config).forEach(function (option) {
    utils.getterSetter.call(tip, config, option)
  })

  return tip
}
