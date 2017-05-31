function loadSteps() {
    /* $.ajax({
     url: "/api/miband"
     }).then(function(data) {
     //$('#steps').append(data.steps + ' Schritte');
     alert(data);
     $('#steps').append("10000 " + ' Schritte');
     });*/
    $(`#steps`).empty();
    $(`#steps`).append(`<div id="stepsHeader">Schritte</div>`);
    $(`#steps`).append(`<div id="stepsGroup"><div id="stepsLeft">G</div><div id="stepsGroupText">
    `+ 5000 + `</div></div>
  <div id="stepsPersonal"><div id="stepsLeft">S</div><div id="stepsGroupText">`+1000+ `</div></div>`);
}
$(document).ready(function() {

   loadSteps();
   setInterval(loadSteps, 1000 * 60 * 10);
});

