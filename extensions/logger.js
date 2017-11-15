let fs = require("fs");

const LOG_FILE = "log.log";

module.exports.append = function (event) {
    let data = {
        timestamp: Date.now(),
        event: event,
        causality: sendOnProximityOnly,
        abstractVisualization: useDiagram,
        leafCount: currentLeafCount,
        appleCount: currentAppleCount
    };
    fs.appendFile(LOG_FILE, JSON.stringify(data) + "\n", err => {
        if (err) console.log(err);
    });
}