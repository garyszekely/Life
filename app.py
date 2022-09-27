from flask import Flask, render_template, jsonify, send_file, request, Response
import sqlite3
import bcrypt
import requests
from fpdf import FPDF

app = Flask(__name__)

logged_in = False

@app.route('/', methods=['GET'])
def index():
    if logged_in:
        return render_template('homepage.html')
    else:
        return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.get_json()['email']
    password = request.get_json()['password']
    names, users = user_read()

    user = next(filter(lambda user: user['email'] == email, users), None)
    if user is None:
        Response(status=400)

    logged_in = bcrypt.checkpw(password.encode(), user['password'])
    if logged_in:
        return Response(status=200)
    else:
        return Response(status=400)

@app.route('/sign-up', methods=['POST'])
def sign_up():
    email = request.get_json()['email']
    password = request.get_json()['password']
    names, users = user_read()

    user = next(filter(lambda user: user['email'] == email, users), None)

    if user is None:
        logged_in = True
        return Response(status=200)
    else:
        return Response(status=400)

def user_create(email, password):
    names, users = user_read()
    conn = sqlite3.connect('database/users.sqlite')
    users = conn.cursor()

def user_read():
    conn = sqlite3.connect('database/users.sqlite')
    users = conn.cursor()

    users = users.execute('SELECT * FROM groceries')
    names = [description[0] for description in users.description]
    users = list(map(lambda user: { key: value for key, value in zip(names, user) }, users.fetchall()))

    conn.close()
    return (names, users)

def user_update():
    pass

def user_delete():
    pass

@app.route('/inventory', methods=['GET'])
def inventory():
    return render_template('inventory.html')

@app.route('/recipes', methods=['GET'])
def recipes():
    return render_template('recipes.html')

@app.route('/chores', methods=['GET'])
def chores():
    return render_template('chores.html')

@app.route('/finances', methods=['GET'])
def finances():
    return render_template('finances.html')

@app.route('/inventory/grocery/create', methods=['POST'])
def grocery_create():
    names, groceries = grocery_read().get_json()
    grocery_created = request.get_json()['grocery_created']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    inventory.execute('DELETE FROM groceries WHERE store=? AND brand=? AND name=?', (grocery_created['store'], grocery_created['brand'], grocery_created['name']))
    conn.commit()
    inventory.execute(f"INSERT INTO groceries VALUES {tuple([grocery_created[key] for key in names])}")
    conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/inventory/grocery/read', methods=['GET'])
def grocery_read():
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    groceries = inventory.execute('SELECT * FROM groceries')
    names = [description[0] for description in groceries.description]
    groceries = list(map(lambda grocery: { key: value for key, value in zip(names, grocery) }, groceries.fetchall()))

    conn.close()
    return jsonify((names, groceries))

@app.route('/inventory/grocery/update', methods=['POST'])
def grocery_update():
    names, groceries = grocery_read().get_json()
    groceries_updated = request.get_json()['groceries_updated']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    for grocery_updated in groceries_updated:
        inventory.execute('DELETE FROM groceries WHERE store=? AND brand=? AND name=?', (grocery_updated['store'], grocery_updated['brand'], grocery_updated['name']))
        conn.commit()
        inventory.execute(f"INSERT INTO groceries VALUES {tuple([grocery_updated[key] for key in names])}")
        conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/inventory/grocery/delete', methods=['POST'])
def grocery_delete():
    grocery_deleted = request.get_json()['grocery_deleted']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    inventory.execute('DELETE FROM groceries WHERE store=? AND brand=? AND name=?', (grocery_deleted['store'], grocery_deleted['brand'], grocery_deleted['name']))
    conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/inventory/grocery/list', methods=['GET'])
def grocery_list():
    keys, groceries = grocery_read().get_json()

    groceries = list(filter(lambda grocery: grocery['minimum_quantity'] > grocery['current_quantity'], groceries))
    pdf = FPDF()
    pdf.add_page('L')
    pdf.set_font('Arial', size=10)

    line_height = pdf.font_size * 2.5
    col_width = pdf.epw / (len(keys) - 1)

    for key in keys:
        if key != 'grocery_id':
            txt = capwords(key, '_')
            pdf.multi_cell(col_width, line_height, txt=txt, new_x='RIGHT', new_y='TOP')
    pdf.ln()

    for grocery in groceries:
        for key in keys:
            if key != 'grocery_id':
                txt = f"{grocery[key]}"
                pdf.multi_cell(col_width, line_height, txt=txt, new_x='RIGHT', new_y='TOP')
        pdf.ln()
    pdf.output('grocery_list.pdf')
    return send_file('grocery_list.pdf', mimetype='application/pdf')

@app.route('/inventory/cleaning-product/create', methods=['POST'])
def cleaning_product_create():
    names, cleaning_products = cleaning_product_read().get_json()
    cleaning_product_created = request.get_json()['cleaning_product_created']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    inventory.execute('DELETE FROM cleaning_products WHERE store=? AND brand=? AND name=?', (cleaning_product_created['store'], cleaning_product_created['brand'], cleaning_product_created['name']))
    conn.commit()
    inventory.execute(f"INSERT INTO cleaning_products VALUES {tuple([cleaning_product_created[key] for key in names])}")
    conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/inventory/cleaning-product/read', methods=['GET'])
def cleaning_product_read():
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    cleaning_products = inventory.execute('SELECT * FROM cleaning_products')
    names = [description[0] for description in cleaning_products.description]
    cleaning_products = list(map(lambda cleaning_product: { key: value for key, value in zip(names, cleaning_product) }, cleaning_products.fetchall()))

    conn.close()
    return jsonify((names, cleaning_products))

