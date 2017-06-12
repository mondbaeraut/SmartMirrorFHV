//const BUSURL = "api/busstop/Koblach+Gasthaus+Harmonie";
const BUSURL = "api/busstop/Bregenz+Bahnhof";

function loadBusStopInfo() {

    $.getJSON(BUSURL, function (data) {
        $("#busstop").empty();
        $("#busstop").append(`<div id="busHead"><div id="busHeadH"> Abfahrtszeiten</div></div><div id="busHeadInformation"><table id="bustable">`);

        var table = document.getElementById("bustable");
        var tr = document.createElement('tr');

        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var text1 = document.createTextNode('Abfahrt\n in min');
        var text2 = document.createTextNode('Linie');
        var text3 = document.createTextNode('Ziel');
        var text4 = document.createTextNode('Plan');
        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
        //var items = data.response.venue.tips.groups[0].items;
        //console.log(data);
        //console.log(data.information);
        document.getElementById("busHeadInformation").appendChild(table);
        for (var busstop in data.information) { //console.log(data.information);
            //console.log(data.information[busstop]);
            if (busstop == 3) {
                break;
            }
            addBus(data.information[busstop]);
        }
        var table = document.createElement('table');

        document.getElementById("busHeadInformation").appendChild(table);

    });

}
function calcTimeDifToNow(time){
    var timesplit = time.split(":");
    var curr_date = new Date();
    return (parseInt(timesplit[0]) * 60) + parseInt(timesplit[1]) - ((curr_date.getHours() * 60) + curr_date.getMinutes());
}

function addBus(data) {
    var number = data.number;
    var direction = data.direction;
    var bustime = data.time;
    var diffrence = calcTimeDifToNow(bustime);

    var table = document.getElementById("bustable");
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var text1 = document.createTextNode(diffrence);
    var text2 = document.createTextNode(number);
    var text3 = document.createTextNode(direction);
    var text4 = document.createTextNode(bustime);
    td1.appendChild(text1);
    td2.appendChild(text2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    table.appendChild(tr);
}


$(document).ready(function () {
    loadBusStopInfo();
    setInterval(loadBusStopInfo, 1000 * 60);
});