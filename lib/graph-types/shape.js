/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var d3 = window.d3
var evaluate = require('../evaluate')
var utils = require('../utils')

module.exports = function (chart) {
    var width = chart.meta.width
    var height = chart.meta.height
    var drawType = {
        text: (function(shape) { return drawText(shape) }),
        circle: (function(shape) { return drawCircle(shape) }),
        rect: (function(shape) { return drawRectangule(shape) }),
        polyline: (function(shape) { return drawPoliline(shape) })
    }
    var innerSelection

    function drawText (shape) {
        innerSelection
        .append("text")
        .attr('color', shape.color)
        .attr('font-size', shape.size + 10)
        .attr('x', shape.x + (width/2))
        .attr('y', shape.y + (height/2))
        .text(shape.text)
    }

    function drawCircle (shape) {
        innerSelection
        .append('circle')
        .attr('fill', "white")
        .attr('stroke', shape.color)
        .attr('r', shape.radius)
        .attr('cx', shape.x + width/2)
        .attr('cy', shape.y)
        //.attr(d.attr)
    }

    function drawRectangule (shape) {
        innerSelection
        .append("rect")
        .attr('fill', "white")
        .attr('stroke', shape.color)
        .attr('x', shape.x + (width/2))
        .attr('y', shape.y + (height/2))
        .attr('width', shape.w + 100)
        .attr('height', shape.h + 100)
    }

    function drawPolyline (shape) {

    }

    function shape (selection) {
        innerSelection = d3.select('#shape-function > svg')

        selection.each(function (d) {
            var shapes = d.shapes
            var i
            for (i = 0; i < shapes.length; i += 1) {
                drawType[shapes[i].type](shapes[i])
            }
        })

    }

    return shape
}
