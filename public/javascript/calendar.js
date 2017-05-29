/* Calendar Backend Call
   requires jQuery */
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
const APIURL = 'api/calendar/';

function reloadCalendarEvents() {
    $.get(APIURL, function (data) {
        $('#calendar').empty();
        $('#calendar').append(`<div id="calendarHeader">Veranstaltungen</div>`);
        for(var calendarEvent in data){
            if(calendarEvent == 3){
                break;
            }
           addCalendarEvent(data[calendarEvent]);
        }
    });
}

function addCalendarEvent(calendarEvent) {
    var start = new Date(calendarEvent.start);
    var end = new Date(calendarEvent.end);
    $('#calendar').append(`<div id="calendarEvent">
                <div id="calendarDatetime">
                    <div id="calendarDay">
                        ` + ('0' + start.getDate()).slice(-2) + `
                    </div>
                    <div id="calendarMonth">
                        ` + MONTHS[start.getMonth()] + `
                    </div>
                </div>
                <div id="calendarInformation">
                    <div id="calendarTitle">
                        ` + calendarEvent.title + `
                    </div>
                    <div id="calendarTime">
                        ` + ('0' + start.getHours()).slice(-2)  + `:` + ('0' + start.getMinutes()).slice(-2) + ` - ` + ('0' + end.getHours()).slice(-2) + `:` + ('0' + end.getMinutes()).slice(-2) + `
                    </div>
                    <div id="calendarLocation">
                        ` + calendarEvent.location + `
                    </div>
                </div>
            </div>`);
}

$(document).ready(function(){
    reloadCalendarEvents();
    setInterval(reloadCalendarEvents,1000*60*10);
});
