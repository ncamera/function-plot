/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var evaluate = require('../evaluate')
var utils = require('../utils')
var clamp = require('clamp')

module.exports = function (chart) {
  var xScale = chart.meta.xScale
  var yScale = chart.meta.yScale
  
  // Boundig Box
  function drawBoundingBox (el, d, showBB) {
    var jsonArray = []
    jsonArray.push(d)
    var cxBB
    var cyBB
    var colorBB = 'transparent';
    if (showBB) {
      colorBB = '#ccc'    
    }
  
    function cxBoundingBox(cx) {
      cxBB = cx
      return cx
    }
    function cyBoundingBox(cy) {
      cyBB = cy
      return cy
    }

    // rect
    var innerSelection = el.selectAll(':scope > rect')
        .data(jsonArray)

    innerSelection.enter()
      .append("rect")
      .attr('fill', "transparent")

    innerSelection
      .attr('stroke', colorBB)
      .style("stroke-dasharray", "4,4")
      .attr('x', function (d) { return d.x })
      .attr('y', function (d) { return d.y })
      .attr('width',  function (d) { return d.width })
      .attr('height', function (d) { return d.height })

    innerSelection.exit().remove()

    // xLine
    var xMiddleLine = el.selectAll(':scope > path.x-middle-line')
    .data([ [[d.x, cyBoundingBox(d.y + d.height/2)],[d.x + d.width, d.y + d.height/2]] ])

    var line = d3.svg.line()
    .interpolate('linear')
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

    xMiddleLine.enter()
    .append('path')
    .style("stroke-dasharray", "4,4")
    .attr('class', 'x-middle-line')
    .attr('stroke', colorBB)
    
    xMiddleLine
    .attr('d', line)
    .exit().remove()

    // yLine
    var yMiddleLine = el.selectAll(':scope > path.y-middle-line')
    .data([ [[cxBoundingBox(d.x + d.width/2), d.y],[d.x + d.width/2, d.y + d.height]] ])

    var line = d3.svg.line()
    .interpolate('linear')
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

    yMiddleLine.enter()
    .append('path')
    .style("stroke-dasharray", "4,4")
    .attr('class', 'y-middle-line')
    .attr('stroke', colorBB)
    
    yMiddleLine
    .attr('d', line)
    .exit().remove()

    return {'cxBB': cxBB, 'cyBB': cyBB}
  }

  function plotLine (selection) {
    selection.each(function (d) {
      // polygon closes the first time 
      if (d.polylineType &&
          d.polylineType == 'polygon' &&
          d.points[d.points.length-1] != d.points[0]
        ) {
        d.points[d.points.length] = d.points[0]
      }
      var el = plotLine.el = d3.select(this)
      var index = d.index
      var evaluatedData = evaluate(chart, d)
      var color = utils.color(d, index)
      var innerSelection = el.selectAll(':scope > path.line')
        .data(evaluatedData)

      var yRange = yScale.range()
      var yMax = yRange[0] + 1
      var yMin = yRange[1] - 1
      if (d.skipBoundsCheck) {
        yMax = Infinity
        yMin = -Infinity
      }

      function y (d, polylineType) {
        return polylineType ? yScale(d[1]) : clamp(yScale(d[1]), yMin, yMax)
      }

      var line = d3.svg.line()
        .interpolate('linear')
        .x(function (d) { return xScale(d[0]) })
        .y(y, d.polylineType)
      var area = d3.svg.area()
        .x(function (d) { return xScale(d[0]) })
        .y0(yScale(0))
        .y1(y)

      innerSelection.enter()
        .append('path')
        .attr('class', 'line line-' + index)
        .attr('stroke-width', 1)
        .attr('stroke-linecap', 'round')

      // enter + update
      innerSelection
        .each(function () {
          var path = d3.select(this)
          var pathD
          if (d.closed) {
            path.attr('fill', color)
            path.attr('fill-opacity', 0.3)
            pathD = area
          } else {
            path.attr('fill', 'none')
            pathD = line
          }
          path
            .attr('stroke', color)
            .attr('marker-end', function () {
              // special marker for vectors
              return d.fnType === 'vector'
                ? 'url(#' + chart.markerId + ')'
                : null
            })
            .attr('d', pathD)
        })
        .attr(d.attr)

      innerSelection.exit().remove()

      // Draw Bounding Box
      var bbox = innerSelection.node().getBBox();
      var centerBB = drawBoundingBox(el,bbox,d.boundingBox);
      
      if (typeof d.rotation !== "undefined") {
        el.attr("transform-origin", function (d) { return centerBB.cxBB+'px ' + centerBB.cyBB+'px' })
        el.attr("transform", "rotate("+utils.toDegree(-d.rotation)+")")  
      }
     })
  }

  return plotLine
}
