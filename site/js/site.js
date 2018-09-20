'use strict';
var instance = {};  
var instanceFunction = {};
$(document).on('markupLoaded', function () {
  var functionPlot = window.functionPlot;
  var a, b, c;

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
    axis: false,
    grid: true,
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
    grid: true,
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
      stroke :"blue",
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
      stroke: '#ddd',
      rotation : 0,
      boundingBox: true,
      fnType: 'points',
      polylineType : "polygon",
      graphType: 'polyline'
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

  instanceFunction = functionPlot({
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
    conj:[
      {
       radio: 2, 
       baseDom: 'Z',
       dom: 'Z', 
       baseCod: 'Z',
       cod: 'Z',
       sets: {
         fdom:'Z',
         fcod: 'Z'}
      },
    {
      radio: 2, 
      baseDom: 'Z',
      dom: 'Func', 
      baseCod: 'Z',
      cod: 'Func',
      sets: {
        fdom:function (x) {
               return (2 <= x);
        },
        fcod: function (x) {
          return (0 <= x && x <= 4);
         }}
      },
      {
          radio: 0.3, 
          baseDom: 'R',
          dom: 'R', 
          baseCod: 'R',
          cod: 'R',
          sets: {
            fdom:'R',
            fcod:'R'}
      },
        {
                  radio: 2, 
                  baseDom: 'Z',
                  dom: 'Func', 
                  baseCod: 'Z',
                  cod: 'Z',
                  sets: {
                    fdom:function (x) {
                      return (x <= 0);
                     },
                    fcod:'Z'}
        },
        {
                      radio: 0.3, 
                      baseDom: 'R',
                      dom: 'R', 
                      baseCod: 'R',
                      cod: 'R',
                      sets: {
                        fdom:'R',
                        fcod: 'R'}
        },
        {
          radio: 2, 
          baseDom: 'Z',
          dom: 'Func', 
          baseCod: 'Z',
          cod: 'Z',
          sets: {
            fdom:function (x) {
              return (x <= 0);
             },
            fcod:'Z'}
        }           
    ],
    data: [{
      graphType: 'scatter',
            fn: function (scope) {
        var x = scope.x
        //return Math.round(x);
        return (x - 4)
      },
      id:1,
      color:'red'
    },{graphType: 'polyline',
       id: 2,
       fn: function (scope) {
        var x = scope.x
        //return Math.round(x);
        return (x * x * x)
      },      color:'blue'
    },
      {graphType: 'scatter',
      id: 3,
      fn: function (scope) {
       var x = scope.x
       //return Math.round(x);
       return (x * x)
     },color:'green' },{
      graphType: 'polyline',
            fn: function (scope) {
        var x = scope.x
        //return Math.round(x);
        return Math.cos(x)
      },
      id:4,color:'orange'
    },{
      graphType: 'scatter',
            fn: function (scope) {
        var x = scope.x
        //return Math.round(x);
        return 2/x
      },
      id:5,color:'black'
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
    conj: [{
      radio: 2,
      baseDom: 'Z',
      baseCod: 'Z', 
      cod: 'Func',
      dom: 'Numer',
      sets: {
        fdom:['Lun','Mart','Mier','Juev','Vier','Saba','Dom','Lunes'],
        fcod: function (x) {
          // scope.x = Number
          return (0 <= x);
        }
      }
    }],
    data: [{
      graphType: 'scatter',
      id: 0,
      fn: function (scope) {
        var x = scope.x
        if (x == 2){ return 1}
        else if(x == 1) { return 3}
        
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
    console.log('Instance', instance);
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
    instanceFunction = functionPlot({
      target: '#quadratic-with-options',
      xAxis: {
        label: 'x - axis',
        scale: 'linear',
        domain: {
          initial: [-10, 10]
        }
      },
      conj: [{
        radio: 4,
        baseDom: 'R',
        baseCod: 'R', 
        cod: 'R',
        dom: 'R'
      }], 
      data: [ {
        id:0,
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

  // Toggle Grid
  $('#grid-btn').click(function() {
    instance.toggleGrid();
  })
  
  // Toggle Axis
  $('#axis-btn').click(function() {
    instance.toggleAxis();
  })
  
  // Toggle Tip
  $('#tip-btn').click(function() {
    instanceFunction.toggleTip();
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

