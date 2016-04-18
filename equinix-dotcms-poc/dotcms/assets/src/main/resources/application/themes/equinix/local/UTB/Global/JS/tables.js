$(document).ready(function(){
    
    // Make table title a red div
    //$('table-title').wrapInner('<div class= "table-red" />');
    //$('div.table-red').unwrap();
    $("eq-table").prev().wrapInner('<div class= "table-red" />');
    $("eq-table").prev().children(".table-red").unwrap();
    
    // Set table as a Bootstrap responsive table
    $('eq-table').wrap('<div class="table-responsive" />')
    
    // Change <eq-table> to <table> with necessary BS classes
    $('eq-table').wrapInner('<table class= "table table-striped table-bordered temp" />');
    $('table.temp').unwrap();
    
    // Change all <row> to <tr>
    $('table.temp row').wrapInner('<tr />');
    $('table.temp tr').unwrap();
    
    // Wrap all <tr> inside of <tbody>
    $('table.temp tr').wrap('<tbody />');
    
    // Change table <header> to <thead>
    $('table.temp header').wrapInner('<thead />');
    $('table.temp thead').unwrap();
    
    // Change all <column> to <td>
    $('table.temp column').wrapInner('<td />');
    $('table.temp td').unwrap();
    
    // Change all <td> in <thead> to be <th>
    $('table.temp thead td').wrapInner('<th />');
    $('table.temp th').unwrap();
    
    // Remove .temp class
    $('table.temp').removeClass('temp');
    // Finalized table style
    $('td:last-child').css('border-right','none');
    $('tr:nth-child(even)').css('background-color', '#F2F2F2');
    $('tr:nth-child(odd)').css('background-color', '#e6e7e9');
});