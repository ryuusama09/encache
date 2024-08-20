"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = __importStar(require("log4js"));
class Logger {
    constructor(options = {}, monitor) {
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
    configureFLL(option) {
        this.logger['file'].level = option;
    }
    log(message, level) {
        const logLevel = level.toString().toLowerCase();
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
    }
    show() {
        this.log('----- Metrics -----', 'info');
        this.log(`memory usage: ${this.monitor.memoryConsumption()} bytes`, 'info');
        this.log(`Total Hits: ${this.monitor.hitRatio()}`, 'info');
        this.log(`Total Misses: ${this.monitor.missRatio()}`, 'info');
        this.log(`fill Rate: ${this.monitor.fillRate()}`, 'info');
        this.log(`Eviction Rate: ${this.monitor.evictionRate()}`, 'info');
        this.log('-------------------', 'info');
    }
}
exports.default = Logger;
