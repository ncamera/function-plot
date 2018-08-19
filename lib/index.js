/*
 * function-plot
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */
'use strict'
require('./polyfills')

var d3 = window.d3

var events = require('events')
var extend = require('extend')

var mousetip = require('./tip')
var helpers = require('./helpers/')
var annotations = require('./helpers/annotations')
var datumDefaults = require('./datum-defaults')

var globals
var graphTypes
var cache = []

module.exports = function (options) {
  options = options || {}
  options.data = options.data || []

  // globals
  var width, height
  var margin
  var zoomBehavior
  var xScale, yScale
  var line = d3.svg.line()
    .x(function (d) { return xScale(d[0]) })
    .y(function (d) { return yScale(d[1]) })

  function Chart () {
    var n = Math.random()
    var letter = String.fromCharCode(Math.floor(n * 26) + 97)
    this.id = options.id = letter + n.toString(16).substr(2)
    this.linkedGraphs = [this]
    this.options = options
    this.updateData()
    cache[this.id] = this
    this.setUpEventListeners()
  }

  Chart.prototype = Object.create(events.prototype)

  /**
   * Rebuilds the entire graph from scratch recomputing
   *
   * - the inner width/height
   * - scales/axes
   *
   * After this is done it does a complete redraw of all the datums,
   * if only the datums need to be redrawn call `instance.draw()` instead
   *
   * @returns {Chart}
   */
  Chart.prototype.build = function () {
    this.internalVars()
    this.drawGraphWrapper()
    return this
  }

  Chart.prototype.initializeAxes = function () {
    var integerFormat = d3.format('s')
    var format = function (scale) {
      return function (d) {
        var decimalFormat = scale.tickFormat(10)
        var isInteger = d === +d && d === (d | 0)
        // integers: d3.format('s'), see https://github.com/mbostock/d3/wiki/Formatting
        // decimals: default d3.scale.linear() formatting see
        //    https://github.com/mbostock/d3/blob/master/src/svg/axis.js#L29
        return isInteger ? integerFormat(d) : decimalFormat(d)
      }
    }

    function computeYScale (xScale) {
      // assumes that xScale is a linear scale
      var xDiff = xScale[1] - xScale[0]
      return height * xDiff / width
    }

    options.xAxis = options.xAxis || {}
    options.xAxis.scale = options.xAxis.scale || 'linear'
    options.xAxis.domain = options.xAxis.domain || {}

    options.yAxis = options.yAxis || {}
    options.yAxis.scale = options.yAxis.scale || 'linear'
    options.yAxis.domain = options.yAxis.domain || {}

    var xDomain = this.meta.xDomain = (function (axis) {
      if (axis.domain.initial) {
        return axis.domain.initial
      }
      if (axis.scale === 'linear') {
        var xLimit = 12
        return [-xLimit / 2, xLimit / 2]
      } else if (axis.scale === 'log') {
        return [1, 10]
      }
      throw Error('axis scale ' + axis.scale + ' unsupported')
    })(options.xAxis)

    var yDomain = this.meta.yDomain = (function (axis) {
      if (axis.domain.initial) {
        return axis.domain.initial
      }
      var yLimit = computeYScale(xDomain)
      if (axis.scale === 'linear') {
        return [-yLimit / 2, yLimit / 2]
      } else if (axis.scale === 'log') {
        return [1, 10]
      }
      throw Error('axis scale ' + axis.scale + ' unsupported')
    })(options.yAxis)

    if (xDomain[0] >= xDomain[1]) {
      throw Error('the pair defining the x-domain is inverted')
    }
    if (yDomain[0] >= yDomain[1]) {
      throw Error('the pair defining the y-domain is inverted')
    }
    //

  

    
    xScale = this.meta.xScale = d3.scale[options.xAxis.scale]()
      .domain(xDomain)
     // .domain(data.map(function(d){ return d.month}))
      .range(options.xAxis.invert ? [width, 0] : [0, width])
    //  .rangeBands([0, width*0.95])
    yScale = this.meta.yScale = d3.scale[options.yAxis.scale]()
      .domain(yDomain)
    //  .domain(data.map(function(d){ return d.month}))
      .range(options.yAxis.invert ? [0, height] : [height, 0])
     //.rangeBands([0, width*0.95])

    this.meta.xAxis = d3.svg.axis()
      .scale(xScale)
      .tickSize(options.grid ? -height : 0)
      //.tickFormat(format(Scale))
      .orient('bottom')
    this.meta.yAxis = d3.svg.axis()
      .scale(yScale)
      .tickSize(options.grid ? -width : 0)
      //.tickFormat(format(Scale2))
      .orient('left')

 
  }

  Chart.prototype.internalVars = function () {
    // measurements and other derived data
    this.meta = {}

    margin = this.meta.margin = {left: 30, right: 30, top: 20, bottom: 20}
    // margin = this.meta.margin = {left: 0, right: 0, top: 20, bottom: 20}
    // if there's a title make the top margin bigger
    if (options.title) {
      this.meta.margin.top = 40
    }

    zoomBehavior = this.meta.zoomBehavior = d3.behavior.zoom()

    // inner width/height
    width = this.meta.width = (options.width || globals.DEFAULT_WIDTH) -
      margin.left - margin.right
    height = this.meta.height = (options.height || globals.DEFAULT_HEIGHT) -
      margin.top - margin.bottom

    this.initializeAxes()
  }

  Chart.prototype.drawGraphWrapper = function () {
    var root = this.root = d3.select(options.target).selectAll('svg')
      .data([options])
    // enter
    this.root.enter = root.enter()
      .append('svg')
      .attr('class', 'function-plot')
      .attr('font-size', this.getFontSize())

    // merge
    root
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    this.buildTitle()
    this.buildLegend()
    this.buildCanvas()
    this.buildClip()
    this.buildAxis()
    this.buildAxisLabel()

    // draw each datum after the wrapper was set up
    this.draw()

    // helper to detect the closest fn to the cursor's current abscissa
    var tip = this.tip = mousetip(extend(options.tip, { owner: this }))
    this.canvas
      .call(tip)

    this.buildZoomHelper()
    this.setUpPlugins()
  }

  Chart.prototype.buildTitle = function () {
    // join
    var selection = this.root.selectAll('text.title')
      .data(function (d) {
        return [d.title].filter(Boolean)
      })

    // enter
    selection.enter()
      .append('text')
      .attr('class', 'title')
      .attr('y', margin.top / 2)
      .attr('x', margin.left + width / 2)
      .attr('font-size', 25)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(options.title)

    // exit
    selection.exit().remove()
  }

  Chart.prototype.buildLegend = function () {
    // enter
    this.root.enter
      .append('text')
      .attr('class', 'top-right-legend')
      .attr('text-anchor', 'end')

    // update + enter
    this.root.select('.top-right-legend')
      .attr('y', margin.top / 2)
      .attr('x', width + margin.left)
  }

  Chart.prototype.buildCanvas = function () {
    var self = this
    this.meta.zoomBehavior
      .x(xScale)
      .y(yScale)
      .on('zoom', function onZoom () {
        self.emit('all:zoom', d3.event.translate, d3.event.scale)
      })

    // enter
    var canvas = this.canvas = this.root
      .selectAll('.canvas')
      .data(function (d) { return [d] })
    this.canvas.enter = canvas.enter()
      .append('g')
      .attr('class', 'canvas')

    // enter + update
  }

  Chart.prototype.buildClip = function () {
    // (so that the functions don't overflow on zoom or drag)
    var id = this.id
    var defs = this.canvas.enter.append('defs')
    defs.append('clipPath')
      .attr('id', 'function-plot-clip-' + id)
      .append('rect')
      .attr('class', 'clip static-clip')

    // enter + update
    this.canvas.selectAll('.clip')
      .attr('width', width)
      .attr('height', height)

    // marker clip (for vectors)
    this.markerId = this.id + '-marker'
    defs.append('clipPath')
      .append('marker')
      .attr('id', this.markerId)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5L0,0')
      .attr('stroke-width', '0px')
      .attr('fill-opacity', 1)
      .attr('fill', '#777')
  }

  Chart.prototype.buildAxis = function () {


   var canvasEnter = this.canvas.enter

    canvasEnter.append('g')
      .attr('class', 'x axis')
    canvasEnter.append('g')
      .attr('class', 'y axis');
		

    // update
    

    this.canvas.select('.x.axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(this.meta.xAxis)
   this.canvas.select('.y.axis')
       .call(this.meta.yAxis)



   

  }

  Chart.prototype.buildAxisLabel = function () {
    // axis labeling
    var xLabel, yLabel
    var canvas = this.canvas

    xLabel = canvas.selectAll('text.x.axis-label')
      .data(function (d) {
        return [d.xAxis.label].filter(Boolean)
      })
    xLabel.enter()
      .append('text')
      .attr('class', 'x axis-label')
      .attr('text-anchor', 'end')
    xLabel
      .attr('x', width)
      .attr('y', height - 6)
      .text(function (d) { return d })
    xLabel.exit().remove()

    yLabel = canvas.selectAll('text.y.axis-label')
      .data(function (d) {
        return [d.yAxis.label].filter(Boolean)
      })
    yLabel.enter()
      .append('text')
      .attr('class', 'y axis-label')
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)')
    yLabel
      .text(function (d) { return d })
    yLabel.exit().remove()
  }

  /**
   * @private
   *
   * Draws each of the datums stored in data.options, to do a full
   * redraw call `instance.draw()`
   */
  Chart.prototype.buildContent = function () {
    var self = this
    var canvas = this.canvas

    canvas
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoomBehavior)
      .each(function () {
        var el = d3.select(this)
        // make a copy of all the listeners available to be removed/added later
        var listeners = [
          'mousedown',
          'touchstart',
          ('onwheel' in document ?
            'wheel' : 'ononmousewheel' in document ?
            'mousewheel' :
            'MozMousePixelScroll')
        ].map(function (d) { return d + '.zoom' })
        if (!el._zoomListenersCache) {
          listeners.forEach(function (l) {
            el['_' + l] = el.on(l)
          })
          el._zoomListenersCache = true
        }
        function setState (state) {
          listeners.forEach(function (l) {
            state ? el.on(l, el['_' + l]) : el.on(l, null)
          })
        }
        setState(!options.disableZoom)
      })

    var content = this.content = canvas.selectAll(':scope > g.content')
      .data(function (d) { return [d] })

    // g tag clipped to hold the data
    content.enter()
      .append('g')
      .attr('clip-path', 'url(#function-plot-clip-' + this.id + ')')
      .attr('class', 'content')

    // helper line, x = 0
    if (options.xAxis.scale === 'linear') {
      var yOrigin = content.selectAll(':scope > path.y.origin')
      .data([ [[0, yScale.domain()[0]], [0, yScale.domain()[1]]] ])
      yOrigin.enter()
      .append('path')
      .attr('class', 'y origin')
      .attr('stroke', 'black')
      .attr('opacity', 0.2)
      yOrigin.attr('d', line)
    }

    // helper line y = 0
    if (options.yAxis.scale === 'linear') {
      var xOrigin = content.selectAll(':scope > path.x.origin')
        .data([ [[xScale.domain()[0], 0], [xScale.domain()[1], 0]] ])
      xOrigin.enter()
        .append('path')
        .attr('class', 'x origin')
        .attr('stroke', 'black')
        .attr('opacity', 0.2)
      xOrigin.attr('d', line)
    }

    // annotations
    content
      .call(annotations({ owner: self }))

    // clean all graph tags in the svg
    content.selectAll(':scope > g.graph').remove();

    // content construction
    // - join options.data to <g class='graph'> elements
    // - for each datum determine the sampler to use
    var graphs = content.selectAll(':scope > g.graph')
      .data(function (d) {
        return d.data.map(datumDefaults)
      })

    // enter
    graphs
      .enter()
      .append('g')
      .attr('class', 'graph')

    // enter + update
    graphs
      .each(function (d, index) {
        // additional options needed in the graph-types/helpers
        d.index = index
        
        d3.select(this)
          .call(graphTypes[d.graphType](self))
        d3.select(this)
          .call(helpers(self))
      })
  }

  Chart.prototype.buildZoomHelper = function () {
    // dummy rect (detects the zoom + drag)
    var self = this

    // enter
    this.draggable = this.canvas.enter
      .append('rect')
      .attr('class', 'zoom-and-drag')
      .style('fill', 'none')
      .style('pointer-events', 'all')

    // update
    this.canvas.select('.zoom-and-drag')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function () {
        self.emit('all:mouseover')
      })
      .on('mouseout', function () {
        self.emit('all:mouseout')
      })
      .on('mousemove', function () {
        self.emit('all:mousemove')
      })
  }

  Chart.prototype.setUpPlugins = function () {
    var plugins = options.plugins || []
    var self = this
    plugins.forEach(function (plugin) {
      plugin(self)
    })
  }

  Chart.prototype.addLink = function () {
    for (var i = 0; i < arguments.length; i += 1) {
      this.linkedGraphs.push(arguments[i])
    }
  }

  Chart.prototype.updateAxes = function () {
    var instance = this
    var canvas = instance.canvas

    if (this.options.conj) {
      ///Eje x
      if (this.options.conj.dom == 'Numer'){
        var valores = this.options.conj.sets.fdom;
        var cant = (valores.length / 2);
        this.meta.xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(options.grid ? -height : 0)
        .tickFormat(function(d){if (d == Math.round(d) && 0 <= d) { return valores[Math.abs(parseInt(d, 10))];}})
        .orient('bottom')
      }else if(this.options.conj.dom == 'Func'){
        var fun1 = this.options.conj.sets.fdom;
        if(this.options.conj.baseDom == 'Z'){
          this.meta.xAxis = d3.svg.axis()
          .scale(xScale)
          .tickSize(options.grid ? -height : 0)
          .tickFormat(function(d) {if (d == Math.round(d) && fun1(d)){ return d }})
          .orient('bottom')
        }else{
          this.meta.xAxis = d3.svg.axis()
          .scale(xScale)
          .tickSize(options.grid ? -height : 0)
          .tickFormat(function(d) {if (fun1(d)){ return d }})
          .orient('bottom')
        }
      }else if(this.options.conj.dom == 'Z'){
        this.meta.xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(options.grid ? -height : 0)
        .tickFormat(function(d) {if (d == Math.round(d)){ return parseInt(d, 10) }})
        .orient('bottom')
      }  
    
      ///Eje y
      if (this.options.conj.cod == 'Numer'){
        var valores = this.options.conj.sets.fcod;
        this.meta.yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(options.grid ? -width : 0)
        .tickFormat(function(d) {if (d == Math.round(d) && 0 <= d) { return  valores[Math.abs(parseInt(d, 10))];}})
        .orient('left')
      }else if(this.options.conj.cod == 'Func'){
        var fun2 = this.options.conj.sets.fcod;
        if (this.options.conj.baseCod == 'Z'){
          this.meta.yAxis = d3.svg.axis()
          .scale(yScale)
          .tickSize(options.grid ? -width : 0)
          .tickFormat(function(d) {if (d == Math.round(d) && fun2(d)){ return d }})
          .orient('left')
        } else  { 
          this.meta.yAxis = d3.svg.axis()
          .scale(yScale)
          .tickSize(options.grid ? -width : 0)
          .tickFormat(function(d) {if (fun2(d)){ return d }})
          .orient('left')
        }
      }else if (this.options.conj.cod == 'Z'){
        this.meta.yAxis = d3.svg.axis()
        .scale(yScale)
        .tickSize(options.grid ? -width : 0)
        .tickFormat(function(d) {if (d == Math.round(d)){ return parseInt(d, 10) }})
        .orient('left')
      }
    }
      
    canvas.select('.x.axis').call(this.meta.xAxis)
    canvas.select('.y.axis').call(this.meta.yAxis)

    // updates the style of the axes
    canvas.selectAll('.axis path, .axis line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('shape-rendering', 'crispedges')
      .attr('opacity', 0.1)
  }

  Chart.prototype.syncOptions = function () {
    // update the original options yDomain and xDomain
    
    this.options.xAxis.domain.initial = this.meta.xScale.domain()
    this.options.yAxis.domain.initial = this.meta.yScale.domain()
  }

  Chart.prototype.zoomIn = function(k) {
    var instance = this
    var currentScale = instance.meta.zoomBehavior.scale()
    var currentTranslate = instance.meta.zoomBehavior.translate();

    var k = k || 1.2 // Increase factor
    var scale = k*currentScale
    var translate = []
    translate[0] = currentTranslate[0] - Math.abs(scale*width - currentScale*width)/2
    translate[1] = currentTranslate[1] - Math.abs(scale*height - currentScale*height)/2

    instance.emit('zoom', translate, scale)
    instance.draw()
  }

  Chart.prototype.zoomOut = function(k) {
    var instance = this
    var currentScale = instance.meta.zoomBehavior.scale()
    var currentTranslate = instance.meta.zoomBehavior.translate();

    var k = k || 0.8 // Decrease factor
    var scale = k*currentScale
    var translate = []
    translate[0] = currentTranslate[0] + Math.abs(scale*width - currentScale*width)/2
    translate[1] = currentTranslate[1] + Math.abs(scale*height - currentScale*height)/2

    instance.emit('zoom', translate, scale)
    instance.draw()
  }

  Chart.prototype.recenter = function() {
    var instance = this
    instance.emit('zoom', [0,0], 1)
    instance.draw()
  }

  Chart.prototype.programmaticZoom = function (xDomain, yDomain) {
    var instance = this
    d3.transition()
      .duration(750)
      .tween('zoom', function () {
        var ix = d3.interpolate(xScale.domain(), xDomain)
        var iy = d3.interpolate(yScale.domain(), yDomain)
        return function (t) {
          zoomBehavior
            .x(xScale.domain(ix(t)))
            .y(yScale.domain(iy(t)))
          instance.draw()
        }
      })
      .each('end', function () {
        instance.emit('programmatic-zoom')
      })
  }

  Chart.prototype.getFontSize = function () {
    return Math.max(Math.max(width, height) / 50, 8)
  }

  Chart.prototype.draw = function () {
    var instance = this
    instance.emit('before:draw')
    instance.syncOptions()
    instance.updateAxes()
    instance.buildContent()
    instance.emit('after:draw')
  }

  Chart.prototype.setUpEventListeners = function () {
    var instance = this

    var events = {
      mousemove: function (coordinates) {
        instance.options.tip = instance.options.tip || {}
        var delta = 0.2
        // var move = true;
       // if (instance.options.xAxis.domain.type == 'discrete') {
      if (this.options.conj) {
        if (this.options.conj.dom =='Func') {
          var fun = this.options.conj.sets.fdom;
          if ( this.options.conj.baseDom != 'R'){
            var xRound = Math.round(coordinates.x)
            coordinates.x = xRound
          }  
          if (fun(coordinates.x)){
            instance.tip.move(coordinates, instance.options.tip.color)
          }
        } else if (this.options.conj.dom =='Numer' || this.options.conj.dom =='Z' || this.options.conj.dom =='N'){  //Cambio 1 de agosto
            var xRound = Math.round(coordinates.x)
            if(this.options.conj.dom =='N'){
              if(xRound >= 0){
                coordinates.x = xRound 
                instance.tip.move(coordinates, instance.options.tip.color)
              } 
            }else if(this.options.conj.dom =='Numer'){
              if(xRound >= 0 && this.options.conj.sets.fdom.length >= xRound){
                coordinates.x = xRound 
                instance.tip.move(coordinates, instance.options.tip.color)
              } 
            }else{
              coordinates.x = xRound
              instance.tip.move(coordinates, instance.options.tip.color)
            }
        } else { instance.tip.move(coordinates, instance.options.tip.color)}
        }
      },

      mouseover: function () {
        instance.tip.show()
      },

      mouseout: function () {
        instance.tip.hide()
      },

      zoom: function (translate, scale) {
       
        zoomBehavior
          .translate(translate)
          .scale(scale)
      },

      'tip:update': function (x, y, index) {
        
        var meta = instance.root.datum().data[index]
        var title = meta.title || ''
        var format = meta.renderer || function (x, y) {
            
            return x.toFixed(3) + ', ' + y.toFixed(3)
          }

        var text = []
        title && text.push(title)
        text.push(format(x, y))

        instance.root.select('.top-right-legend')
          .attr('fill', globals.COLORS[index])
          .text(text.join(' '))
      },

      'tip:updatenew': function (x, y, index) {
        
        var meta = instance.root.datum().data[index]
        var title = meta.title || ''
        var format = meta.renderer || function (x, y) {
            
            return x + ', ' + y
          }

        var text = []
        title && text.push(title)
        text.push(format(x, y))

        instance.root.select('.top-right-legend')
          .attr('fill', globals.COLORS[index])
          .text(text.join(' '))
      }

    }

    var all = {
      mousemove: function () {       
        
        var mouse = d3.mouse(instance.root.select('rect.zoom-and-drag').node())

        var coordinates = {
          x: xScale.invert(mouse[0]),
          y: yScale.invert(mouse[1])
        }
        
        instance.linkedGraphs.forEach(function (graph) {
          graph.emit('before:mousemove', coordinates)
          graph.emit('mousemove', coordinates)  //Por aca pasa 
        })
      },

      zoom: function (translate, scale) {
        instance.linkedGraphs.forEach(function (graph, i) {
          graph.emit('zoom', translate, scale)
          graph.draw()
        })

        // emit the position of the mouse to all the registered graphs
        instance.emit('all:mousemove')
      }

    }

    Object.keys(events).forEach(function (e) {
      instance.on(e, events[e])
      // create an event for each event existing on `events` in the form 'all:' event
      // e.g. all:mouseover all:mouseout
      // the objective is that all the linked graphs receive the same event as the current graph
      !all[e] && instance.on('all:' + e, function () {
        var args = Array.prototype.slice.call(arguments)
        instance.linkedGraphs.forEach(function (graph) {
          var localArgs = args.slice()
          localArgs.unshift(e)
          graph.emit.apply(graph, localArgs)
        })
      })
    })

    Object.keys(all).forEach(function (e) {
      instance.on('all:' + e, all[e])
    })
  }

  Chart.prototype.updateData = function() {
    var instance = this
    var removeChartId = null
    for (var id in cache) {
      var chart = cache[id];
      if (chart.options.target === instance.options.target) {
        instance.options.data = chart.options.data.concat(instance.options.data)
        removeChartId = id
        break;
      }
    }
    if (removeChartId) {
      delete cache[removeChartId];
    }
  }

  var instance = cache[options.id]
  if (!instance) {
    instance = new Chart()
  }
  return instance.build()
}
globals = module.exports.globals = require('./globals')
graphTypes = module.exports.graphTypes = require('./graph-types/')
module.exports.plugins = require('./plugins/')
module.exports.eval = require('./helpers/eval')
