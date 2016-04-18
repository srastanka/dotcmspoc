$(document).ready(function(){
    
    // Make table title a red div
    //$('table-title').wrapInner('<div class= "table-red" />');
    //$("eq-table").prev()
    $("eq-table-specs").prev().wrapInner('<div class= "table-red" />');
    $("eq-table-specs").prev().children(".table-red").unwrap();

    // Set table as a Bootstrap responsive table
    $('eq-table-specs').wrap('<div class="table-responsive eq-table-specs" />')

    // Change <eq-table> to <table> with necessary BS classes
    $('eq-table-specs').wrapInner('<table class= "table table-striped table-bordered temp" />');
    $('div.eq-table-specs table.temp').unwrap();

    // Change all <row> to <tr>
    $('div.eq-table-specs table.temp row').wrapInner('<tr />');
    $('div.eq-table-specs table.temp tr').unwrap();

    // Wrap all <tr> inside of <tbody>
    $('div.eq-table-specs table.temp tr').wrap('<tbody />');

    // Change table <header> to <thead>
    $('div.eq-table-specs table.temp header').wrapInner('<thead />');
    $('div.eq-table-specs table.temp thead').unwrap();

    // Change all <column> to <td>
    $('div.eq-table-specs table.temp column').wrapInner('<td />');
    $('div.eq-table-specs table.temp td').unwrap();

    // Change all <td> in <thead> to be <th>
    $('div.eq-table-specs table.temp thead td').wrapInner('<th />');
    $('div.eq-table-specs table.temp th').unwrap();

    //Add div.row
    $('div.eq-table-specs table.temp td').wrapInner('<div class= "row" />');

    // Remove .temp class
    $('div.eq-table-specs table.temp').removeClass('temp');

    // Finalized table style
    $('div.eq-table-specs td:last-child').css('border-right','none');
    $('div.eq-table-specs tr:nth-child(even)').css('background-color', '#F2F2F2');
    $('div.eq-table-specs tr:nth-child(odd)').css('background-color', '#e6e7e9');
});
