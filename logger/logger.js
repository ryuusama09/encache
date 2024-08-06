const log4js = require('log4js');

class Logger {
  constructor(options = {}, monitor) {
    this.consoleEnabled = options.consoleEnabled || true;
    this.fileLoggingEnabled = options.fileLoggingEnabled || false;
    this.logFilePath = options.logFilePath || 'logs/app.log';
    this.monitor = monitor
    this.logger = []
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
  enableFileLogging(option) {
    console.log(option)
    this.logger['file'].level = option
    console.log(this.logger['file'].level)
  }
  log(message , level ){
    level = level.toString().toLowerCase()
    switch(level){
      case 'info':
        this.logger['console'].info(message)
        this.logger['file'].info(message)
        break
      case 'error':
        this.logger['console'].error(message)
        this.logger['file'].error(message)
        break
      case 'warn':
        this.logger['console'].warn(message)
        this.logger['file'].warn(message)
        break
      case 'debug':
        this.logger['console'].debug(message)
        this.logger['file'].debug(message)
        break
      default:
        this.logger['console'].info(message)
        this.logger['file'].info(message)
    }
  }
  

  show() {
    this.log('----- Metrics -----',"info")
    this.log(`memory usage: ${this.monitor.memoryConsumption()} bytes`,"info")
    this.log(`Total Hits: ${this.monitor.hitRatio()}`,"info")
    this.log(`Total Misses: ${this.monitor.missRatio()}`,"info")
    this.log(`fill Rate: ${this.monitor.fillRate()}`,"info")
    this.log(`Eviction Rate: ${this.monitor.evictionRate()}`,"info")
    this.log('-------------------' , "info")

  }



}

module.exports = Logger