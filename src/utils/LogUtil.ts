import * as log4js from 'log4js';
import { EnvUtil } from './EnvUtil';

const DEFAULT_CONFIG = {
  type: 'dateFile',
  maxLogSize: 1048576,
  backups: 3,
  pattern: '-yyyy-MM-dd',
};

export class LogUtil {
  private static logger: log4js.Logger;

  public static getLogger() {
    if (!this.logger) {
      this.setLogger();
    }
    return this.logger;
  }

  private static setLogger() {
    const config = this.getConfig();
    log4js.configure(config);
    this.logger = log4js.getLogger();
  }

  private static getConfig() {
    const { DEBUG, TRACE } = EnvUtil.getEnv();

    let level = 'INFO';
    if (TRACE) {
      level = 'TRACE';
    } else if (DEBUG) {
      level = 'DEBUG';
    }

    return {
      appenders: {
        app: {
          ...DEFAULT_CONFIG,
          filename: './logs/app.log',
        },
        console: {
          type: 'console',
        },
      },
      categories: {
        default: {
          appenders: ['app', 'console'],
          level,
        },
      },
    };
  }
}
