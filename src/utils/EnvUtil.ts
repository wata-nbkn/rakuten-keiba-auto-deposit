import * as dotenv from 'dotenv';

type Env = {
  RAKUTEN_ID: string;
  RAKUTEN_PASS: string;
  RAKUTEN_PIN_CODE: string;
  DEBUG: boolean;
  TRACE: boolean;
};

export class EnvUtil {
  private static env: Env;

  public static getEnv() {
    if (!this.env) {
      this.loadEnv();
    }
    return { ...this.env };
  }

  private static loadEnv() {
    dotenv.config();
    const { RAKUTEN_ID = '', RAKUTEN_PASS = '', RAKUTEN_PIN_CODE = '', DEBUG, TRACE } = process.env;
    this.env = {
      RAKUTEN_ID,
      RAKUTEN_PASS,
      RAKUTEN_PIN_CODE,
      DEBUG: DEBUG?.toLocaleLowerCase() === 'true',
      TRACE: TRACE?.toLocaleLowerCase() === 'true',
    };
  }
}
