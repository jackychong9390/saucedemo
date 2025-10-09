// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
