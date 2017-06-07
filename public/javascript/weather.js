// v3.1.0
//Docs at http://simpleweatherjs.com
$(document).ready(function() {
    $.simpleWeather({
        location: '47.330046,9.601891',
        woeid: '',
        unit: 'c',
        success: function(weather) {
            html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
            $("#weather").html(html);
        },
        error: function(error) {
            $("#weather").html('<p>'+error+'</p>');
        }
    });
});