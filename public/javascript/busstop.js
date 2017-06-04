const BUSURLS = ["api/busstop/Koblach+Gasthaus+Harmonie", "api/busstop/Koblach+Dorfplatz", "api/busstop/Bregenz+Bahnhof"];
var divTag;
var count = 0;
var busData = [];
function callApi(dest_url) {
    var result = null;
    $.ajax({
        url: dest_url,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            result = data;
        }
    });
    return result;
}

function loadBusStopInfo() {

    $(`#busstop`).append(`<div id="busHead"><div id="busHeadH"> Abfahrtszeiten</div></div><div id="busHeadInformation"><table id="bustable">`);
    var table = document.getElementById("bustable");
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var text1 = document.createTextNode('Abfahrt\n in min');
    var text2 = document.createTextNode('NR');
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
    var arrayPos = 0;
    for (var i = 0; i < BUSURLS.length; i++) {
        var result = callApi(BUSURLS[i]);
        //rework
        for (var k = 0; k < result.information.length; k++) {
            if (result.information[k].number != "") {
                busData[arrayPos] = result.information[k];
                arrayPos++;
            }
        }
    }
    busData.sort(function (a, b) {
        if (a.time < b.time)
            return -1;
        if (a.time > b.time)
            return 1;
        return 0;
    });
    var actualTime = new Date();
    var displayedBuses = 0;
    for (var busstop in busData) {
        if (displayedBuses >= 3) {
            break;
        }
        var splitTime = busData[busstop].time.split(":");
        var bustime = (parseInt(splitTime[0]) * 60) + parseInt(splitTime[1]);
        var diffrence = bustime - ((actualTime.getHours() * 60) + actualTime.getMinutes());
        if (diffrence > 0) {
            addBus(busData[busstop].number, busData[busstop].direction, busData[busstop].time, diffrence);
            displayedBuses++;
        }


    }
    var table = document.createElement('table');

    document.getElementById("busHeadInformation").appendChild(table);

}

function addBus(number, direction, depature, diffrence) {
    var table = document.getElementById("bustable");
    var tr = document.createElement('tr');

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var text1 = document.createTextNode(diffrence);
    var text2 = document.createTextNode(number);
    var text3 = document.createTextNode(direction);
    var text4 = document.createTextNode(depature);
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
    setInterval(loadBusStopInfo, 1000 * 60 * 10);

});