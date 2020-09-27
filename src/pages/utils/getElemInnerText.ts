import { Page } from 'puppeteer';

export async function getElemInnerText(page: Page, selector: string) {
  return await page.evaluate(
    (selector) => {
      const elem = document.querySelector(selector);
      return elem ? (elem.innerText as string) : null;
    },
    [selector]
  );
}
