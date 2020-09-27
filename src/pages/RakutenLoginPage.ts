import * as puppeteer from 'puppeteer';
import { Logger } from 'log4js';
import { LogUtil } from 'utils';
import { DepositPage } from './DepositPage';
import { elemExists } from './utils';

const LOGIN_URL = 'https://grp02.id.rakuten.co.jp/rms/nid/loginfwd?__event=LOGIN&service_id=n57&return_url=%2F';

const SELECTOR = {
  ID_INPUT: 'input[name="u"]',
  PASSWORD_INPUT: 'input[name="p"]',
  LOGIN_BUTTON: 'input[name="submit"]',
  LOGOUT_BUTTON: '.rakutenUserLogout',
};

export class RakutenLoginPage {
  protected logger: Logger;
  protected browser: puppeteer.Browser;
  protected page: puppeteer.Page;

  constructor() {
    this.logger = LogUtil.getLogger();
  }

  public async init(headless = true) {
    this.browser = await puppeteer.launch({ headless });
    this.page = await this.browser.newPage();
    this.logger.trace(`Initialized with headless = ${headless}`);
  }

  public async exit() {
    await this.browser.close();
    this.logger.trace('Exit');
  }

  public async visit() {
    this.logger.debug(`Visit to Rakuten login page: ${LOGIN_URL}`);

    await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await this.page.waitFor(SELECTOR.ID_INPUT);

    this.logger.debug('Visited');
    return this;
  }

  public async login(id: string, password: string) {
    this.logger.debug('Enter: [login]');

    this.logger.trace('Input login ID');
    await this.page.type(SELECTOR.ID_INPUT, id);

    this.logger.trace('Input login password');
    await this.page.type(SELECTOR.PASSWORD_INPUT, password);

    this.logger.trace('Click login button');
    await this.page.click(SELECTOR.LOGIN_BUTTON);
    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    this.logger.debug('Exit: [login]');
    return this;
  }

  public async isLoginSuccess() {
    return await elemExists(this.page, SELECTOR.LOGOUT_BUTTON);
  }

  public async moveToDepositPage() {
    const depositPage = new DepositPage(this.page);
    return await depositPage.visit();
  }
}
