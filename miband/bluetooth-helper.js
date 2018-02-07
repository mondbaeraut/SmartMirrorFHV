const { exec } = require('child_process');

module.exports.restart = function () {
    exec('service bluetooth stop', (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        } else {
            setTimeout(() => {
                exec('service bluetooth start', (error, stdout, stderr) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }, 2000);
        }
    });
};