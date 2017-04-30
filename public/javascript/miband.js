$(document).ready(function() {
    $.ajax({
        url: "/api/miband"
    }).then(function(data) {
        //$('#steps').append(data.steps + ' Schritte');
        $('#steps').append("10000 " + ' Schritte');
    });
});
