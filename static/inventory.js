let groceries;
let groceriesUpdated = [];
let cleaningProducts;
let cleaningProductsUpdated = [];

$(function() {
    $('#collection-select').on('change', async (event) => {
        const collection = event.target.value;
        const res = await fetch(`/inventory/${collection}/read`);
        const table = $('#collection-table');
        table.html(null);
        let keys;
        let tr;
        let td;
        switch (collection) {
            case 'grocery':
                [keys, groceries] = await res.json();
                tr = document.createElement('tr');
                for (const key of keys) {
                    const th = document.createElement('th');
                    th.innerText = key.split('_').map((e) => e.charAt(0).toUpperCase() + e.substring(1)).join(' ');
                    tr.appendChild(th);
                }
                table.append(tr);
                for (const grocery of groceries) {
                    tr = document.createElement('tr');
                    for (const key of keys) {
                        const td = document.createElement('td');
                        if (key === 'price') {
                            const input = document.createElement('input')
                            input.type = 'number';
                            input.value = grocery[key];
                            input.step = 0.01;
                            input.classList.add('form-control');
                            input.addEventListener('input', (event) => {
                                grocery[key] = event.target.value;
                                groceriesUpdated = groceriesUpdated.filter(groceryEdited => groceryEdited['grocery_id'] != grocery['grocery_id']);
                                groceriesUpdated.push(grocery);
                            });
                            td.appendChild(input);
                        } else if (['minimum_quantity', 'current_quantity'].includes(key)) {
                            const input = document.createElement('input')
                            input.type = 'number';
                            input.value = grocery[key];
                            input.classList.add('form-control');
                            input.addEventListener('input', (event) => {
                                grocery[key] = event.target.value;
                                groceriesUpdated = groceriesUpdated.filter((groceryEdited) => groceryEdited['grocery_id'] != grocery['grocery_id']);
                                groceriesUpdated.push(grocery);
                            });
                            td.appendChild(input);
                        } else {
                            td.innerText = grocery[key];
                        }
                        tr.appendChild(td);
                    }
                    table.append(tr);
                }
                break;
            case 'cleaning-product':
                [keys, cleaningProducts] = await res.json();
                tr = document.createElement('tr');
                for (const key of keys) {
                    const th = document.createElement('th');
                    th.innerText = key.split('_').map((e) => e.charAt(0).toUpperCase() + e.substring(1)).join(' ');
                    tr.appendChild(th);
                }
                table.append(tr);
                for (const cleaningProduct of cleaningProducts) {
                    tr = document.createElement('tr');
                    for (const key of keys) {
                        const td = document.createElement('td');
                        if (key === 'price') {
                            const input = document.createElement('input')
                            input.type = 'number';
                            input.value = cleaningProduct[key];
                            input.step = 0.01;
                            input.classList.add('form-control');
                            input.addEventListener('input', (event) => {
                                cleaningProduct[key] = event.target.value;
                                cleaningProductsUpdated = cleaningProductsUpdated.filter(cleaningProductUpdated => cleaningProductUpdated['cleaning_product_id'] != cleaningProduct['cleaning_product_id']);
                                cleaningProductsUpdated.push(cleaningProduct);
                            });
                            td.appendChild(input);
                        } else if (['minimum_quantity', 'current_quantity'].includes(key)) {
                            const input = document.createElement('input')
                            input.type = 'number';
                            input.value = cleaningProduct[key];
                            input.classList.add('form-control');
                            input.addEventListener('input', (event) => {
                                cleaningProduct[key] = event.target.value;
                                cleaningProductsUpdated = cleaningProductsUpdated.filter(cleaningProductUpdated => cleaningProductUpdated['cleaning_product_id'] != cleaningProduct['cleaning_product_id']);
                                cleaningProductsUpdated.push(cleaningProduct);
                            });
                            td.appendChild(input);
                        } else {
                            td.innerText = cleaningProduct[key];
                        }
                        tr.appendChild(td);
                    }
                    table.append(tr);
                }
                break;
        }
        document.getElementById('collection-ctr').hidden = false;
    });

    $('#item-create-collection-select').on('change', (event) => {
        const collection = event.target.value;
        switch (collection) {
            case 'grocery':
                document.getElementById('item-create-store-ctr').hidden = false;
                document.getElementById('item-create-brand-ctr').hidden = false;
                document.getElementById('item-create-name-ctr').hidden = false;
                document.getElementById('item-create-price-ctr').hidden = false;
                document.getElementById('item-create-minimum-quantity-ctr').hidden = false;
                document.getElementById('item-create-current-quantity-ctr').hidden = false;
                break;
            case 'cleaning-product':
                document.getElementById('item-create-store-ctr').hidden = false;
                document.getElementById('item-create-brand-ctr').hidden = false;
                document.getElementById('item-create-name-ctr').hidden = false;
                document.getElementById('item-create-price-ctr').hidden = false;
                document.getElementById('item-create-minimum-quantity-ctr').hidden = false;
                document.getElementById('item-create-current-quantity-ctr').hidden = false;
                break;
        }
    });

    $('#item-create-form').on('submit', async (event) => {
        const collection = $('#item-create-collection-select').val();
        let res;
        switch (collection) {
            case 'grocery':
                const groceryCreated = {
                    'store': $('#item-create-store-select').val(),
                    'name': $('#item-create-name-input').val(),
                    'brand': $('#item-create-brand-input').val(),
                    'price': $('#item-create-price-input').val(),
                    'minimum_quantity': $('#item-create-minimum-quantity-input').val(),
                    'current_quantity': $('#item-create-current-quantity-input').val()
                }
                res = await fetch('/inventory/grocery/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'grocery_created': groceryCreated })
                });
                break;
            case 'cleaning-product':
                const cleaningProductCreated = {
                    'store': $('#item-create-store-select').val(),
                    'name': $('#item-create-name-input').val(),
                    'brand': $('#item-create-brand-input').val(),
                    'price': $('#item-create-price-input').val(),
                    'minimum_quantity': $('#item-create-minimum-quantity-input').val(),
                    'current_quantity': $('#item-create-current-quantity-input').val()
                }
                res = await fetch('/inventory/cleaning-product/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'cleaning_product_created': cleaningProductCreated })
                });
                break;
        }
    });

    $('#item-delete-collection-select').on('change', async (event) => {
        const collection = event.target.value;
        const res = await fetch(`/inventory/${collection}/read`);
        const itemDeleteItemSelect = $('#item-delete-item-select');
        itemDeleteItemSelect.html(null);
        const emptyOption = document.createElement('option');
        emptyOption.hidden = true;
        itemDeleteItemSelect.append(emptyOption);
        switch (collection) {
            case 'grocery':
                [keys, groceries] = await res.json();
                for (const grocery of groceries) {
                    const option = document.createElement('option');
                    option.value = JSON.stringify(grocery);
                    option.innerText = `Store: ${grocery['store']} | Brand: ${grocery['brand']} | Name: ${grocery['name']}`;
                    itemDeleteItemSelect.append(option);
                }
                break;
            case 'cleaning-product':
                [keys, cleaningProducts] = await res.json()
                for (const cleaningProduct of cleaningProducts) {
                    const option = document.createElement('option');
                    option.value = JSON.stringify(cleaningProduct);
                    option.innerText = `Store: ${cleaningProduct['store']} | Brand: ${cleaningProduct['brand']} | Name: ${cleaningProduct['name']}`;
                    itemDeleteItemSelect.append(option);
                }
                break;
        }
        document.getElementById('item-delete-item-ctr').hidden = false;
    });

    $('#item-delete-form').on('submit', async () => {
        const collection = $('#item-delete-collection-select').val();
        let res;
        switch(collection) {
            case 'grocery':
                const groceryDeleted = JSON.parse($('#item-delete-item-select').val());
                res = await fetch('/inventory/grocery/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'grocery_deleted': groceryDeleted })
                });
                break;
            case 'cleaning-product':
                const cleaningProductDeleted = JSON.parse($('#item-delete-item-select').val());
                res = await fetch('/inventory/cleaning-product/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'cleaning_product_deleted': cleaningProductDeleted })
                });
                break;
        }
    });
    
    $('#grocery-list-btn').on('click', async () => {
        const res = await fetch('/inventory/grocery/list');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'GroceryList';
        a.click();
    });
    
    $('#cleaning-product-list-btn').on('click', async () => {
        const res = await fetch('/inventory/cleaning-product/list');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CleaningProductList';
        a.click();
    });

    $('#receipt-create-form').on('submit', async (event) => {
        event.preventDefault()
        const purchaseDate = $('#receipt-create-purchase-date-input').val().split('-');
        purchaseDate.push(purchaseDate.shift());
        const receiptCreated = {
            'storeId': $('#receipt-create-store-id-input').val(),
            'purchaseDate': purchaseDate.join('-'),
            'cardType': $('#receipt-create-card-type-select').val(),
            'total': $('#receipt-create-total-input').val(),
            'lastFourDigits': $('#receipt-create-last-four-digits-input').val()
        };
        const res = await fetch('/inventory/receipt/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'receiptCreated': receiptCreated })
        });
    });
    
    $('#collection-save-btn').on('click', async () => {
        const collection = $('#collection-select').val();
        let res;
        switch (collection) {
            case 'grocery':
                res = await fetch('/inventory/grocery/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'groceries_updated': groceriesUpdated })
                });
                break;
            case 'cleaning-product':
                res = await fetch('/inventory/cleaning-product/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'cleaning_products_updated': cleaningProductsUpdated })
                });
                break; 
        }
    });
});