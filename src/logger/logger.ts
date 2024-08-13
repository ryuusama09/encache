import * as log4js from 'log4js';

interface LoggerOptions {
  consoleEnabled?: boolean;
  fileLoggingEnabled?: boolean;
  logFilePath?: string;
}

class Logger {
  private consoleEnabled: boolean;
  private fileLoggingEnabled: boolean;
  private logFilePath: string;
  private logger: { [key: string]: log4js.Logger };
  private monitor: any; // Assuming monitor is an object with required methods

  constructor(options: LoggerOptions = {}, monitor: any) {
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

  configureFLL(option: string): void {
    this.logger['file'].level = option;
  }

  log(message: any, level: string): void {
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

  show(): void {
    this.log('----- Metrics -----', 'info');
    this.log(`memory usage: ${this.monitor.memoryConsumption()} bytes`, 'info');
    this.log(`Total Hits: ${this.monitor.hitRatio()}`, 'info');
    this.log(`Total Misses: ${this.monitor.missRatio()}`, 'info');
    this.log(`fill Rate: ${this.monitor.fillRate()}`, 'info');
    this.log(`Eviction Rate: ${this.monitor.evictionRate()}`, 'info');
    this.log('-------------------', 'info');
  }
}

export default Logger;
