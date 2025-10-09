import { expect } from '@playwright/test';
import { MainPageLocators as L } from '../locators/mainpage_locators.js';

export default class MainPage {
  constructor(page) {
    this.page = page;
    this.el = {
      username:    page.locator(L.username.css),
      password:    page.locator(L.password.css),
      loginButton: page.locator(L.loginButton.css),
      title:       page.locator(L.pageTitle.css),
    };
  }

  async open() {
    console.log('[MainPage] goto /');
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    // Log what the page actually sees
    const count = await this.el.username.count();
    console.log(`[MainPage] username field count=${count}`);
    await expect(this.el.loginButton).toBeVisible({ timeout: 5000 });
    await expect(this.el.username).toBeVisible({ timeout: 5000 });
  }

  async login(username, password) {
    console.log(`[MainPage] filling username="${username}"`);
    try {
      await this.el.username.fill(username, { timeout: 8000 });
      await this.el.password.fill(password, { timeout: 8000 });
      await this.el.loginButton.click();
    } catch (e) {
      // Extra breadcrumbs for debugging
      console.log('[MainPage] login failed. Dumping locator states...');
      console.log('  username visible:', await this.el.username.isVisible().catch(()=>'ERR'));
      console.log('  password visible:', await this.el.password.isVisible().catch(()=>'ERR'));
      console.log('  login btn visible:', await this.el.loginButton.isVisible().catch(()=>'ERR'));
      throw e;
    }
  }

  async assertLoggedIn() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
    await expect(this.el.title).toHaveText('Products');
    await this.page.waitForTimeout(2000);
    
  }

}
