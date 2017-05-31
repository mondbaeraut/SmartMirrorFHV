function loadSteps() {
  $.ajax({
    url: "/api/miband"
  }).then(function (data) {
    $(`#steps`).empty();
    $(`#steps`).append(`<div id="stepsHeader">Schritte</div>`);
    $(`#steps`).append(`<div id="stepsGroup"><div id="stepsLeft">G</div><div id="stepsGroupText">
    `+ data.dailyStepsTotal + `</div></div>
  <div id="stepsPersonal"><div id="stepsLeft">S</div><div id="stepsGroupText">`+ data.steps + `</div></div>`);
  });
}

$(document).ready(function () {
  loadSteps();
  setInterval(loadSteps, 1000 * 60);
});
