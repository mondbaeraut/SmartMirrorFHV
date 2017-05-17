var express = require('express');
var router = express.Router();
var ical = require('ical');

function eventSort(a, b) {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
}

/* GET home page. */
router.get('/', function (req, res, next) {
    ical.fromURL('https://calendar.google.com/calendar/ical/1ih34p8l0f2000765q9dkcv3tc%40group.calendar.google.com/public/basic.ics', {}, function(err, data) {
      var responseData = [];
      var index = 0;
      var currentDate = new Date();
      for (var k in data){
        if (data.hasOwnProperty(k)) {
          var ev = data[k];
          if(ev.start >= currentDate){
            responseData[index] = {
                start: ev.start,
                end: ev.end,
                title: ev.summary,
                location: ev.location
            };
            index++;
          }
        }
      }
      res.json(responseData.sort(eventSort));
    });
});

module.exports = router;
