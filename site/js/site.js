'use strict';
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  var a, b, c;

  /**
   * ### Discrete Domain
   *
   * The shortest example, the function $y = sin(x)$ is evaluated with integer values inside the range
   *
   * The required parameters are:
   *
   * - `graphType: 'scatter'`
   * - `xAxis` an object which contain info about the domain
   *  - `xAxis.type` (string) possible values: discrete | real
   */

  functionPlot({
    target: '#built-in-eval-function',
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
