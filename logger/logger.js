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
    console.log(this.logger['file'].level)
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
    this.logger.info('----- Metrics -----',)
    this.logger.info('memory consumed till now : ',this.monitor.memoryConsumption())
    this.logger.info('Total Hits: ', this.monitor.hitRatio())
    this.logger.info('Total Misses: ', this.monitor.missRatio())
    this.logger.info('fill Rate : ', this.monitor.fillRate())
    this.logger.info('Eviction Rate : ', this.monitor.evictionRate())
    this.logger.info('-------------------')

  }



}

module.exports = Logger