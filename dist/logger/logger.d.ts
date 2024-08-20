interface LoggerOptions {
    consoleEnabled?: boolean;
    fileLoggingEnabled?: boolean;
    logFilePath?: string;
}
declare class Logger {
    private consoleEnabled;
    private fileLoggingEnabled;
    private logFilePath;
    private logger;
    private monitor;
    constructor(options: LoggerOptions, monitor: any);
    configureFLL(option: string): void;
    log(message: any, level: string): void;
    show(): void;
}
export default Logger;
