"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log4js = require("log4js");
var Logger = /** @class */ (function () {
    function Logger(options, monitor) {
        if (options === void 0) { options = {}; }
        this.consoleEnabled = options.consoleEnabled || true;
        this.fileLoggingEnabled = options.fileLoggingEnabled || false;
        this.logFilePath = options.logFilePath || 'logs/app.log';
        this.monitor = monitor;
        this.logger = {};
        log4js.configure({
            appenders: {
                console: { type: 'console' },
                file: { type: 'file', filename: this.logFilePath }
            },
            categories: {
                default: { appenders: ['console'], level: 'info' },
                files: { appenders: ['file'], level: 'off' }
            }
        });
        this.logger['console'] = log4js.getLogger('default');
        this.logger['file'] = log4js.getLogger('files');
    }
    Logger.prototype.configureFLL = function (option) {
        this.logger['file'].level = option;
    };
    Logger.prototype.log = function (message, level) {
        var logLevel = level.toString().toLowerCase();
        switch (logLevel) {
            case 'info':
                this.logger['console'].info(message);
                this.logger['file'].info(message);
                break;
            case 'error':
                this.logger['console'].error(message);
                this.logger['file'].error(message);
                break;
            case 'warn':
                this.logger['console'].warn(message);
                this.logger['file'].warn(message);
                break;
            case 'debug':
                this.logger['console'].debug(message);
                this.logger['file'].debug(message);
                break;
            default:
                this.logger['console'].info(message);
                this.logger['file'].info(message);
        }
    };
    Logger.prototype.show = function () {
        this.log('----- Metrics -----', 'info');
        this.log("memory usage: ".concat(this.monitor.memoryConsumption(), " bytes"), 'info');
        this.log("Total Hits: ".concat(this.monitor.hitRatio()), 'info');
        this.log("Total Misses: ".concat(this.monitor.missRatio()), 'info');
        this.log("fill Rate: ".concat(this.monitor.fillRate()), 'info');
        this.log("Eviction Rate: ".concat(this.monitor.evictionRate()), 'info');
        this.log('-------------------', 'info');
    };
    return Logger;
}());
exports.default = Logger;
