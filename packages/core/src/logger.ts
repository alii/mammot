import * as c from 'colorette';

export class Logger {
  static get(name: string) {
    const logger = new Logger(name);
    return logger.info;
  }

  public readonly name;

  constructor(name: string) {
    this.name = name;
  }

  info(...args: unknown[]) {
        console.info(this.prefix(c.blue, 'info'), ...args);
  }

  success(...args: unknown[]) {
        console.log(this.prefix([c.green], 'success'), ...args);
  }

  error(...args: unknown[]) {
        console.log(this.prefix(c.red, 'error'), ...args);
  }

  debug(...args: unknown[]) {
        console.log(this.prefix((c.blue), 'debug'), ...args);
  }

  warn(...args: unknown[]) {
      console.log(this.prefix((c.yellow), 'warning'), ...args);
  }

  private prefix(color: c.Color | c.Color[], text: string) {
    const colored = Array.isArray(color)
            ? color.reduce((all, c) => c(all), text)
            : color(text);
    return c.bold(`${new Date().toLocaleDateString()} [${this.name} • ${colored}:]`);
  }
}
