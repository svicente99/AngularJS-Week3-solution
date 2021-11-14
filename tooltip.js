/**
 * Tooltip with bootstrap (using jQuery)
 * 
 * https://qastack.com.br/programming/20666900/using-bootstrap-tooltip-with-angularjs
 * https://stackoverflow.com/questions/18517483/displaying-long-text-in-bootstrap-tooltip
 * https://stackoverflow.com/questions/13704789/can-i-use-complex-html-with-twitter-bootstraps-tooltip
 */

$(document).ready(function(){
    $('[data-toggle=tooltip]').hover(function(){
        // on mouseenter
        $(this).tooltip('show');
    }, function(){
        // on mouseleave
        $(this).tooltip('hide');
    });
});

$(document).ready(function () {
  $("a").tooltip({
    'selector': '',
    'placement': 'left',
    'container':'body',
	'html': true
  });
});