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
