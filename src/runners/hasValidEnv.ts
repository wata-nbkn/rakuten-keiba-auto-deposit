import { LogUtil, EnvUtil } from 'utils';

export const hasValidEnv = () => {
  const { RAKUTEN_ID, RAKUTEN_PASS, RAKUTEN_PIN_CODE } = EnvUtil.getEnv();
  const logger = LogUtil.getLogger();

  let valid = true;
  if (RAKUTEN_ID === '') {
    logger.fatal('"RAKUTEN_ID" is not set. Do "export RAKUTEN_ID=<YOUR_ID>"');
    valid = false;
  } else if (RAKUTEN_PASS === '') {
    logger.fatal('"RAKUTEN_PASS" is not set. Do "export RAKUTEN_PASS=<YOUR_PASSWORD>"');
    valid = false;
  } else if (RAKUTEN_PIN_CODE === '') {
    logger.fatal('"RAKUTEN_PIN_CODE" is not set. Do "export RAKUTEN_PIN_CODE=<YOUR_PINCODE>"');
    valid = false;
  }

  return valid;
};
