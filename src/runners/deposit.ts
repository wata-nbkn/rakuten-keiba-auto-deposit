import { RakutenLoginPage, DepositPage } from 'pages';
import { LogUtil, EnvUtil } from 'utils';
import { hasValidEnv } from './hasValidEnv';

const DEFAULT_DEPOSIT_YEN = 100;

describe('Deposit to Rakuten Keiba', () => {
  const { RAKUTEN_ID, RAKUTEN_PASS, RAKUTEN_PIN_CODE, DEBUG, TRACE } = EnvUtil.getEnv();
  const logger = LogUtil.getLogger();
  let loginPage: RakutenLoginPage;
  let depositPage: DepositPage;

  beforeAll(async () => {
    logger.info('Starting the program...');
    loginPage = new RakutenLoginPage();

    const headless = !DEBUG && !TRACE;
    await loginPage.init(headless);
  });

  afterAll(async () => {
    await loginPage.exit();
  });

  let shouldContinue = true;
  it('Validate environment variables', async () => {
    const valid = hasValidEnv();
    if (!valid) {
      shouldContinue = false;
      logger.fatal('Environment variables are not set properly. Program will be shutting down...');
    }
    expect(valid).toBeTruthy();
  });

  it('Login to Rakuten', async () => {
    if (!shouldContinue) return;

    logger.info('Login to Rakuten...');
    await loginPage.visit();
    await loginPage.login(RAKUTEN_ID, RAKUTEN_PASS);

    const isLoginSuccess = await loginPage.isLoginSuccess();
    if (isLoginSuccess) {
      logger.info('Login success!');
    } else {
      shouldContinue = false;
      logger.fatal('Login failed');
    }
    expect(isLoginSuccess).toBeTruthy();
  });

  it('Is service available', async () => {
    if (!shouldContinue) return;

    logger.info('Go to deposit page...');
    depositPage = await loginPage.moveToDepositPage();

    const available = await depositPage.isServiceAvailable();
    if (!available) {
      shouldContinue = false;
      logger.fatal('Service is not available');
    }
    expect(available).toBeTruthy();
  });

  it('Do deposit', async () => {
    if (!shouldContinue) return;

    logger.info('Do deposit...');
    await depositPage.deposit(DEFAULT_DEPOSIT_YEN, RAKUTEN_PIN_CODE);

    const isValidPinCode = await depositPage.isValidPinCode();
    if (!isValidPinCode) {
      logger.fatal('Pin code is not correct');
    }

    const success = await depositPage.isDepositSuccess();
    if (success) {
      logger.info('Deposit success!');
      const result = await depositPage.getDepositResult();
      logger.debug(result);
    } else {
      logger.fatal('Fail to deposit');
    }
    expect(success).toBeTruthy();
  });
});
