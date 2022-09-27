$(function() {
    $('#recipe-create-utensils-select').selectize({
        create: input => {
            const text = input;
            const value = input;
            return {
                text: text, 
                value: value
            };
        },
        delimiter: '|'
    });

    $('#recipe-create-ingredients-select').selectize({
        create: input => {
            const text = input;
            const value = input;
            return {
                text: text,
                value: value
            };
        },
        delimiter: '|'
    });

    $('#recipe-create-directions-select').selectize({
        create: input => {
            const text = input;
            const value = input;
            return {
                text: text,
                value: value
            };
        },
        delimiter: '|'
    });

    $('#recipe-create-notes-select').selectize({
        create: input => {
            const text = input;
            const value = input;
            return {
                text: text,
                value: value
            };
        },
        delimiter: '|'
    });

    $('#recipe-create-form').on('submit', async (event) => {
        const recipeCreated = {
            'name': $('#recipe-create-name-input').val(),
            'prep_time': $('#recipe-create-prep-time-input').val(),
            'cook_time': $('#recipe-create-cook-time-input').val(),
            'serves' : $('#recipe-create-serves-input').val(),
            'utensils' : $('#recipe-create-utensils-select').val(),
            'ingredients' : $('#recipe-create-ingredients-select').val(),
            'directions' : $('#recipe-create-directions-select').val(),
            'notes': $('#recipe-create-notes-select').val()
        }
        const res = await fetch('/recipes/recipe/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'recipe_created': recipeCreated })
        });
    });

    $('#recipe-delete-btn').on('click', async () => {
        const res = await fetch('/recipes/recipe/read');
        const [keys, recipes] = await res.json();
        const recipeDeleteNameSelect = $('#recipe-delete-name-select');
        recipeDeleteNameSelect.html(null);
        const emptyOption = document.createElement('option');
        emptyOption.hidden = true;
        recipeDeleteNameSelect.append(emptyOption);
        for (const recipe of recipes) {
            const option = document.createElement('option');
            option.value = JSON.stringify(recipe);
            option.innerText = recipe['name'];
            recipeDeleteNameSelect.append(option);
        }
    });

    $('#recipe-delete-form').on('submit', async () => {
        const recipeDeleted = JSON.parse($('#recipe-delete-name-select').val());
        const res = await fetch('/recipes/recipe/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'recipe_deleted': recipeDeleted })
        });
    });

    $('#recipe-list-btn').on('click', async () => {
        const res = await fetch('/recipes/recipe/list');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Recipes';
        a.click();
    });

    window.addEventListener('load', async () => {
        const res = await fetch('/recipes/recipe/read');
        const [keys, recipes] = await res.json();
        const recipeTable = $('#recipe-table');
        recipeTable.html(null);
        let tr = document.createElement('tr');
        for (const key of keys) {
            const th = document.createElement('th');
            th.innerText = key.split('_').map((e) => e.charAt(0).toUpperCase() + e.substring(1)).join(' ');
            tr.appendChild(th);
        }
        recipeTable.append(tr);
        for (const recipe of recipes) {
            const tr = document.createElement('tr');
            for (const key of keys) {
                const td = document.createElement('td');
                if (['utensils', 'ingredients','notes'].includes(key)) {
                    const ul = document.createElement('ul');
                    for (const item of recipe[key].split('|')) {
                        const li = document.createElement('li');
                        li.innerText = item;
                        ul.appendChild(li);
                    }
                    td.appendChild(ul);
                } else if (key == 'directions') {
                    const ol = document.createElement('ol');
                    for (const item of recipe[key].split('|')) {
                        const li = document.createElement('li');
                        li.innerText = item;
                        ol.appendChild(li);
                    }
                    td.appendChild(ol);
                } else {
                    td.innerText = recipe[key];
                }
                tr.appendChild(td);
            }
            recipeTable.append(tr);
        }
        document.getElementById('recipe-ctr').hidden = false;
    });
});
