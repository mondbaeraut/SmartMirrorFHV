var scrapeIt = require("scrape-it");

// get busstop data
module.exports.getData = function (busstop) {
    return new Promise(function (resolve, reject) {
        var baseUrl = 'https://www.vmobil.at/plugin.php?menuid=106&template=vvv_monitor/templates/haltestelle.html&haltestelle=$BUSSTOP_NAME$';

        var url = baseUrl.replace('$BUSSTOP_NAME$', busstop);

        scrapeIt(url, {
            busStopName: '#middle div.vvv-monitor.abfahrtsmonitor h1'
            , information: {
                listItem: 'tbody > tr',
                data: {
                    number: 'th.linie p',
                    direction: 'td.nach',
                    time: 'td.planabfahrt'
                }
            }
        }).then(page => {
            resolve(page);
        });
    });
}
