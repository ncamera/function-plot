/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var utils = require('../utils')
var polylineModule = require('./polyline')

module.exports = function (chart) {
    var xScale = chart.meta.xScale
    var yScale = chart.meta.yScale
 
    var drawType = {
        text: (function(el, shape) { return drawText(el, shape) }),
        circle: (function(el, shape) { return drawCircle(el, shape) }),
        rect: (function(el, shape) { return drawRectangule(el, shape) }),
    }

    function drawText (el, shape) {
        var jsonArray = []
            jsonArray.push(shape)
        var innerSelection = el.selectAll('text')
            .data(jsonArray)

        innerSelection.enter()
            .append("text")
            .attr('color', shape.color)

        innerSelection
            .attr('stroke', shape.color)
            .attr('font-size', function (d) { return xScale(shape.size)/40 + 'px' })
            .attr('x', function (d) { return xScale(d.x) })
            .attr('y', function (d) { return yScale(d.y) })
            .text(shape.text)
        // .attr(d.attr)
        
        innerSelection.exit().remove()
    }

    function drawCircle (el, shape) {
        var jsonArray = []
            jsonArray.push(shape)
        var innerSelection = el.selectAll('circle')
            .data(jsonArray)

        innerSelection.enter()
            .append("circle")
            .attr('fill', "transparent")

        innerSelection
            .attr('stroke', shape.color)
            .attr('cx', function (d) { return xScale(d.x) })
            .attr('cy', function (d) { return yScale(d.y) })
            .attr('r',  function (d) { var r = xScale(d.x + d.r) - xScale(d.x); return r })
        // .attr(d.attr)
        
        innerSelection.exit().remove()
    }

    function drawRectangule (el, shape) {
        var jsonArray = []
            jsonArray.push(shape)
        var innerSelection = el.selectAll('rect')
            .data(jsonArray)

        innerSelection.enter()
            .append("rect")
            .attr('fill', "transparent")

        innerSelection
            .attr('stroke', shape.color)
            .attr('x', function (d) { return xScale(d.x) })
            .attr('y', function (d) { var y = d.y + d.h; return yScale(y) })
            .attr('width',  function (d) { var w = xScale(d.w) - xScale(d.x); return w })
            .attr('height', function (d) { var h = xScale(d.y + d.h) - xScale(d.y);  return h })
           // .attr(d.attr)
        
        innerSelection.exit().remove()
    }

    function shape (selection) {
        selection.each(function (d) {
            var el = d3.select(this)
            drawType[d.shapeType](el, d.shape)
        })

    }

    return shape
}
