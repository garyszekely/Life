import sqlite3

conn = sqlite3.connect('database/users.sqlite')
inventory = conn.cursor()

inventory.execute("CREATE TABLE master (email text, password text)")
conn.commit()

conn.close()