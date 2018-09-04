'use strict';
var instance = {};
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  var a, b, c;


  functionPlot({
    target: '#discrete-function1',
    tip: {
      color: 'green'
    },
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-3, 3],
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

  /**
   * ### Shape Type
   *
   * The required parameters are:
   *
   * - `graphType: 'shape'`
   * - `shapeType: 'rect'` (string) possible values: rect | circle | text |
   * - `shapes` shape data object to draw

   *  - `shapeType = rect`
   *    - `shapes.w` (number) width
   *    - `shapes.h` (number) height
   *    - `shapes.x` (number) x position
   *    - `shapes.y` (number) y position
   *    - `shapes.color` (string) possible values: rgb | hexa | name color
   *    - `shapes.rotation` (string) deg values
   */
  instance = functionPlot({
    target: '#shape-rect-function',
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-10, 10],
        type: 'discrete'
      }
    },
    data: [{
      shape: {
        w : 6.0,
        h : 3.0,
        x : 0,
        y : 0,
        fill :"red",
        stroke: "#7f8c8d",
        rotation : -45
      },
      graphType: 'shape',
      shapeType: 'rect'
    }]
  })

   /**
   *  - `Function`
   */
  functionPlot({
    title: 'y = x * x',
    target: '#quadratic-with-options',
    width: 580,
    height: 400,
    disableZoom: true,
    xAxis: {
      label: 'x - axis',
      domain: [-6, 6]
    },
    yAxis: {
      label: 'y - axis'
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
      fn: 'x^2'
    }]
  })

   /**
   *  - `shapeType = circle`
   *    - `shapes.r` (number) circle radio
   *    - `shapes.x` (number) x position
   *    - `shapes.y` (number) y position
   *    - `shapes.color` (string) possible values: rgb | hexa | name color
   *    - `shapes.rotation` (string) deg values
   */
  functionPlot({
    target: '#shape-circle-function',
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-10, 10],
        type: 'discrete'
      }
    },
    data: [{
      shape: {
        r : 2.0,
        x : -2.0,
        y : 0,
        fill :"#2980b9",
        stroke: "#ecf0f1",
        rotation : 0.0
      },
      graphType: 'shape',
      shapeType: 'circle'
    }]
  })
   /**
   *  - `shapeType = text`
   *    - `shapes.text` (string) text to draw
   *    - `shapes.size` (string) font size
   *    - `shapes.x` (number) x position
   *    - `shapes.y` (number) y position
   *    - `shapes.color` (string) possible values: rgb | hexa | name color
   *    - `shapes.rotation` (string) deg values
   */
  functionPlot({
    target: '#shape-text-function',
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-10, 10],
        type: 'discrete'
      }
    },
    data: [{
      shape: {
        text:"Here goes the text",
        size: 24,
        x : -3.5,
        y : 0,
        fill :"#27ae60",
        rotation : -90
      },
      graphType: 'shape',
      shapeType: 'text'
    }]
  })

  /**
   *  New parameters for polyline point graphics:
   * 
   *  - `polylineType` (string) possible values: line | polygon
   *  - `rotation` (string) deg values
   */
  functionPlot({
    target: '#shape-polyline-function',
    xAxis: {
      label: 'x - axis',
      scale: 'linear',
      domain: {
        initial: [-10, 10],
        type: 'discrete'
      }
    },
    data: [{
      points: [
        [-10,-2],
        [0,-4],
        [2,6],
        [15,-10]
      ],
      color :"orange",
      rotation : -90,
      fnType: 'points',
      polylineType : "line",
      graphType: 'polyline',
    },{
      points: [
        [-8,3],
        [-6,1],
        [-4,2],
        [-6,6]
      ],
      color :"green",
      rotation : 0,
      boundingBox: true,
      fnType: 'points',
      polylineType : "polygon",
      graphType: 'polyline',
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

  // Zoom
  $('#zoom-in').click(function() {
    instance.zoomIn();
  });
  $('#zoom-out').click(function() {
    instance.zoomOut();
  });

  // Update Figure Graph
  $('#update-figure').click(function() {
    instance = functionPlot({
      target: '#shape-rect-function',
      xAxis: {
        label: 'x - axis',
        scale: 'linear',
        domain: {
          initial: [-10, 10],
          type: 'discrete'
        }
      },
      data: [{
        shape: {
          r : 2.0,
          x : -2.0,
          y : 0,
          fill :"#2980b9",
          stroke: "#ecf0f1",
          rotation : 0.0
        },
        graphType: 'shape',
        shapeType: 'circle'
      }]
    })
  })

  // Update Function Graph
  $('#update-function').click(function() {
    instance = functionPlot({
      target: '#quadratic-with-options',
      xAxis: {
        label: 'x - axis',
        scale: 'linear',
        domain: {
          initial: [-10, 10]
        }
      },
      conj: {
        radio: 4,
        baseDom: 'R',
        baseCod: 'R', 
        cod: 'R',
        dom: 'R'
      }, 
      data: [ {
        fn: 'x * x * x',
        graphType: 'interval'
        //nSamples: 1000
      }]
    })
  })

  // Clear Figure
  $('#clear-figure').click(function() {
    instance.removeAllGraphs();
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

