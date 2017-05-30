const BUSAPIURL = `api/busstop/Koblach+Dorfplatz`;
var divTag;
function loadBusStopInfo() {
    $.getJSON(BUSAPIURL, function (data) {
        $(`#busstop`).empty();
        $(`#busstop`).append(`<div id="busstopHeader">Abfahrtszeiten</div>`);
        //var items = data.response.venue.tips.groups[0].items;
        //console.log(data);
        //console.log(data.information);
        for (var busstop in data.information) {
            //console.log(data.information[busstop]);
            if (busstop == 3) {
                break;
            }
            addBus(data.information[busstop]);
        }
    });
}

function addBus(data) {
    console.log(data);
    var number;
    var direction;
    var bustime;
    number = data.number;
    direction = data.direction;
    bustime = data.time;
    $(`#busstop`).append(`<div id="bus">
    <div id="busNumber">`+ number + `</div>
  <div id="busInfo"><div id="busDestination">`+ direction + `</div>
        <div id="busTime">Abfahrtszeit:`+ bustime+ `</div></div></div>`);
/*
 <div id="busNumber">
 ` + number + `
 </div>

 <div id="busInfo">
 <div id="busDestination">
 ` + direction + `
 </div>
 <div id="busTime">
 ` + bustime + `
 </div>
 </div>
 </div>`);*/
 }


 $(document).ready(function () {
 loadBusStopInfo();
 setInterval(loadBusStopInfo, 1000 * 60 * 10);

 });