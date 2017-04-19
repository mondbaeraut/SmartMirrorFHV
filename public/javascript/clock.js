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

    var month = today.getMonth() + 1; // getMonth() is zero-based
    var day = today.getDate();

    var date = [(day > 9 ? '' : '0') + day, (month > 9 ? '' : '0') + month, today.getFullYear()].join('.');

    document.getElementById("clock").innerHTML = (hours + ":" + minutes + ":" + seconds);
    document.getElementById("date").innerHTML = date;

}

setInterval('clock()', 1000);
