// pages/InventoryPage.js
import { expect } from '@playwright/test';
import { InventoryPageLocators as L } from '../locators/inventoryPage_locators.js';

export default class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.debugTag = '[InventoryPage]';

    // Group all UI handles in one place with readable names
    this.ui = {
      listContainer: this.page.locator(`#${L.container.id}`),
      productCards:  this.page.locator(L.item.css),
      getName:       (card) => card.locator(L.itemName.css),
      getPrice:      (card) => card.locator(L.itemPrice.css),

      // 🔽 NEW: dropdown + options
      sortSelect:    this.page.locator(L.sortSelect.css),
      sortOptions:   this.page.locator(L.sortOption.css),
    };
  }

  logInfo(message, extra) {
    console.log(`${this.debugTag} ${message}`, extra ?? '');
  }

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
  }

  /**
   * Wait for items, assert a fixed count (default 6), then print them.
   * @returns {Promise<Array<{name:string, price:string}>>}
   */
  async assertAndPrintInventory(expectedItemCount = 6) {
    await expect(this.ui.productCards).toHaveCount(expectedItemCount, { timeout: 8000 });

    const totalItems = await this.ui.productCards.count();
    this.logInfo(`Found ${totalItems} items (expected ${expectedItemCount})`);

    const products = [];
    for (let i = 0; i < totalItems; i++) {
      const card  = this.ui.productCards.nth(i);
      const name  = (await this.ui.getName(card).textContent()).trim();
      const price = (await this.ui.getPrice(card).textContent()).trim();
      products.push({ name, price });
    }

    console.log('\n===== Inventory (name, price) =====');
    products.forEach((p, i) =>
      console.log(`${String(i + 1).padStart(2, '0')}. ${p.name} — ${p.price}`)
    );
    console.log('===================================\n');

    return products;
  }

  // NEW: read the 4 sort choices into an array you can reuse later
async getSortOptionsArray() {

  // Ask the <select> directly for its options (works even if your chained locator missed)
  const result = await this.ui.sortSelect.evaluate((sel) => {
    const opts = Array.from(sel.options || []);
    return {
      length: opts.length,
      values: opts.map(o => o.value),
      labels: opts.map(o => (o.textContent || '').trim()),
      html: sel.outerHTML, // handy debug breadcrumb
    };
  });

  console.log('[Sort] select debug:', { length: result.length, values: result.values, labels: result.labels });

  // Fallback (paranoid): if length is 0, try a direct locator for options and build array
  if (result.length === 0) {
    const fallback = [];
    const loc = this.ui.sortOptions; // [data-test="product_sort_container"] option
    const count = await loc.count();
    console.log('[Sort] fallback option count:', count);
    for (let i = 0; i < count; i++) {
      const opt = loc.nth(i);
      fallback.push({
        value: await opt.getAttribute('value'),
        label: (await opt.textContent() || '').trim(),
      });
    }
    return fallback;
  }

  // Normal path
  return result.values.map((v, i) => ({ value: v, label: result.labels[i] }));
}


  //  NEW: choose a sort by value OR human label
  async selectSort(option) {
    const options = await this.getSortOptionsArray();
    const match = options.find(o => o.value === option || o.label.toLowerCase() === String(option).toLowerCase());
    if (!match) throw new Error(`[Sort] Unknown option: ${option}`);
    await this.ui.sortSelect.selectOption(match.value);
    // small settle pause (DOM reorder)
    await this.page.waitForLoadState('domcontentloaded');
  }

  // NEW: helper to return items in machine-friendly shape for later checks
  async getItemsForSorting() {
    const count = await this.ui.productCards.count();
    const out = [];
    for (let i = 0; i < count; i++) {
      const card = this.ui.productCards.nth(i);
      const name = (await this.ui.getName(card).textContent()).trim();
      const priceText = (await this.ui.getPrice(card).textContent()).trim(); // "$29.99"
      const priceNumber = Number(priceText.replace(/[^0-9.]/g, ''));
      out.push({ name, priceNumber });
    }
    return out;
  }
}
