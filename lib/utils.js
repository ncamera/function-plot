/**
 * Created by mauricio on 3/29/15.
 */
'use strict'
var linspace = require('linspace')
var logspace = require('logspace')
var log10 = require('log10')
var arrayRange = require('array-range')
var evaluate = require('./helpers/eval').builtIn

var globals = require('./globals')

module.exports = {
  isValidNumber: function (v) {
    return typeof v === 'number' && !isNaN(v)
  },

  
  space: function (chart, range, n, id,meta) { //Se coloco la busqueda de su conjunto 20-agosto
    var lo = range[0]
    var hi = range[1]
    n = n + 2000
    if (chart.options.xAxis.scale === 'log') {
      return logspace(log10(lo), log10(hi), n)
    } else if (chart.options.conj[id].dom =='Numer' || chart.options.conj[id].dom == 'Z' || chart.options.conj[id].dom == 'N'){ 
         if(chart.options.conj[id].dom =='Numer'){ //1 de agosto
             return arrayRange(0, chart.options.conj[0].sets.fdom.length )
         }else if( chart.options.conj[id].dom == 'N') {    
             return arrayRange(0, hi);
         }else{return arrayRange(lo-1, hi+1 );}
    }else if (chart.options.conj[id].dom =='Func') { 
        var fun = chart.options.conj[id].sets.fdom;
        if(chart.options.conj[id].baseDom == 'R'){
          var valores = linspace(lo,hi,n);
          var y;
          var cont = 0;
          for (var p of valores){
            y = evaluate(meta, 'fn', {x: p})
            if (y != undefined){
              cont += 1;
            }
          }
          if (cont < 2){
            ponts=linspace(lo - meta.point,hi + meta.point,n);
          }



          
        }else {  
          var valores = arrayRange(lo-1, hi+1 );
        }  
        var valores2 = [];
        for (var i = 0; i < valores.length; i += 1){ 
          if (fun(valores[i])){
            valores2.push(valores[i]);
          }
        }
        return valores2;
    }

    var ponts = linspace(lo,hi,n);
    var y;
    var cont = 0;
    for (var p of ponts){
      y = evaluate(meta, 'fn', {x: p})
      if (y != undefined){
         cont += 1;
      }
      
    }
    if (cont < 2){
      ponts=linspace(lo - meta.point,hi + meta.point,n);
    }
    // default is linear
    //console.log(this.minDistan(ponts));
    cont= 0;
    for (var p of ponts){
      y = evaluate(meta, 'fn', {x: p})
      if (y != undefined){
         cont += 1;
      }
    }
    if (cont < 2){
      ponts=[];
    }

    return ponts

  },

  minDistan: function(puntos){
    var flags = true;
    var minDis = 0;
    for (var p = 1; p < puntos.largo; p++){
        flags = true;
        var p0 = puntos[p - 1];
        var p1 = puntos[p]   
        while(flags){
            var mx = (p0 + p1)/2
            y0 = evaluate(meta, 'fn', {x: p0})
            y1 = evaluate(meta, 'fn', {x: p1})
            my = evaluate(meta, 'fn', {x: mx})
            
            if (this.sgn(y1 - y0) != this.sgn(my - y0)){
              console.log("Entra aca")
                p1 = mx;
                if(minDis > (p1 - p0)){
                    minDis = p1 - p0;
                }
            }else{
                flags = false;
            }
        }

    }
    return minDis;
  },
   
  getterSetter: function (config, option) {
    var me = this
    this[option] = function (value) {
      if (!arguments.length) {
        return config[option]
      }
      config[option] = value
      return me
    }
  },

  sgn: function (v) {
    if (v < 0) { return -1 }
    if (v > 0) { return 1 }
    return 0
  },

  color: function (data, index) {
    var color
    if (data.color) {
      color = data.color
      if (globals.FLAT_COLORS.hasOwnProperty(data.color)) {
        color = globals.FLAT_COLORS[data.color]
      }
    } else {
      color = globals.COLORS[index]
    }
    return color;
  },

  flatColor: function (color) {
    return globals.FLAT_COLORS.hasOwnProperty(color) ? globals.FLAT_COLORS[color] : color;
  },

  toDegree: function (r) {
    if ( r === 0 || r === -0 ) {
      return 0;
    } else {
      return (r * 360) % 360
    }
  }
}
