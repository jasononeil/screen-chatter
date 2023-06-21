import { chromium, devices } from "playwright";

export class BrowserSession {
  broswer;
  context;
  page;

  constructor() {}

  async init() {
    this.browser = await chromium.launch({
      headless: false,
    });
    this.context = await this.browser.newContext(devices["iPhone 11"]);
    this.page = await this.context.newPage();
  }

  async gotoUrl(url) {
    await this.page.goto(url);
  }

  async end() {
    await this.context.close();
    await this.browser.close();
  }
}

export async function getTextFromPage(page) {
  const body = await page.locator("body");
  const text = body.textContent();
  return await text;
}
