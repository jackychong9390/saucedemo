// tests/smoke.spec.js
import { test, expect } from '@playwright/test';
import MainPage from '../pages/mainpage.js';
import InventoryPage from '../pages/InventoryPage.js';

test('login → inventory → print & sort', async ({ page }) => {
  page.on('console', m => console.log('[BROWSER]', m.type(), m.text()));

  const main = new MainPage(page);
  await main.open();
  await main.login('standard_user', 'secret_sauce');
  await main.assertLoggedIn();

  const inv = new InventoryPage(page);
  await inv.assertOnInventoryPage();

  await inv.assertAndPrintInventory(6);

  const sortOptions = await inv.getSortOptionsArray();
  console.log('Captured sort options:', sortOptions);
  expect(sortOptions.map(o => o.value)).toEqual(['az','za','lohi','hilo']); // sanity check

  await inv.selectSort('za');          // or 'Name (Z to A)'
  await page.waitForTimeout(200);      // tiny visual/settle pause

  const after = await inv.getItemsForSorting();
  console.log('First after Z→A:', after[0]);

  // Optional: prove it actually sorted Z→A
  const names = after.map(i => i.name);
  const sorted = [...names].sort((a,b) => b.localeCompare(a, 'en', {sensitivity:'base'}));
  expect(names).toEqual(sorted);
});
