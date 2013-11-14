/*! Sparktable - v0.1.0 - 2013-11-13
* https://github.com/bantic/sparktable-jquery-plugin
* Copyright (c) 2013 Cory Forsyth; Licensed MIT */
/*! Sparktable - v0.1.0 - 2013-08-04
* https://github.com/bantic/sparktable-jquery-plugin
* Copyright (c) 2013 Cory Forsyth; Licensed MIT */
(function($) {

  var defaultOpts = {
    namespace: 'sparktable',

    /* the selector to use to find elements from the table */
    tdSelector: 'td',

    /* verifies that we will include this el in the collection */
    tdVerifierFn: function(){ return true; },

    /* gets the max of the given values */
    maximizerFn: function(val1, val2) {
      return Math.max(val1, val2);
    },

    /* finds the numeric value from the given el's html */
    valuefierFn: function( el ) {
      var res = parseInt( $(el).html() , 10);
      if (isNaN(res)) { return null; }
      return res;
    },

    /* returns a percentage (float) from the val, max and min */
    percentageFn: function(val, max, min) {
      if (!min) { min = 0; }

      return Math.round( 100 * (val - min) / (max - min) ) / 100.0;
    },

    /* returns the pixel height to use for the spark bar */
    heightFn: function(percentage, fontHeight){
      var height = percentage * 80;
      height = fontHeight * percentage;

      return height;
    },

    /* input: percentage, returns a element representing that percentage */
    decoratorElFn: function(parentEl, percentage, namespace, width, heightFn) {
      var fontHeight = parseInt($(parentEl).css('font-size'), 10);
      var sparkHeight = heightFn(percentage, fontHeight);

      var styles = "display: inline-block; background-color: blue; width: " +
        width + "; margin-left: 5px;";
      styles = styles + "height:" + sparkHeight + "px";

      return "<div class='" + namespace + "-percentage' " +
                   "data-sparktable-percentage='" + percentage + "' " +
                   "style='" + styles + "'>" +
             "</div>";
    },

    width: '5px'
  };


  /* iterates the sourceEl to find all the valid sub items */
  var getCollection = function(sourceEl,
                             tdSelector,
                             tdVerifierFn) {
    var items = [], item;
    sourceEl.find(tdSelector).each(function(){
      item = $(this);
      if (tdVerifierFn(item)) { items.push(item); }
    });

    return items;
  };

  /* iterates the collection and returns the maximum value */
  var getMaxValue = function( collection, valuefierFn, maximizerFn){
    var maxValue, value;

    for (var i = 0; i < collection.length; i++) {
      value = valuefierFn(collection[i]);

      if (!value) { continue; }

      if (!maxValue) {
        maxValue = value;
      } else {
        maxValue = maximizerFn( maxValue, value );
      }
    }

    return maxValue;
  };

  var decorateCollection = function(collection,
                                    maxValue,
                                    valuefierFn,
                                    percentageFn,
                                    decoratorElFn,
                                    namespace,
                                    width,
                                    heightFn ) {
    var item, value, percentage;

    for (var i = 0; i < collection.length; i++) {
      item  = collection[i];
      value = valuefierFn(item);
      if (!value) { continue; }

      percentage = percentageFn(value, maxValue);

      item.append( decoratorElFn(item, percentage, namespace, width, heightFn) );
    }
  };


  // Collection method.
  $.fn.sparktable = function(opts) {
    var collection = [],
        maxValue;

    opts = $.extend({}, defaultOpts, opts || {});

    $('.' + opts.namespace + '-percentage').remove();

    collection = getCollection($(this),
                               opts.tdSelector,
                               opts.tdVerifierFn );
    maxValue = getMaxValue( collection,
                            opts.valuefierFn,
                            opts.maximizerFn );

    decorateCollection( collection,
                        maxValue,
                        opts.valuefierFn,
                        opts.percentageFn,
                        opts.decoratorElFn,
                        opts.namespace,
                        opts.width,
                        opts.heightFn );


    return this;
  };

}(jQuery));
