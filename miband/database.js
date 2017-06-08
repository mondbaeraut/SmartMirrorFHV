var sqlite = require('sqlite3').verbose();

// Database
module.exports.initializeDatabase = function () {
    return new Promise(function (resolve, reject) {
        console.log('initializing database');
        var database = new sqlite.Database('./SmartMirror.db');
        database.serialize(function () {
            database.run('create table if not exists trackerSteps(id integer primary key autoincrement, trackerId char(36), steps int not null, date datetime not null)');
            database.close();
        });
    })
}

module.exports.getDailyBandSteps = function (bandUuid) {
    return new Promise(function (resolve, reject) {
        console.log('get daily steps from database for uuid ' + bandUuid);
        var database = new sqlite.Database('./SmartMirror.db');
        database.serialize(function () {
            database.all('select * from trackerSteps where trackerId = \'' + bandUuid + '\' and strftime(\'%Y%m%d\',date) = strftime(\'%Y%m%d\',\'now\')', function (error, rows) {
                if (error) console.log(error);
                database.close();
                resolve(rows);
            });
        });
    })
}

module.exports.getDailyStepsTotal = function () {
    return new Promise(function (resolve, reject) {
        console.log('get daily steps total from database');
        var database = new sqlite.Database('./SmartMirror.db');
        database.serialize(function () {
            database.all('select sum(steps) as steps from trackerSteps where strftime(\'%Y%m%d\',date) = strftime(\'%Y%m%d\',\'now\')', function (error, rows) {
                if (error) console.log(error);
                database.close();
                resolve(rows[0].steps);
            });
        });
    })
}

module.exports.insertUpdateDailySteps = function (dbResponse, bandUuid, steps) {
    return new Promise(function (resolve, reject) {
        var database = new sqlite.Database('./SmartMirror.db');
        if (dbResponse == '') {
            console.log('insert daily steps');
            database.serialize(function () {
                database.all('insert into trackerSteps (trackerId, steps, date) values(\'' + bandUuid + '\', ' + steps + ',date(\'now\'))', function (error, rows) {
                    if (error) console.log(error);
                    database.close();
                    resolve();
                });
            });
        } else {
            console.log('update daily steps');
            database.serialize(function () {
                database.all('update trackerSteps set steps = ' + steps + ' where trackerId = \'' + bandUuid + '\' and strftime(\'%Y%m%d\',date) = strftime(\'%Y%m%d\',\'now\')', function (error, rows) {
                    if (error) console.log(error);
                    database.close();
                    resolve();
                });
            });
        }
    })
};
