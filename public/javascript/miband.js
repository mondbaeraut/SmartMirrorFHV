$(document).ready(function () {

  if (!!window.EventSource) {
    var source = new EventSource('/sse/miband')

    source.addEventListener('message', function (e) {
      var mibandData = JSON.parse(e.data)

      $(`#steps`).empty();
      $(`#steps`).append(`<div id="stepsHeader">Schritte</div>`);
      $(`#steps`).append(`<div id="stepsGroup"><div id="stepsLeft">G</div><div id="stepsGroupText">
    `+ mibandData.dailyStepsTotal + `</div></div>
  <div id="stepsPersonal"><div id="stepsLeft">S</div><div id="stepsGroupText">`+ mibandData.steps + `</div></div>`);

    }, false)

    source.addEventListener('open', function (e) {
      console.log("SSE Connected");
    }, false)

    source.addEventListener('error', function (e) {
      if (e.target.readyState == EventSource.CLOSED) {
        console.log("Disconnected", e);
      }
      else if (e.target.readyState == EventSource.CONNECTING) {
        console.log("Connecting...");
      }
    }, false)
  } else {
    console.log("Your browser doesn't support SSE");
  }

});
