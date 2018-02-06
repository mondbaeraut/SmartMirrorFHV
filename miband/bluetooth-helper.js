const { exec } = require('child_process');

module.exports.restart = function () {
    exec('service bluetooth restart', (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Bluetooth restarted.');
        }
    });
};