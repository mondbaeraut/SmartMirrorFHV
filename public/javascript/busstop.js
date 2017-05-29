$(document).ready(function() {
    $.getJSON({
        url: "/api/busstop/Bregenz+Bahnhof"
    }).then(function(data) {
        var json = data.getJSON();
        console.log(json);
        $('#dynamictable').append('<table></table>');
        var table = $('#dynamictable').children();
        table.append("<tr><td>ashdjshd</td><td>b</td></tr>");
        table.append("<tr><td>c</td><td>d</td></tr>");
    });
    getit();
});


function getit() {
    $.getJSON("/api/busstop/Bregenz+Bahnhof",function (data) {

    })
}
