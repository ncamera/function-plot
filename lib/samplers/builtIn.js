'use strict'
var clamp = require('clamp')
var linspace = require('linspace')

var utils = require('../utils')
var evaluate = require('../helpers/eval').builtIn

function checkAsymptote (d0, d1, meta, sign, level) {
  if (!level) {

    return {
      asymptote: true,
      d0: d0,
      d1: d1
    }
  }
  var i
  var n = 10
  var x0 = d0[0]
  var x1 = d1[0]



/*  var samples = linspace(x0,x1,n);
  var condition = false;
  var y;
  for (var p of samples){
    y = evaluate(meta, 'fn', {x: p})
    condition = condition || y != undefined;
  }
  if (!condition){
    samples=linspace(x0 - meta.point,x1 + meta.point,n);
  }
*/

  var samples = linspace(x0, x1, n)
  var oldY, oldX
  for (i = 0; i < n; i += 1) {
    var x = samples[i]
    var y = evaluate(meta, 'fn', {x: x})

    if (i) {
      var deltaY = y - oldY
      var newSign = utils.sgn(deltaY)
 
      if (newSign === sign) {

        return checkAsymptote([oldX, oldY], [x, y], meta, sign, level - 1)
      }
    }
    oldY = y
    oldX = x
  }

  return {
    asymptote: false,
    d0: d0,
    d1: d1
  }
}

/**
 * Splits the evaluated data into arrays, each array is separated by any asymptote found
 * through the process of detecting slope/sign brusque changes
 * @param chart
 * @param data
 * @returns {Array[]}
 */
function split (chart, meta, data) {

  var i, oldSign
  var deltaX
  var st = []
  var sets = []
  var domain = chart.meta.yScale.domain()
  var zoomScale = chart.meta.zoomBehavior.scale()
  var yMin = domain[0]
  var yMax = domain[1]


  
  if (data[0]) {
    st.push(data[0])
    deltaX = data[1][0] - data[0][0]
    oldSign = utils.sgn(data[1][1] - data[0][1])


  }


  function updateY (d) {
    d[1] = Math.min(d[1], yMax)
    d[1] = Math.max(d[1], yMin)

    return d
  }

  i = 1


  while (i < data.length - 1) {
    var y0 = data[i - 1][1]
    var y1 = data[i][1]
    var deltaY = y1 - y0
    var newSign = utils.sgn(deltaY)

    // make a new set if:
    if (// utils.sgn(y1) * utils.sgn(y0) < 0 && // there's a change in the evaluated values sign
      // there's a change in the slope sign
      oldSign !== newSign &&
      // the slope is bigger to some value (according to the current zoom scale)
      Math.abs(deltaY / deltaX) > 1 / zoomScale) {
      // retest this section again and determine if it's an asymptote
      var check = checkAsymptote(data[i - 1], data[i], meta, newSign, 3)

      if (check.asymptote) {
        st.push(updateY(check.d0))
        sets.push(st)
        st = [updateY(check.d1)]
      }
    }
    oldSign = newSign
    st.push(data[i])
    ++i
  }

  if (st.length) {
    sets.push(st)
  }

///Nuevo 2019
  var delta = ((Math.abs(chart.options.xAxis.domain.initial[0]) + Math.abs(chart.options.xAxis.domain.initial[1]))/1000)+0.001
  if (sets.length){
      var j = 0;
      var data1 = [];
      var m = [];
      var cont1 = sets.length;
      
      for (var t = 0; t < cont1; t++){ 
        var cant = (sets[t].length - 1)
          for (i = 0; i < cant; i++){ //Nuevo 2019
            var dis = (sets[t][i + 1][0] - sets[t][i][0]);
            if(dis > delta){
                m = sets[t].slice(j,i);
                data1.push(m);
                j=i + 1;
            }
          }
          if(j < cant){
              data1.push(sets[t].slice(j,i + 1))
          }
        }    
        sets = data1;
  }
////FIN de cambios
  return sets
}

function linear (chart, meta, range, n) {

  var allX = utils.space(chart, range, n,meta.id,meta) //Se agrego meta.id 20-agosto
  var yDomain = chart.meta.yScale.domain()
  var yDomainMargin = (yDomain[1] - yDomain[0])
  var yMin = yDomain[0] - yDomainMargin * 1e5
  var yMax = yDomain[1] + yDomainMargin * 1e5
  var data = []
  var i
  for (i = 0; i < allX.length; i += 1) {
    var x = allX[i]
    var y = evaluate(meta, 'fn', {x: x})
    var tipo = chart.options.conj[meta.id].cod; //Agregado 20 de agosto
    var baseY = chart.options.conj[meta.id].baseCod;//Agregado 20 de agosto
    var baseX = chart.options.conj[meta.id].baseDom;//Agregado 20 de agosto
    var funcion = chart.options.conj[meta.id].sets.fcod;  //Agregado 20 de agosto
    if(baseY == 'Z'){
      if(y == Math.round(y)){
        if (tipo == 'Func'){   //Agregado 20 de agosto
          if (!funcion(y)){  //Agregado 20 de agosto
            y = undefined;  //Agregado 20 de agosto
          }
        }
      }else{y = undefined;}
    }else{
      if (tipo == 'Func'){   //Agregado 20 de agosto
        if (!funcion(y)){  //Agregado 20 de agosto
          y = undefined;  //Agregado 20 de agosto
        }
      }

    }

    if (utils.isValidNumber(x) && utils.isValidNumber(y)) {
      data.push([x, clamp(y, yMin, yMax)])
    }
  }
  if (baseY == 'R' && baseX == 'R'){

    data = split(chart, meta, data)
  }else{
    data = [data];   //Agregado 20 de agosto
  }

  return data
}

function parametric (chart, meta, range, nSamples) {
  // range is mapped to canvas coordinates from the input
  // for parametric plots the range will tell the start/end points of the `t` param
  var parametricRange = meta.range || [0, 2 * Math.PI]
  var tCoords = utils.space(chart, parametricRange, nSamples,meta.id,meta)
  var samples = []
  for (var i = 0; i < tCoords.length; i += 1) {
    var t = tCoords[i]
    var x = evaluate(meta, 'x', {t: t})
    var y = evaluate(meta, 'y', {t: t})
    samples.push([x, y])
  }

  return [samples]
}

function polar (chart, meta, range, nSamples) {
  // range is mapped to canvas coordinates from the input
  // for polar plots the range will tell the start/end points of the `theta` param
  var polarRange = meta.range || [-Math.PI, Math.PI]
  var thetaSamples = utils.space(chart, polarRange, nSamples,meta.id,meta)
  var samples = []
  for (var i = 0; i < thetaSamples.length; i += 1) {
    var theta = thetaSamples[i]
    var r = evaluate(meta, 'r', {theta: theta})
    var x = r * Math.cos(theta)
    var y = r * Math.sin(theta)
    samples.push([x, y])
  }

  return [samples]
}

function points (chart, meta, range, nSamples) {

  return [meta.points]
}

function vector (chart, meta, range, nSamples) {
  meta.offset = meta.offset || [0, 0]

  return [[
    meta.offset,
    [meta.vector[0] + meta.offset[0], meta.vector[1] + meta.offset[1]]
  ]]
}

var sampler = function (chart, d, range, nSamples) {
  var fnTypes = {
    parametric: parametric,
    polar: polar,
    points: points,
    vector: vector,
    linear: linear
  }
  if (!(d.fnType in fnTypes)) {
    throw Error(d.fnType + ' is not supported in the `builtIn` sampler')
  }
  var sets = fnTypes[d.fnType].apply(null, arguments);

  return sets
}

module.exports = sampler
