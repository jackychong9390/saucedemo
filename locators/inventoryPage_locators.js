// locators/inventoryPage_locators.js
export const InventoryPageLocators = {
  container:   { id: 'inventory_container' },
  item:        { css: '.inventory_item' },
  itemName:    { css: '[data-test="inventory-item-name"], .inventory_item_name' },
  itemPrice:   { css: '[data-test="inventory-item-price"], .inventory_item_price' },

  // NEW: sort dropdown
 sortSelect: { css: 'select.product_sort_container, select[data-test="product_sort_container"]' },
  sortOption: { css: 'select.product_sort_container option, select[data-test="product_sort_container"] option' },
};
