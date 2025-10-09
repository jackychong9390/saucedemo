// tests/smoke.spec.js
import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage.js';
import InventoryPage from '../pages/InventoryPage.js';

const USER_TYPE = process.env.USER_TYPE || 'standard_user';
const USER_PASSWORD = process.env.USER_PASSWORD || 'secret_sauce';

test('login → inventory → print & sort', async ({ page }) => {
  const main = new MainPage(page);
  await main.open();
  await main.login(USER_TYPE, USER_PASSWORD);   // ← was hardcoded
  await main.assertLoggedIn();

  const inv = new InventoryPage(page);
  await inv.assertOnInventoryPage();
  await inv.assertAndPrintInventory(6);

  const sortOptions = await inv.getSortOptionsArray();
  console.log('Captured sort options:', sortOptions);
  expect(sortOptions.map(o => o.value)).toEqual(['az','za','lohi','hilo']);

  await inv.selectSort('za');
  await page.waitForTimeout(150);
  const after = await inv.getItemsForSorting();
  console.log('First after Z→A:', after[0]);
});
