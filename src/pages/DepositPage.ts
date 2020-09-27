import * as puppeteer from 'puppeteer';
import { Logger } from 'log4js';
import { LogUtil } from 'utils';
import { elemExists, getElemInnerText } from './utils';

const DEPOSIT_URL = 'https://bet.keiba.rakuten.co.jp/bank/deposit/';

const SELECTOR = {
  BASE: '#container',
  DEPOSIT_INPUT: '.definedNumber',
  CONFIRM_BUTTON: '#depositingInputButton',
  PIN_INPUT: 'input[name="pin"]',
  DEPOSIT_BUTTON: '#depositingConfirmButton',
  PIN_CODE_ERROR: '#depositingConfirmMessage',
  OUT_OF_SERVICE_ERROR: '.timeOutAlert',
  TO_BETTING_BUTTON: '.toBetting',
  RESULT_TABLE: '.resultTable',
};

export class DepositPage {
  protected logger: Logger;
  protected page: puppeteer.Page;

  constructor(page: puppeteer.Page) {
    this.logger = LogUtil.getLogger();
    this.page = page;
  }

  public async visit() {
    this.logger.debug(`Visit to the Deposit page: ${DEPOSIT_URL}`);

    await this.page.goto(DEPOSIT_URL, { waitUntil: 'domcontentloaded' });
    await this.page.waitFor(SELECTOR.BASE);

    this.logger.debug('Visited');
    return this;
  }

  public async deposit(price: number, pinCode: string) {
    this.logger.debug(`Enter: [deposit] with price = ${price}`);

    this.logger.trace(`Input deposit price: ${price}`);
    await this.page.type(SELECTOR.DEPOSIT_INPUT, price.toString());

    this.logger.trace('Click confirm button');
    await this.page.click(SELECTOR.CONFIRM_BUTTON);

    this.logger.trace('Moving to confirm page...');
    await this.page.waitFor(3000);
    await this.page.waitFor(SELECTOR.PIN_INPUT);

    this.logger.trace('Input pin code');
    await this.page.type(SELECTOR.PIN_INPUT, pinCode);

    this.logger.trace('Click execution button');
    await this.page.click(SELECTOR.DEPOSIT_BUTTON);
    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    this.logger.debug('Exit: [deposit]');
    return this;
  }

  public async getDepositResult() {
    return await getElemInnerText(this.page, SELECTOR.RESULT_TABLE);
  }

  public async isDepositSuccess() {
    return await elemExists(this.page, SELECTOR.TO_BETTING_BUTTON);
  }

  public async isValidPinCode() {
    return this.verifyNoError(SELECTOR.PIN_CODE_ERROR);
  }

  public async isServiceAvailable() {
    return this.verifyNoError(SELECTOR.OUT_OF_SERVICE_ERROR);
  }

  private async verifyNoError(selector: string) {
    this.logger.debug(`Enter: [verifyNoError] with selector = ${selector}`);

    const errorMsg = await getElemInnerText(this.page, selector);
    const result = errorMsg == null;
    if (result) {
      this.logger.trace(`No error messages`);
    } else {
      this.logger.error(errorMsg);
    }

    this.logger.debug(`Exit: [verifyNoError] with result = ${result}`);
    return result;
  }
}