@app.route('/inventory/cleaning-product/update', methods=['POST'])
def cleaning_product_update():
    names, cleaning_products = cleaning_product_read().get_json()
    cleaning_products_updated = request.get_json()['cleaning_products_updated']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    for cleaning_product_updated in cleaning_products_updated:
        inventory.execute('DELETE FROM cleaning_products WHERE store=? AND brand=? AND name=?', (cleaning_product_updated['store'], cleaning_product_updated['brand'], cleaning_product_updated['name']))
        conn.commit()
        inventory.execute(f"INSERT INTO cleaning_products VALUES {tuple([cleaning_product_updated[key] for key in names])}")
        conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/inventory/cleaning-product/delete', methods=['POST'])
def cleaning_product_delete():
    cleaning_product_deleted = request.get_json()['cleaning_product_deleted']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    inventory.execute('DELETE FROM cleaning_products WHERE store=? AND brand=? AND name=?', (cleaning_product_deleted['store'], cleaning_product_deleted['brand'], cleaning_product_deleted['name']))
    conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/inventory/cleaning-product/list', methods=['GET'])
def cleaning_product_list():
    keys, cleaning_products = cleaning_product_read().get_json()

    cleaning_products = list(filter(lambda cleaning_product: cleaning_product['minimum_quantity'] > cleaning_product['current_quantity'], cleaning_products))
    pdf = FPDF()
    pdf.add_page('L')
    pdf.set_font('Arial', size=10)

    line_height = pdf.font_size * 2.5
    col_width = pdf.epw / (len(keys) - 1)

    for key in keys:
        if key != 'cleaning_product_id':
            txt = capwords(key, '_')
            pdf.multi_cell(col_width, line_height, txt=txt, new_x='RIGHT', new_y='TOP')
    pdf.ln()

    for cleaning_product in cleaning_products:
        for key in keys:
            if key != 'cleaning_product_id':
                txt = f"{cleaning_product[key]}"
                pdf.multi_cell(col_width, line_height, txt=txt, new_x='RIGHT', new_y='TOP')
        pdf.ln()
    pdf.output('cleaning_product_list.pdf')
    return send_file('cleaning_product_list.pdf', mimetype='application/pdf')

@app.route('/inventory/receipt/create', methods=['POST'])
def receipt_create():
    receipt_created = request.get_json()['receiptCreated']
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    r = requests.post('https://www.walmart.com/chcwebapp/api/receipts', 
        headers={ 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
        }, 
        json=receipt_created
    )
    receipt = r.json()['receipts'][0]
    items = receipt['items']

    for item in items:
        item_id = item['itemId']
        quantity = item['quantity']

        inventory.execute('UPDATE groceries SET current_quantity=current_quantity + ? WHERE item_id=?', (quantity, item_id))
        conn.commit()
        # inventory.execute('UPDATE cleaning_products SET current_quantity=current_quantity + ? WHERE item_id=?', (quantity, item_id))
        # conn.commit()

@app.route('/inventory/receipt/read', methods=['GET'])
def receipt_read():
    conn = sqlite3.connect('database/inventory.sqlite')
    inventory = conn.cursor()

    receipts = inventory.execute('SELECT * FROM receipts')
    names = [description[0] for description in receipts.description]
    receipts = list(map(lambda receipt: { key: value for key, value in zip(names, receipt)}))

@app.route('/recipes/recipe/create', methods=['POST'])
def recipe_create():
    names, recipes = recipe_read().get_json()
    recipe_created = request.get_json()['recipe_created']
    conn = sqlite3.connect('database/recipes.sqlite')
    recipes = conn.cursor()

    recipes.execute('DELETE FROM master WHERE name=?', (recipe_created['name'], ))
    conn.commit()
    recipes.execute(f"INSERT INTO master VALUES {tuple([recipe_created[key] for key in names])}")
    conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/recipes/recipe/read', methods=['GET'])
def recipe_read():
    conn = sqlite3.connect('database/recipes.sqlite')
    recipes = conn.cursor()

    recipes.execute('SELECT * FROM master')
    names = [description[0] for description in recipes.description]
    recipes = list(map(lambda recipe: { key: value for key, value in zip(names, recipe) }, recipes.fetchall()))

    conn.close()
    return jsonify((names, recipes))

@app.route('/recipes/recipe/update', methods=['POST'])
def recipe_update():
    names, recipes = recipe_read().get_json()
    recipes_updated = request.get_json()['recipes_updated']
    conn = sqlite3.connect('database/recipes.sqlite')
    inventory = conn.cursor()

    for recipe_updated in recipes_updated:
        inventory.execute('DELETE FROM master WHERE name=?', (recipe_updated['name'], ))
        conn.commit()
        inventory.execute(f"INSERT INTO master VALUES {tuple([recipe_updated[key] for key in names])}")
        conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/recipes/recipe/delete', methods=['POST'])
def recipe_delete():
    recipe_deleted = request.get_json()['recipe_deleted']
    conn = sqlite3.connect('database/recipes.sqlite')
    recipes = conn.cursor()

    recipes.execute('DELETE FROM master WHERE name=?', (recipe_deleted['name'], ))
    conn.commit()

    conn.close()
    return Response(status=200)

@app.route('/recipes/recipe/list', methods=['GET'])
def recipe_list():
    keys, recipes = recipe_read().get_json()

@app.route('/finances/income/create', methods=['POST'])
def income_create():
    pass

@app.route('/finances/income/read', methods=['GET'])
def income_read():
    pass

@app.route('/finances/income/update', methods=['POST'])
def income_update():
    pass

@app.route('/finances/income/delete', methods=['POST'])
def income_delete():
    pass
