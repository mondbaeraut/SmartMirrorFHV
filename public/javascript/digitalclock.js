var day = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
var month = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
function clock() {

    //Save the times in variables
    var today = new Date();

    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    //Put 0 in front of single digit minutes and seconds
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    else {
        minutes = minutes;
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    else {
        seconds = seconds;
    }


    var date = new Date();
    document.getElementById("dgDateText").innerHTML = (day[date.getDay() - 1] + ", " + date.getDay() + " " + month[date.getMonth()] + " " + date.getFullYear());
    document.getElementById("dgClockHourText").innerHTML = (hours + ":");
    document.getElementById("dgClockMinuteText").innerHTML = (minutes);
    document.getElementById("dgClockSecondText").innerHTML = (seconds);
}
$(document).ready(function () {
    clock();
    setInterval('clock()', 1000);
});

