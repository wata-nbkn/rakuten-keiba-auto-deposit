import { Page } from 'puppeteer';

export async function elemExists(page: Page, selector: string) {
  const elem = await page.evaluate((selector) => document.querySelector(selector), [selector]);
  return elem != null;
}
