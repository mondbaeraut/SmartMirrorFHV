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
                console.log('Rows: ' + rows);
                resolve(rows);
            });
            database.close();
        });
    })
}

module.exports.updateDailySteps = function (bandUuid, steps) {
    return new Promise(function (resolve, reject) {
        var database = new sqlite.Database('./SmartMirror.db');
        database.serialize(function () {
            database.all('update trackerSteps set steps = ' + steps + ' where trackerId = \'' + bandUuid + '\' and strftime(\'%Y%m%d\',date) = strftime(\'%Y%m%d\',\'now\')');
            database.close();
        });
    })
}

module.exports.insertDailySteps = function (bandUuid, steps) {
    return new Promise(function (resolve, reject) {
        var database = new sqlite.Database('./SmartMirror.db');
        database.serialize(function () {
            database.all('insert into trackerSteps (trackerId, steps, date) values(\'' + bandUuid + '\', ' + steps + ',date(\'now\'))');
            database.close();
        });
    })
}
