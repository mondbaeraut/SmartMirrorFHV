$(document).ready(function() {
    $.ajax({
        url: "/api/miband"
    }).then(function(data) {
        $('#steps').append(data.steps + ' Schritte');
    });
});