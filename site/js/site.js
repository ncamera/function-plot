'use strict';
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  var a, b, c;

    /**
   * ### Shape Type
   *
   * The required parameters are:
   *
   * - `graphType: 'shape'`
   * - `shapes` an array which contain objects with info of each shape to represent
   *  - `shapes.type` (string) possible values: text | circle | rect | polyline
   *  - `shapes.type = text` (string) possible values: text | circle | rect | polyline
   *    - `shapes.text` (string) text to represent
   *    - `shapes.size` (string) font size
   *    - `shapes.x` (string) x position
   *    - `shapes.y` (string) y position
   *    - `shapes.color` (string) possible values: rgb | hexa | name color
   *    - `shapes.rotation` (string) deg values
   */

  functionPlot({
    target: '#shape-function',
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-4, 4],
        type: 'discrete'
      }
    },
    data: [{
      graphType: 'shape',
      shapes: [{
        type :"text",
        text:"here goes the text",
        size: 8.0,
        x : 0.0,
        y : -5.0,
        color :"black",
        rotation : 0.0
      }, {
        type :"rect",
        w : 4.0,
        h : 2.0,
        x : 5.0,
        y : -2.0,
        color :"red",
        rotation : 0.0
      }]
    }]
  })

  /**
   * ### Discrete Domain
   *
   * The function $y = sin(x)$ is evaluated with integer values inside the range.
   *
   * The required parameters are:
   *
   * - `graphType: 'scatter'`
   * - `xAxis` an object which contain info about the domain
   *  - `xAxis.type` (string) possible values: discrete | real
   * 
   * Also, we add new "color" property for tip element. 
   * 
   * - `tip.color` (string) possible values: rgb | hexa | name color
   * 
   */

  functionPlot({
    target: '#discrete-function',
    tip: {
      color: 'green'
    },
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-4, 4],
        type: 'discrete'
      }
    },
    data: [{
      graphType: 'scatter',
      fn: function (scope) {
        // scope.x = Number
        var x = scope.x
        return Math.sin(x)
      }
    }]
  })
  /** */

})

$('#wzrd').load('partials/wzrd.html')

$('#examples').load('partials/examples.html', function () {
  $(document).trigger('markupLoaded')
  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block)
  })

  $('#p-slider').on('change', function () {
    var value = +this.value;
    $('#p-slider-value').html(value)
  })
})


//$('#brcdn').load('partials/brcdn-module.html .panel.panel-primary', function () {
//  clipboard()
//})
//
//function clipboard() {
//  ZeroClipboard.config( { swfPath: "//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.2.0/ZeroClipboard.swf" } )
//  var elements = [].slice.call(document.querySelectorAll('[data-clipboard-text]'))
//  var client = new ZeroClipboard(elements)
//  client.on('ready', function (event) {
//    elements.forEach(function (el) {
//      el.addEventListener('click', function (e) {
//        e.preventDefault()
//      }, false)
//    })
//    client.on('aftercopy', function (e) {
//      e.target.setAttribute('class', 'btn btn-sm btn-success')
//      setTimeout(function () {
//        e.target.setAttribute('class', 'btn btn-sm btn-primary')
//      }, 200)
//    })
//  })
//}
