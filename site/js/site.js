'use strict';
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  var a, b, c;

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
      },
      yAxis: {
        domain: [-4, 4] 
      },
    

    },
    conj: {
      radio: 0.1,
      baseDom: 'R',
      baseCod: 'Z', 
      cod: 'Func',
      dom: 'Func',
      sets: {
        fcod: function (x) {
          // scope.x = Number
          return (0 <= x);
        },
        fdom: function (x) {
          // scope.x = Number
          return (0 <= x);
        }
      }
    },
    data: [{
      graphType: 'scatter',
      fn: function (scope) {
        var x = scope.x
       // return Math.round(x);
        return Math.sin(x)
      }
    }]
  })
  
  functionPlot({
    target: '#implicit-complex',
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-4, 4],
        type: 'discrete'
      },
      yAxis: {
        domain: [-4, 4] 
      },
    

    },
    conj: {
      radio: 2,
      baseDom: 'Z',
      baseCod: 'Z', 
      cod: 'Numer',
      dom: 'Func',
      sets: {
        fcod:['Lun','Mart','Mier','Juev','Vier','Saba','Dom','Lunes'],
        fdom: function (x) {
          // scope.x = Number
          return (0 <= x);
        }
      }
    },
    data: [{
      graphType: 'scatter',
      fn: function (scope) {
        var x = scope.x
        return x;
        //return Math.sin(x)
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
