(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  var tableHTML = "<table id='table'>" +
    "<tr>" + "<th>head1</th>" + "<th>head2</th>" + "</tr>" +
    "<tr>" + "<td>1</td>"      + "<td>4</td>"     + "</tr>" +
    "</table>";

  var includesText = function(string, includedText){
    ok( string.indexOf(includedText) > -1,
        "Expected '" + string + "' to include '" + includedText + "'.");
  };

  var elementIncludesText = function(selector, includedText){
    return includesText( $(this.table).find(selector).html(),
                         includedText );
  };

  module('jQuery#sparktable basics', {
    // This will run before each test in this module.
    setup: function() {
      $('#qunit-fixture').append(tableHTML);
      this.table = $('#table');
      $(this.table).sparktable();
    },
    teardown:function(){
      $('#table').remove();
    }
  });

  test('finds the table', function(){
    ok(this.table.length);
  });

  test('changes the values of the tds', function(){
    elementIncludesText( 'td:eq(0)', '1');
  });

  test('adds an el with class "sparktable-percentage" to the tds', function(){
    elementIncludesText( 'td:eq(0)', 'class="sparktable-percentage"' );
  });

  test('includes the percentage in the tds as a float', function(){
    elementIncludesText('td:eq(0)', '.25');
    elementIncludesText('td:eq(1)', '1');
  });

  test('is idempotent', function(){
    equal( $(this.table).find('td:eq(0) .sparktable-percentage').length,
           1,
           "Should have only one div of class .sparktable-percentage" );

    $(this.table).sparktable();

    equal( $(this.table).find('td:eq(0) .sparktable-percentage').length,
           1,
           "Should have only one div of class .sparktable-percentage" );
  });

  /*
  test('is chainable', function(){
    equal( $(this.table).sparktable(), $(this.table), 'should be chainable' );
  });
  */

  test('can set width in opts', function(){
    var opts = { width: '12px' };
    $(this.table).sparktable(opts);

    var elem = $(this.table).find('td:eq(0) .sparktable-percentage');
    ok(elem.length);
    equal( elem.css('width'), '12px', 'width should be settable');
  });


  // test can highlight max
  // test can change width
  // test can change color
  // test is idempotent
  // test can ignore some tds using data- attribute (or class)
  // test ignores tds with no value (parseInt returns NaN)


  /*

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.awesome(), this.elems, 'should be chainable');
  });

  test('is awesome', function() {
    expect(1);
    strictEqual(this.elems.awesome().text(), 'awesome0awesome1awesome2', 'should be awesome');
  });

  module('jQuery.awesome');

  test('is awesome', function() {
    expect(2);
    strictEqual($.awesome(), 'awesome.', 'should be awesome');
    strictEqual($.awesome({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  });

  module(':awesome selector', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', function() {
    expect(1);
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });
  */

}(jQuery));
