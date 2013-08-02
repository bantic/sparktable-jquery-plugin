/*! Sparktable - v0.1.0 - 2013-08-01
* https://github.com/bantic/sparktable-jquery-plugin
* Copyright (c) 2013 Cory Forsyth; Licensed MIT */
(function($) {

  var defaultOpts = {
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
      return parseInt( $(el).html() , 10);
    },

    /* returns a percentage (float) from the val, max and min */
    percentageFn: function(val, max, min) {
      if (!min) { min = 0; }

      return Math.round( 100 * (val - min) / (max - min) ) / 100.0;
    },

    /* input: percentage, returns a element representing that percentage */
    decoratorElFn: function(parentEl, percentage) {
      var parentHeight     = $(parentEl).height(),
          sparktableHeight = parentHeight * percentage;

      return "<div class='sparktable-percentage' " +
                   // "data-sparktable-percentage='" + percentage + "' " +
                   "style='height:" + percentage*80 + "%'>" + 
             "</div>";
    }
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
                                    decoratorElFn ) {
    var item, value, percentage;

    for (var i = 0; i < collection.length; i++) {
      item  = collection[i];
      value = valuefierFn(item);
      percentage = percentageFn(value, maxValue);

      item.append( decoratorElFn(item, percentage) );
    }
  };


  // Collection method.
  $.fn.sparktable = function(opts) {
    var collection = [],
        maxValue;

    $('.sparktable-percentage').remove();

    opts = $.extend({}, defaultOpts, opts || {});

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
                        opts.decoratorElFn );


    return this;
  };

}(jQuery));
